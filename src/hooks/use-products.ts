'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/firebase/types';

// Mock products data - Usar hasta que Firebase esté configurado
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jarrón Geométrico',
    description: 'Hermoso jarrón con diseño geométrico moderno, perfecto para decoración',
    price: 29.99,
    category: 'Decoración',
    material: 'PLA',
    dimensions: { width: 10, height: 15, depth: 10 },
    weight: 200,
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400'],
    stock: 10,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Figurilla de Dragón',
    description: 'Impresionante figura de dragón con detalles increíbles',
    price: 45.00,
    category: 'Arte',
    material: 'Resina',
    dimensions: { width: 12, height: 18, depth: 8 },
    weight: 300,
    images: ['https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400'],
    stock: 5,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Engranaje Mecánico',
    description: 'Engranaje funcional para proyectos mecánicos',
    price: 15.50,
    category: 'Mecánico',
    material: 'ABS',
    dimensions: { width: 8, height: 2, depth: 8 },
    weight: 100,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'],
    stock: 15,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Organizador de Escritorio',
    description: 'Mantén tu escritorio ordenado con este organizador modular',
    price: 22.99,
    category: 'Organizadores',
    material: 'PETG',
    dimensions: { width: 15, height: 8, depth: 10 },
    weight: 250,
    images: ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400'],
    stock: 8,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Porta Llaves Moderno',
    description: 'Organiza tus llaves con estilo',
    price: 12.99,
    category: 'Organizadores',
    material: 'PLA',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    stock: 20,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Maceta Colgante',
    description: 'Maceta decorativa ideal para plantas pequeñas',
    price: 18.50,
    category: 'Decoración',
    material: 'PLA',
    images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'],
    stock: 12,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Soporte para Celular',
    description: 'Soporte ajustable para tu smartphone',
    price: 9.99,
    category: 'Utilidades',
    material: 'TPU',
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'],
    stock: 25,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Figura de Superhéroe',
    description: 'Figura coleccionable de 15cm de altura',
    price: 35.00,
    category: 'Juguetes',
    material: 'Resina',
    images: ['https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400'],
    stock: 7,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Lámpara de Luna',
    description: 'Lámpara decorativa con textura lunar realista',
    price: 42.00,
    category: 'Decoración',
    material: 'PLA',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
    stock: 6,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    name: 'Piezas de Ajedrez',
    description: 'Set completo de piezas de ajedrez diseño moderno',
    price: 55.00,
    category: 'Juguetes',
    material: 'Resina',
    images: ['https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=400'],
    stock: 4,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '11',
    name: 'Carcasa para Arduino',
    description: 'Protección para tu placa Arduino Uno',
    price: 14.99,
    category: 'Mecánico',
    material: 'ABS',
    images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400'],
    stock: 18,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '12',
    name: 'Busto Decorativo',
    description: 'Escultura artística de busto clásico',
    price: 38.00,
    category: 'Arte',
    material: 'Resina',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400'],
    stock: 5,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useProducts(filters?: { category?: string; featured?: boolean; limitCount?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      try {
        let filtered = [...MOCK_PRODUCTS];

        if (filters?.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters?.featured !== undefined) {
          filtered = filtered.filter(p => p.featured === filters.featured);
        }

        if (filters?.limitCount) {
          filtered = filtered.slice(0, filters.limitCount);
        }

        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, 500); // Simular latencia de red

    return () => clearTimeout(timer);
  }, [filters?.category, filters?.featured, filters?.limitCount]);

  return { products, loading, error };
}

export function useFeaturedProducts(limitCount: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      try {
        const featured = MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
        setProducts(featured);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [limitCount]);

  return { products, loading, error };
}
