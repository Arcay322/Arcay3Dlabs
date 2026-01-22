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
    <section id="galeria" className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center animate-fadeIn">
          <Badge className="mb-4 gradient-primary">
            Nuestros Proyectos
          </Badge>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Galería de{' '}
            <span className="gradient-text">Trabajos</span>
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
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
                  ? 'gradient-primary shadow-glow'
                  : 'hover:border-primary/50'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-6 text-sm text-muted-foreground">
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
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <p className="text-muted-foreground text-lg">
              No hay proyectos en esta categoría aún
            </p>
          </div>
        )}

        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer animate-fadeIn hover:shadow-2xl transition-all duration-500"
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
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0">
                        {image.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Eye className="h-4 w-4" />
                        <span>Ver más</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {image.featured && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-cyan-500 border-0 shadow-lg">
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
