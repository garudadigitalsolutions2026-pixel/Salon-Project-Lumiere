import { motion } from 'motion/react';
import { STYLISTS } from '../constants';

export default function Stylists() {
  return (
    <section className="py-32 px-6 bg-stone-100" id="stylists">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.3em] text-brand-slate/50 block mb-4"
            >
              The Collective
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif"
            >
              Master Artisans
            </motion.h2>
          </div>
          <p className="text-brand-slate/60 max-w-sm text-sm leading-relaxed">
            A hand-picked team from across Central Europe, dedicated to the philosophy of minimalist luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {STYLISTS.map((stylist, index) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative overflow-hidden mb-8 aspect-[3/4]">
                <img 
                  src={stylist.image} 
                  alt={stylist.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-slate/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-xl font-serif mb-1">{stylist.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-brand-slate/40 mb-4">{stylist.role}</p>
              <p className="text-sm text-brand-slate/60 leading-relaxed italic">{stylist.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
