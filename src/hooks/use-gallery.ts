'use client';

import { useState, useEffect } from 'react';
import { GalleryImage } from '@/lib/firebase/types';

// Mock gallery data
const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Dragón Mecánico',
    description: 'Impresión 3D de dragón con acabado metalizado en PLA',
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80',
    category: 'Arte',
    tags: ['dragón', 'mecánico', 'PLA', 'metalizado'],
    featured: true,
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '2',
    title: 'Organizador de Escritorio',
    description: 'Sistema modular de organización impreso en PETG',
    imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
    category: 'Utilidades',
    tags: ['organizador', 'escritorio', 'PETG', 'modular'],
    featured: true,
    createdAt: new Date('2024-11-14'),
  },
  {
    id: '3',
    title: 'Maceta Geométrica',
    description: 'Diseño geométrico moderno para plantas pequeñas',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    category: 'Decoración',
    tags: ['maceta', 'geométrico', 'plantas', 'PLA'],
    featured: false,
    createdAt: new Date('2024-11-13'),
  },
  {
    id: '4',
    title: 'Engranajes Funcionales',
    description: 'Set de engranajes interconectados totalmente funcionales',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    category: 'Mecánico',
    tags: ['engranajes', 'mecánico', 'funcional', 'ABS'],
    featured: true,
    createdAt: new Date('2024-11-12'),
  },
  {
    id: '5',
    title: 'Figura de Superhéroe',
    description: 'Figura coleccionable con detalles de alta precisión',
    imageUrl: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&q=80',
    category: 'Juguetes',
    tags: ['superhéroe', 'figura', 'coleccionable', 'resina'],
    featured: false,
    createdAt: new Date('2024-11-11'),
  },
  {
    id: '6',
    title: 'Lámpara Decorativa',
    description: 'Lámpara con diseño paramétrico y acabado translúcido',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
    category: 'Decoración',
    tags: ['lámpara', 'iluminación', 'PLA', 'translúcido'],
    featured: true,
    createdAt: new Date('2024-11-10'),
  },
  {
    id: '7',
    title: 'Porta Celular Plegable',
    description: 'Soporte ajustable para smartphone con múltiples ángulos',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    category: 'Utilidades',
    tags: ['porta', 'celular', 'soporte', 'TPU'],
    featured: false,
    createdAt: new Date('2024-11-09'),
  },
  {
    id: '8',
    title: 'Busto Escultural',
    description: 'Escultura artística con detalles faciales precisos',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    category: 'Arte',
    tags: ['busto', 'escultura', 'arte', 'resina'],
    featured: false,
    createdAt: new Date('2024-11-08'),
  },
  {
    id: '9',
    title: 'Set de Ajedrez Minimalista',
    description: 'Piezas de ajedrez con diseño minimalista y moderno',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
    category: 'Juguetes',
    tags: ['ajedrez', 'minimalista', 'juego', 'PLA'],
    featured: true,
    createdAt: new Date('2024-11-07'),
  },
  {
    id: '10',
    title: 'Carcasa para Arduino',
    description: 'Carcasa protectora personalizada para Arduino Uno',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80',
    category: 'Utilidades',
    tags: ['arduino', 'carcasa', 'electrónica', 'ABS'],
    featured: false,
    createdAt: new Date('2024-11-06'),
  },
  {
    id: '11',
    title: 'Joyero Hexagonal',
    description: 'Caja organizadora con compartimentos para joyería',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    category: 'Decoración',
    tags: ['joyero', 'organizador', 'hexagonal', 'PLA'],
    featured: false,
    createdAt: new Date('2024-11-05'),
  },
  {
    id: '12',
    title: 'Robot Articulado',
    description: 'Robot con articulaciones móviles y partes intercambiables',
    imageUrl: 'https://images.unsplash.com/photo-1561144257-e32e6f7d3c0c?w=800&q=80',
    category: 'Juguetes',
    tags: ['robot', 'articulado', 'móvil', 'PETG'],
    featured: true,
    createdAt: new Date('2024-11-04'),
  },
];

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadGallery = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Firebase call when configured
        // const galleryImages = await getGalleryImages();
        await new Promise(resolve => setTimeout(resolve, 500));
        setImages(mockGalleryImages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error loading gallery'));
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return { images, loading, error };
}

// Get unique categories from gallery
export function useGalleryCategories() {
  const { images } = useGallery();
  const categories = Array.from(new Set(images.map(img => img.category)));
  return categories;
}

// Get unique tags from gallery
export function useGalleryTags() {
  const { images } = useGallery();
  const allTags = images.flatMap(img => img.tags);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags;
}
