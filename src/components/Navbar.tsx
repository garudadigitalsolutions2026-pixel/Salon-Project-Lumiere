import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-slate/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-serif tracking-widest text-brand-slate"
          id="nav-logo"
        >
          LUMIÈRE
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {['Services', 'Stylists', 'Gallery', 'Testimonials'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm uppercase tracking-widest hover:text-brand-slate/60 transition-colors"
              id={`nav-link-${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
          <button 
            className="bg-brand-slate text-brand-cream px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-slate/90 transition-all font-medium"
            id="nav-book-btn"
            onClick={() => document.getElementById('booking-trigger')?.click()}
          >
            Book Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          id="nav-mobile-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-brand-cream border-b border-brand-slate/10 p-8 space-y-6"
          id="nav-mobile-menu"
        >
          {['Services', 'Stylists', 'Gallery', 'Testimonials'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="block text-lg font-serif tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <button 
            className="w-full bg-brand-slate text-brand-cream py-4 text-sm uppercase tracking-widest"
            onClick={() => {
              setIsOpen(false);
              document.getElementById('booking-trigger')?.click();
            }}
          >
            Book Now
          </button>
        </motion.div>
      )}
    </nav>
  );
}
