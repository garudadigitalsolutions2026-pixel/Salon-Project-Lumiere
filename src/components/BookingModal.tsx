import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Calendar, Clock, Mail, ShieldCheck } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SERVICES, STYLISTS, OPERATING_HOURS } from '../constants';
import { BookingFormData } from '../types';

type BookingStep = 'details' | 'otp' | 'schedule' | 'submitting' | 'success';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<BookingStep>('details');
  const [otpCode, setOtpCode] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    email: '',
    phone: '',
    serviceId: SERVICES[0].id,
    stylistId: STYLISTS[0].id,
    date: new Date().toISOString().split('T')[0],
    time: ''
  });

  // Fetch occupied slots whenever date or stylist changes
  useEffect(() => {
    if (step === 'schedule' && formData.date && formData.stylistId) {
      fetchOccupiedSlots();
    }
  }, [formData.date, formData.stylistId, step]);

  const fetchOccupiedSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('date', '==', formData.date),
        where('stylistId', '==', formData.stylistId),
        where('status', '!=', 'cancelled')
      );
      const snapshot = await getDocs(q);
      const occupied = snapshot.docs.map(doc => doc.data().time);
      setAvailableSlots(OPERATING_HOURS.filter(slot => !occupied.includes(slot)));
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots(OPERATING_HOURS);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    setStep('submitting');
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
        signal: controller.signal
      });
      clearTimeout(id);
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error('Server returned non-JSON response:', text.substring(0, 200));
        throw new Error('Our booking system is currently undergoing maintenance. Please try again in a few minutes.');
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setStep('details');
      const message = err instanceof Error ? err.message : 'Could not send verification code. Please try again.';
      alert(message);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: otpCode }),
        signal: controller.signal
      });
      clearTimeout(id);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Connection error. Please try again.');
      }

      if (res.ok) {
        setStep('schedule');
      } else {
        setOtpError('Invalid or expired code. Please try again.');
      }
    } catch (err) {
      setOtpError('Verification error.');
    }
  };

  const finalizeBooking = async () => {
    if (!formData.time) return;
    setStep('submitting');
    try {
      const selectedService = SERVICES.find(s => s.id === formData.serviceId);
      const selectedStylist = STYLISTS.find(s => s.id === formData.stylistId);

      await addDoc(collection(db, 'bookings'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Send confirmation email via backend
      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          email: formData.email,
          serviceName: selectedService?.name,
          stylistName: selectedStylist?.name,
          date: formData.date,
          time: formData.time
        })
      }).catch(err => console.error('Silent email error:', err));

      setStep('success');
    } catch (error) {
      setStep('schedule');
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep('details');
    setOtpCode('');
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      serviceId: SERVICES[0].id,
      stylistId: STYLISTS[0].id,
      date: new Date().toISOString().split('T')[0],
      time: ''
    });
  };

  return (
    <>
      <button 
        id="booking-trigger" 
        className="hidden" 
        onClick={() => { setIsOpen(true); setStep('details'); }}
      />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="absolute inset-0 bg-brand-slate/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-brand-cream overflow-hidden shadow-2xl"
              id="booking-modal-content"
            >
              <button 
                onClick={resetModal}
                className="absolute top-6 right-6 text-brand-slate/40 hover:text-brand-slate z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto">
                {/* STEP 1: Details */}
                {step === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-3xl font-serif mb-2">The Personal Ritual</h2>
                    <p className="text-sm text-brand-slate/50 mb-8 font-sans">Begin your journey by identifying yourself.</p>
                    
                    <form onSubmit={handleSendOTP} className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold">Full Name</label>
                        <input 
                          required
                          value={formData.clientName}
                          onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                          className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none transition-colors text-sm"
                          placeholder="Elena Svoboda"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold">Email Address</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none transition-colors text-sm"
                          placeholder="elena@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold">Phone Number</label>
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none transition-colors text-sm"
                          placeholder="+420 000 000 000"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-brand-slate text-brand-cream py-4 text-sm uppercase tracking-widest hover:bg-brand-slate/90 transition-all font-medium mt-4 flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Send Verification Code
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* STEP 2: OTP Verification */}
                {step === 'otp' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <ShieldCheck className="w-12 h-12 text-brand-slate/20 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif mb-2">Verify Identity</h2>
                    <p className="text-sm text-brand-slate/50 mb-8 font-sans">
                      A code was sent to <span className="text-brand-slate font-medium">{formData.email}</span>
                    </p>
                    
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                      <input 
                        required
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-transparent border-b border-brand-slate/20 py-4 text-center text-3xl tracking-[0.5em] focus:border-brand-slate outline-none transition-colors"
                        placeholder="000000"
                        autoFocus
                      />
                      {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setStep('details')}
                          className="flex-1 border border-brand-slate/10 py-4 text-xs uppercase tracking-widest hover:bg-brand-slate/5"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 bg-brand-slate text-brand-cream py-4 text-xs uppercase tracking-widest"
                        >
                          Verify Code
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: Scheduling */}
                {step === 'schedule' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-3xl font-serif mb-2">Seasonal Ritual</h2>
                    <p className="text-sm text-brand-slate/50 mb-8 font-sans">Curate your time and artisan.</p>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold">Service</label>
                          <select 
                            className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none text-xs"
                            value={formData.serviceId}
                            onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                          >
                            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold">Artisan</label>
                          <select 
                            className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none text-xs"
                            value={formData.stylistId}
                            onChange={(e) => setFormData({...formData, stylistId: e.target.value})}
                          >
                            {STYLISTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Preferred Date
                        </label>
                        <input 
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value, time: ''})}
                          className="w-full bg-transparent border-b border-brand-slate/20 py-2 focus:border-brand-slate outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-brand-slate/40 font-semibold flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Available Slots
                        </label>
                        {isLoadingSlots ? (
                          <div className="py-4 flex items-center gap-2 text-[10px] text-brand-slate/40">
                            <Loader2 className="w-3 h-3 animate-spin" /> Calculating availability...
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 pt-2">
                            {availableSlots.length > 0 ? (
                              availableSlots.map(slot => (
                                <button
                                  key={slot}
                                  onClick={() => setFormData({...formData, time: slot})}
                                  className={`py-2 text-[10px] border transition-all ${
                                    formData.time === slot 
                                    ? 'bg-brand-slate text-brand-cream border-brand-slate' 
                                    : 'border-brand-slate/10 hover:border-brand-slate'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))
                            ) : (
                              <p className="col-span-4 text-[10px] text-red-400 italic">No slots available for this selection.</p>
                            )}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={finalizeBooking}
                        disabled={!formData.time || isLoadingSlots}
                        className="w-full bg-brand-slate text-brand-cream py-4 text-sm uppercase tracking-widest disabled:opacity-30 transition-all font-medium mt-4"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'submitting' && (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-slate/20 mb-6" />
                    <h3 className="text-2xl font-serif mb-2">Transmitting</h3>
                    <p className="text-sm text-brand-slate/50">Processing your request...</p>
                  </div>
                )}

                {step === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 flex flex-col items-center justify-center text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-8" />
                    <h3 className="text-2xl font-serif mb-4">Awaiting Your Arrival</h3>
                    <p className="text-sm text-brand-slate/50 max-w-xs mx-auto mb-10">
                      Your session is reserved. Check your email for location details and etiquette guidelines.
                    </p>
                    <button 
                      onClick={resetModal}
                      className="border border-brand-slate/20 px-10 py-3 text-xs uppercase tracking-widest hover:bg-brand-slate hover:text-brand-cream transition-all"
                    >
                      Return
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
