import { Service, Stylist, Testimonial, GalleryItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'precision-cut',
    name: 'Precision Cut',
    description: 'A tailored cut designed to enhance your features and lifestyle.',
    price: '€85',
    duration: '60 min'
  },
  {
    id: 'lumiere-balayage',
    name: 'Lumière Balayage',
    description: 'Sun-kissed, hand-painted highlights for a natural, multi-dimensional look.',
    price: '€180',
    duration: '180 min'
  },
  {
    id: 'keratin-ritual',
    name: 'Keratin Ritual',
    description: 'Transformative treatment for silky, frizz-free hair with intense shine.',
    price: '€220',
    duration: '120 min'
  },
  {
    id: 'editorial-styling',
    name: 'Editorial Styling',
    description: 'Sophisticated event styling inspired by European fashion week.',
    price: '€65',
    duration: '45 min'
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: 'elena-v',
    name: 'Elena Vavra',
    role: 'Creative Director',
    bio: 'With 15 years in Prague and Paris, Elena specializes in architectural cuts and minimalist aesthetics.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'marek-s',
    name: 'Marek Svoboda',
    role: 'Master Colorist',
    bio: 'Marek is renowned for his "invisible" coloring techniques that celebrate the hair\'s natural movement.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hanna-k',
    name: 'Hanna Kovacs',
    role: 'Senior Stylist',
    bio: 'Specializing in texture and bridal editorial, Hanna brings Brno\'s modern flair to every session.',
    image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'viktor-h',
    name: 'Viktor Horvát',
    role: 'Master Barber',
    bio: 'Precision fades and traditional hot towel shaves. Viktor preserves the heritage of Central European barbering.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
  }
];

export const GALLERY: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800', alt: 'Minimalist interior', category: 'Interior' },
  { id: '2', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800', alt: 'Short geometric cut', category: 'Style' },
  { id: '3', url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=800', alt: 'Soft balayage', category: 'Style' },
  { id: '4', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800', alt: 'Minimalist station', category: 'Interior' },
  { id: '5', url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800', alt: 'Male grooming', category: 'Style' },
  { id: '6', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', alt: 'Salon details', category: 'Interior' }
];

export const OPERATING_HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Klara M.',
    text: 'Lumière is exactly what was missing in the city. The minimalist atmosphere and Elena\'s skill are unmatched.',
    rating: 5
  },
  {
    id: 't2',
    name: 'Jakub R.',
    text: 'Professional, quiet, and sophisticated. The precision cut I received is the best I\'ve had in years.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Sofia P.',
    text: 'Beautiful interior and even more beautiful results. Marek is a genius with color.',
    rating: 5
  }
];
