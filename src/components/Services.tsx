import { motion } from 'motion/react';
import { SERVICES } from '../constants';

export default function Services() {
  return (
    <section className="py-32 px-6 bg-brand-cream" id="services">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif mb-6"
          >
            Curated Services
          </motion.h2>
          <div className="w-12 h-px bg-brand-slate mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group border-b border-brand-slate/10 pb-8"
              id={`service-card-${service.id}`}
            >
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl md:text-2xl font-serif group-hover:italic transition-all duration-300">
                  {service.name}
                </h3>
                <span className="text-lg font-serif">{service.price}</span>
              </div>
              <p className="text-sm text-brand-slate/60 leading-relaxed max-w-sm mb-4">
                {service.description}
              </p>
              <span className="text-[10px] uppercase tracking-widest text-brand-slate/40">
                {service.duration}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center text-brand-slate/40 text-xs uppercase tracking-widest italic">
          All services include a signature hair spa ritual & consultantion.
        </div>
      </div>
    </section>
  );
}
