
export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  image: string;
  category: string;
  carbonFootprint: number;
  ecoScore: number;
  shippingOrigin: string;
  materials: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
  carbonOffset: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AppView = 'landing' | 'login' | 'register' | 'dashboard' | 'product-detail' | 'cart' | 'checkout' | 'success' | 'admin';
