import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20" id="hero">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=2400" 
            alt="Luxury Salon Interior" 
            className="w-full h-full object-cover brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="block text-brand-cream text-sm uppercase tracking-[0.5em] mb-6 font-medium"
        >
          Est. 1998 — Prague
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-5xl md:text-8xl text-white font-serif italic mb-8 leading-tight"
          id="hero-title"
        >
          L’art de la <br /> Coiffure
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button 
            className="bg-white text-brand-slate px-10 py-4 text-sm uppercase tracking-widest hover:bg-brand-cream transition-all font-medium min-w-[200px]"
            id="hero-cta"
            onClick={() => document.getElementById('booking-trigger')?.click()}
          >
            Schedule Consultation
          </button>
          <a 
            href="#services"
            className="text-white border border-white/30 px-10 py-4 text-sm uppercase tracking-widest hover:bg-white/10 transition-all font-medium backdrop-blur-sm min-w-[200px]"
          >
            Explore Services
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
