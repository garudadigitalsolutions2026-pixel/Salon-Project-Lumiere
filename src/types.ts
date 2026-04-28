export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  category: string;
}

export interface BookingFormData {
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
}
