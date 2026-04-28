import { motion } from 'motion/react';
import { GALLERY } from '../constants';

export default function Gallery() {
  return (
    <section className="py-32 bg-brand-cream" id="gallery">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-serif italic mb-4">The Portfolio</h2>
          <p className="text-xs uppercase tracking-widest text-brand-slate/40">Glimpses of our creative workspace and signature styles.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {GALLERY.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden group ${index === 1 ? 'md:row-span-2' : ''}`}
            >
              <img 
                src={item.url} 
                alt={item.alt} 
                className="w-full h-full object-cover aspect-square md:aspect-auto transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-slate/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-[10px] uppercase tracking-[0.3em] font-medium border border-white/40 px-4 py-2 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
