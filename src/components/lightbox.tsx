'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/lib/firebase/types';

interface LightboxProps {
  image: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function Lightbox({
  image,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation Buttons */}
      {hasPrevious && onPrevious && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 h-12 w-12"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {hasNext && onNext && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 h-12 w-12"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image Container */}
      <div
        className="flex items-center justify-center h-full p-4 md:p-8"
        onClick={onClose}
      >
        <div
          className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative w-full h-[70vh] md:h-[80vh]">
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>

          {/* Image Info */}
          <div className="mt-6 text-center text-white max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h2>
            {image.description && (
              <p className="text-gray-300 mb-4">{image.description}</p>
            )}
            <div className="flex flex-wrap gap-2 justify-center">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
