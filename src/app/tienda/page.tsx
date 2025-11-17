'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_CATEGORIES } from '@/lib/firebase/types';

export default function TiendaPage() {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortBy !== 'featured';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <Badge className="mb-4 gradient-primary">
              Catálogo Completo
            </Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
              Nuestra{' '}
              <span className="gradient-text">Tienda</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Explora nuestra colección completa de productos impresos en 3D. Encuentra lo que necesitas.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name">Nombre (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Cargando productos...'
              ) : (
                <>
                  Mostrando <span className="font-semibold text-foreground">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'producto' : 'productos'}
                </>
              )}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-lg">
                <X className="h-5 w-5" />
                <p>Error al cargar productos: {error.message}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground mb-6">
                    Intenta ajustar tus filtros o búsqueda
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Ver todos los productos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
