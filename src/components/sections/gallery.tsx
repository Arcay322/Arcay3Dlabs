'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbox } from '@/components/lightbox';
import { useGallery } from '@/hooks/use-gallery';
import { Eye } from 'lucide-react';
import { GalleryImage } from '@/lib/firebase/types';

const GALLERY_CATEGORIES = ['Todas', 'Arte', 'Decoración', 'Utilidades', 'Mecánico', 'Juguetes'];

export function Gallery() {
  const { images, loading } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter images by category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'Todas') {
      return images;
    }
    return images.filter(img => img.category === selectedCategory);
  }, [images, selectedCategory]);

  // Find current image index for navigation
  const currentImageIndex = filteredImages.findIndex(
    img => img.id === selectedImage?.id
  );

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToNext = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  };

  return (
    <section id="galeria" className="relative w-full py-16 md:py-24 lg:py-32 bg-transparent overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center animate-fadeIn">
          <Badge className="mb-4 bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/20 transition-colors">
            Nuestros Proyectos
          </Badge>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-white">
            Galería de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Trabajos</span>
          </h2>
          <p className="text-lg text-gray-400 md:text-xl">
            Explora algunos de nuestros proyectos completados. Precisión, detalle y acabados profesionales.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mt-12 mb-8 animate-slideInLeft">
          {GALLERY_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-neon-cyan text-black hover:bg-cyan-400 font-bold shadow-[0_0_10px_rgba(0,243,255,0.4)] border-none'
                  : 'bg-transparent border-white/20 text-gray-400 hover:text-white hover:border-neon-cyan/50 hover:bg-white/5'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-6 text-sm text-gray-500">
          {loading ? (
            'Cargando galería...'
          ) : (
            `${filteredImages.length} ${filteredImages.length === 1 ? 'proyecto' : 'proyectos'}`
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <Skeleton className="aspect-square w-full rounded-lg bg-white/5" />
                <Skeleton className="h-5 w-3/4 rounded bg-white/5" />
                <Skeleton className="h-4 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <p className="text-gray-500 text-lg">
              No hay proyectos en esta categoría aún
            </p>
          </div>
        )}

        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer animate-fadeIn border border-white/10 hover:border-neon-cyan/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openLightbox(image)}
              >
                {/* Image */}
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {image.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 text-white">
                        {image.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-neon-cyan text-sm font-medium">
                        <Eye className="h-4 w-4" />
                        <span>Ver más</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {image.featured && (
                  <Badge className="absolute top-3 right-3 bg-neon-purple text-white border-none shadow-[0_0_10px_rgba(189,0,255,0.4)]">
                    ⭐ Destacado
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrevious={goToPrevious}
          hasNext={currentImageIndex < filteredImages.length - 1}
          hasPrevious={currentImageIndex > 0}
        />
      )}
    </section>
  );
}
