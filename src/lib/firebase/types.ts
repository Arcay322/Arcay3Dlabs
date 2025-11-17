// Types for Firebase collections

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  material: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  images: string[]; // URLs from Firebase Storage
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  material: 'PLA' | 'ABS' | 'PETG' | 'Resina' | 'TPU' | 'Otro';
  quantity: number;
  fileUrl?: string; // URL del archivo STL/OBJ en Storage
  fileName?: string;
  estimatedPrice?: number;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'rejected' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
}

export type MaterialType = 'PLA' | 'ABS' | 'PETG' | 'Resina' | 'TPU' | 'Otro';

export const MATERIALS: MaterialType[] = ['PLA', 'ABS', 'PETG', 'Resina', 'TPU', 'Otro'];

export const PRODUCT_CATEGORIES = [
  'Decoración',
  'Utilidades',
  'Juguetes',
  'Mecánico',
  'Arte',
  'Organizadores',
  'Otro',
] as const;

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const QUOTE_STATUSES = ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'] as const;
