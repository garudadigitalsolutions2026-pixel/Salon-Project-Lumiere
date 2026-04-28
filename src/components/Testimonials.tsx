import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-32 bg-brand-slate text-brand-cream overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 relative">
        <Quote className="absolute top-0 left-0 w-32 h-32 text-white/5 -translate-x-12 -translate-y-12" />
        
        <div className="text-center mb-24">
          <h2 className="text-4xl font-serif mb-4">Client Reverie</h2>
          <div className="w-12 h-px bg-white/20 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60" />
                ))}
              </div>
              <p className="text-lg font-serif italic mb-8 leading-relaxed text-white/90">
                "{t.text}"
              </p>
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">{t.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-32 border-t border-white/10 pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {['Vogue', 'Harper\'s Bazaar', 'Elle', 'Prague Post'].map((press) => (
            <span key={press} className="text-xs uppercase tracking-widest text-white/20 font-medium">{press}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
