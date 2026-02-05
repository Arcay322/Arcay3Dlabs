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
            <div className="aspect-square w-full border-2 border-border bg-muted relative group overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {/* Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              {product.featured && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 font-code text-xs font-bold uppercase shadow-sm">
                  ★ DESTACADO
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="border-2 border-destructive text-destructive px-6 py-3 font-code text-2xl font-bold uppercase tracking-widest -rotate-12 bg-background/90">
                    AGOTADO
                  </div>
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
                    className={`aspect-square border-2 transition-all hover:border-primary ${selectedImage === index
                      ? 'border-primary ring-1 ring-primary/20 scale-95'
                      : 'border-border opacity-70 hover:opacity-100'
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
                <span className="text-xs font-code text-primary uppercase tracking-wider border border-primary/20 px-2 py-0.5 bg-primary/5">
                  CAT: {product.category}
                </span>
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-xs font-code text-orange-500 uppercase tracking-wider border border-orange-500/20 px-2 py-0.5 bg-orange-500/5">
                    ⚠ STOCK_BAJO: {product.stock}
                  </span>
                )}
              </div>
              <h1 className="font-headline text-3xl md:text-5xl font-bold mb-2 tracking-tight uppercase">
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

            {/* Quantity Selector - Control Panel Style */}
            <div className="bg-secondary/30 p-4 border border-border">
              <p className="text-xs font-code uppercase text-muted-foreground mb-3 tracking-wider">CANTIDAD OPERATIVA</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    onclick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-none hover:bg-destructive hover:text-destructive-foreground border-r border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-code text-xl font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onclick={incrementQuantity}
                    disabled={!product.stock || quantity >= product.stock}
                    className="h-12 w-12 rounded-none hover:bg-primary hover:text-primary-foreground border-l border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs font-code">
                  <span className="block text-muted-foreground">ESTADO:</span>
                  <span className={product.stock > 0 ? 'text-green-500 font-bold uppercase' : 'text-destructive font-bold uppercase'}>
                    {product.stock > 0 ? 'DISPONIBLE' : 'NO_DISPONIBLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-0 border border-border p-1 bg-secondary/10">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gradient-primary shadow-none hover:brightness-110 active:translate-y-[1px] transition-all duration-75 h-14 text-lg font-code uppercase tracking-widest rounded-none border-0"
                size="lg"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                {product.stock === 0 ? 'ESTADO: AGOTADO' : 'INICIAR PEDIDO'}
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

        {/* Product Tabs - Datasheet Style */}
        <div className="mb-16 animate-fadeIn">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-0 border border-border bg-background p-0 rounded-none h-12">
              <TabsTrigger
                value="description"
                className="rounded-none border-r border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-code uppercase tracking-wider h-full"
              >
                1.0 // SINOPSIS
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-code uppercase tracking-wider h-full"
              >
                2.0 // ESPECIFICACIONES
              </TabsTrigger>
            </TabsList>

            <div className="border border-border border-t-0 p-6 md:p-8 bg-background relative">
              {/* Technical Corner Markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />

              <TabsContent value="description" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-code text-primary uppercase mb-4 tracking-widest border-b border-border pb-2 inline-block">
                      1.1 // RESUMEN GENERAL
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-sans text-lg">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-code text-muted-foreground uppercase mb-4 tracking-widest">
                      1.2 // CARACTERÍSTICAS
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      <li className="flex items-center gap-3 border border-border/50 p-2 bg-secondary/5">
                        <div className="h-1.5 w-1.5 bg-primary" />
                        <span className="text-sm font-medium">Tolerancia: ±0.1mm</span>
                      </li>
                      <li className="flex items-center gap-3 border border-border/50 p-2 bg-secondary/5">
                        <div className="h-1.5 w-1.5 bg-primary" />
                        <span className="text-sm font-medium">Grado Material: {product.material}</span>
                      </li>
                      <li className="flex items-center gap-3 border border-border/50 p-2 bg-secondary/5">
                        <div className="h-1.5 w-1.5 bg-primary" />
                        <span className="text-sm font-medium">Acabado: Mate/Texturizado</span>
                      </li>
                      <li className="flex items-center gap-3 border border-border/50 p-2 bg-secondary/5">
                        <div className="h-1.5 w-1.5 bg-primary" />
                        <span className="text-sm font-medium">Altura de Capa: 0.2mm Estándar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-0">
                <div className="overflow-hidden border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/30 text-muted-foreground font-code uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b border-r border-border w-1/3">PARÁMETRO</th>
                        <th className="px-4 py-3 border-b border-border">VALOR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-code">
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">ID_MATERIAL</td>
                        <td className="px-4 py-3 text-primary">{product.material}</td>
                      </tr>
                      {product.dimensions && (
                        <tr>
                          <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">DIMENSIONES (XYZ)</td>
                          <td className="px-4 py-3">
                            {product.dimensions.width}mm x {product.dimensions.height}mm x {product.dimensions.depth}mm
                          </td>
                        </tr>
                      )}
                      {product.weight && (
                        <tr>
                          <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">PESO_NETO</td>
                          <td className="px-4 py-3">{product.weight}g</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">REF_CATEGORÍA</td>
                        <td className="px-4 py-3 uppercase">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">ESTADO_STOCK</td>
                        <td className="px-4 py-3">
                          <span className={product.stock > 0 ? 'bg-green-500/10 text-green-500 px-2 py-0.5 border border-green-500/20' : 'bg-destructive/10 text-destructive px-2 py-0.5 border border-destructive/20'}>
                            {product.stock > 0 ? 'DISPONIBLE' : 'AGOTADO'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </div>
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
