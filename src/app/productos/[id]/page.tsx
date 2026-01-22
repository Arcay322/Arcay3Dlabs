'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/product-card';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Star,
  Minus,
  Plus,
  Ruler,
  Weight,
  Box,
  Check,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/firebase/types';

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [params.id, products, loading]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity);

    toast({
      title: '¡Producto agregado!',
      description: `${quantity}x ${product.name} agregado al carrito`,
    });
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Get related products (same category)
  const relatedProducts = product
    ? products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="text-center max-w-md mx-auto px-4 animate-fadeIn">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El producto que buscas no existe o fue removido
          </p>
          <Button asChild className="gradient-primary">
            <Link href="/tienda">Volver a la Tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedPrice = formatPrice(product.price);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 animate-fadeIn">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tienda">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4 animate-slideInLeft">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-border bg-muted relative group">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-cyan-500 border-0 shadow-lg">
                  ⭐ Destacado
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-6 py-3">
                    Agotado
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${selectedImage === index
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border'
                      }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-slideInRight">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-primary border-primary">
                  {product.category}
                </Badge>
                {product.stock > 0 && product.stock <= 5 && (
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    ¡Solo {product.stock} disponibles!
                  </Badge>
                )}
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">
                {product.name}
              </h1>

              {/* Rating - Mock for now */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.0) · 12 reseñas</span>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Precio</p>
              <p className="text-4xl font-bold gradient-text">{formattedPrice}</p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div>
              <p className="text-sm font-medium mb-3">Cantidad</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={!product.stock || quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.stock > 0
                    ? `${product.stock} unidades disponibles`
                    : 'Sin stock'}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300 h-12 text-lg"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </Button>
            </div>

            {/* Features */}
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Envío Rápido</p>
                      <p className="text-xs text-muted-foreground">3-5 días hábiles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Garantía</p>
                      <p className="text-xs text-muted-foreground">30 días</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Empaque</p>
                      <p className="text-xs text-muted-foreground">Seguro y ecológico</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Calidad</p>
                      <p className="text-xs text-muted-foreground">Impresión premium</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16 animate-fadeIn">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Card className="border-2">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-4">Sobre este producto</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold">Características:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Impreso con tecnología de última generación</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Material de alta calidad: {product.material}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Acabado profesional y duradero</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Diseño único y funcional</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card className="border-2">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-6">Especificaciones Técnicas</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Box className="h-5 w-5 text-primary" />
                        <span className="font-medium">Material</span>
                      </div>
                      <span className="text-muted-foreground">{product.material}</span>
                    </div>
                    {product.dimensions && (
                      <div className="flex items-start justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Ruler className="h-5 w-5 text-primary" />
                          <span className="font-medium">Dimensiones</span>
                        </div>
                        <span className="text-muted-foreground">
                          {product.dimensions.width} × {product.dimensions.height} ×{' '}
                          {product.dimensions.depth} cm
                        </span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex items-start justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Weight className="h-5 w-5 text-primary" />
                          <span className="font-medium">Peso</span>
                        </div>
                        <span className="text-muted-foreground">{product.weight}g</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-medium">Categoría</span>
                      </div>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex items-start justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="font-medium">Stock</span>
                      </div>
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-destructive'}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2">
                Productos <span className="gradient-text">Relacionados</span>
              </h2>
              <p className="text-muted-foreground">
                Otros productos que podrían interesarte
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
