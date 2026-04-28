import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { BrevoClient } from '@getbrevo/brevo';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = express();
const PORT = 3000;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const brevo = process.env.BREVO_API_KEY ? new BrevoClient({ apiKey: process.env.BREVO_API_KEY }) : null;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'concierge@lumiere.cz';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Lumière Salon';

// No longer using memory store
// const otpStore = new Map<string, { code: string; expires: number }>();

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    // 1. Store OTP in Firestore
    await setDoc(doc(db, 'otps', email), { 
      code, 
      expires: Date.now() + 10 * 60 * 1000 
    });
    console.log(`[AUTH] Generating OTP for ${email}: ${code}`);

    // 2. Send email via Brevo
    if (brevo) {
      console.log(`[AUTH] Attempting to send email via Brevo to ${email}`);
      await brevo.transactionalEmails.sendTransacEmail({
        subject: 'Verification Code - Lumière',
        htmlContent: `
          <div style="font-family: serif; color: #2c3e50; padding: 20px; border: 1px solid #eee;">
            <h2 style="letter-spacing: 2px;">LUMIÈRE</h2>
            <p>Your verification code for your luxury session is:</p>
            <h1 style="letter-spacing: 10px; color: #2c3e50;">${code}</h1>
            <p style="font-size: 12px; color: #999;">This code expires in 10 minutes.</p>
          </div>
        `,
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email }]
      });
      console.log(`[AUTH] Email sent successfully via Brevo to ${email}`);
    } else {
      console.warn(`[AUTH] NO BREVO API KEY: OTP for ${email} is ${code}`);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('[AUTH] OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'OTP_SERVICE_FAILURE',
      message: 'We could not process your request at this time.'
    });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const otpDoc = await getDoc(doc(db, 'otps', email));
    const stored = otpDoc.data();

    if (stored && stored.code === code && stored.expires > Date.now()) {
      await deleteDoc(doc(db, 'otps', email)); // One-time use
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }
  } catch (error) {
    console.error('[AUTH] Verify OTP error:', error);
    res.status(500).json({ error: 'Verification system error' });
  }
});

app.post('/api/send-confirmation', async (req, res) => {
  const { clientName, email, serviceName, stylistName, date, time } = req.body;
  
  if (!email || !clientName) return res.status(400).json({ error: 'Missing information' });

  try {
    if (brevo) {
      await brevo.transactionalEmails.sendTransacEmail({
        subject: 'Confirmed: Your Session at Lumière',
        htmlContent: `
          <div style="font-family: serif; color: #2c3e50; padding: 40px; background-color: #f9f7f2; max-width: 600px; margin: auto;">
            <h1 style="text-align: center; letter-spacing: 5px; font-weight: normal;">LUMIÈRE</h1>
            <hr style="border: 0; border-top: 1px solid #2c3e50; opacity: 0.1; margin: 30px 0;" />
            <p>Dear ${clientName},</p>
            <p>Your luxury experience has been reserved. We look forward to welcoming you to our sanctuary.</p>
            <div style="margin: 30px 0; padding: 20px; border: 1px solid rgba(44, 62, 80, 0.1);">
              <p style="margin: 5px 0;"><strong>Artisan:</strong> ${stylistName}</p>
              <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            </div>
            <p style="font-size: 12px; color: #7f8c8d; text-align: center; margin-top: 40px;">
              Smetanovo nábř. 334/4, Staré Město, 110 00 Prague<br />
              Please arrive 5 minutes early for your signature tea ritual.
            </p>
          </div>
        `,
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email }]
      });
      console.log(`[AUTH] Confirmation email sent via Brevo to ${email}`);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('[AUTH] Confirmation email error:', error);
    res.status(500).json({ error: 'Failed to send confirmation' });
  }
});

// Only setup Vite/static if NOT on Vercel (Vercel handles static via vercel.json)
if (!process.env.VERCEL) {
  async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      if (require('fs').existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
  startServer();
}

export default app;
