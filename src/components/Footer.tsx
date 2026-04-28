import { motion } from 'motion/react';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-cream border-t border-brand-slate/10 py-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="text-2xl font-serif tracking-widest text-brand-slate mb-8">LUMIÈRE</div>
          <p className="text-sm text-brand-slate/60 leading-relaxed mb-8 max-w-xs">
            A sanctuary of minimalist luxury in the heart of the city. Inspired by Central European precision.
          </p>
          <div className="flex space-x-6 text-brand-slate/40">
            <Instagram className="w-5 h-5 hover:text-brand-slate cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 hover:text-brand-slate cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-slate/40 mb-8">Visit Us</h4>
          <ul className="space-y-4 text-sm text-brand-slate/60">
            <li className="flex items-start gap-4">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>Smetanovo nábř. 334/4<br />Staré Město, 110 00 Prague</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>+420 222 123 456</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>concierge@lumiere.cz</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-slate/40 mb-8">Hours</h4>
          <ul className="space-y-4 text-sm text-brand-slate/60">
            <li className="flex justify-between">
              <span>Mon — Fri</span>
              <span>09:00 - 20:00</span>
            </li>
            <li className="flex justify-between font-medium text-brand-slate">
              <span>Saturday</span>
              <span>10:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-slate/40 mb-8">Journal</h4>
          <p className="text-xs text-brand-slate/60 italic mb-6">Subscribe for exclusive styling tips and seasonal rituals.</p>
          <div className="flex border-b border-brand-slate/20 focus-within:border-brand-slate transition-colors pb-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent text-sm w-full outline-none"
            />
            <button className="text-[10px] uppercase tracking-widest font-semibold ml-4">Join</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-slate/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-brand-slate/30">
        <p>© 2024 Lumière Salon de Coiffure. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand-slate">Privacy Policy</a>
          <a href="#" className="hover:text-brand-slate">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
