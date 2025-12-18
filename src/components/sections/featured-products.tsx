'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useFeaturedProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const { products, loading, error, usingFallback } = useFeaturedProducts(4);

  return (
    <section id="tienda" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Indicador de Fallback */}
        {usingFallback && (
          <div className="mb-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  Mostrando productos de demostración
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  No se pudo conectar con el inventario en tiempo real. Los productos mostrados son de ejemplo.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left animate-fadeIn">
          <div className="space-y-2">
            <div className="inline-block">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Productos Destacados
              </span>
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Nuestras{" "}
              <span className="gradient-text">Creaciones</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explora nuestra colección de productos únicos, listos para enviar.
            </p>
          </div>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="group border-2 hover:border-primary transition-all duration-300"
          >
            <Link href="/tienda" className="flex items-center gap-2">
              Ver toda la tienda
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {error && (
          <div className="mt-12 p-4 bg-destructive/10 text-destructive rounded-lg animate-fadeIn">
            Error al cargar productos: {error.message}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Enhanced loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 animate-fadeIn">
              <p className="text-muted-foreground text-lg">
                No hay productos destacados disponibles en este momento.
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
