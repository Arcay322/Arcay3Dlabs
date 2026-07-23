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
import { Product3DViewer } from '@/components/ui/product-3d-viewer';
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
  Eye,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/firebase/types';

const PLA_FILAMENTS = [
  { id: 'naranja', name: 'Naranja Incandescente', hex: '#f97316', finish: 'Mate' },
  { id: 'negro', name: 'Negro Carbón', hex: '#18181b', finish: 'Mate' },
  { id: 'blanco', name: 'Blanco Marfil', hex: '#f4f4f5', finish: 'Mate' },
  { id: 'verde', name: 'Verde Neón', hex: '#22c55e', finish: 'Mate' },
  { id: 'azul', name: 'Azul Eléctrico', hex: '#3b82f6', finish: 'Mate' },
  { id: 'rojo', name: 'Rojo Pasión', hex: '#ef4444', finish: 'Mate' },
  { id: 'dorado', name: 'Seda Dorado', hex: '#eab308', finish: 'Seda' },
  { id: 'plata', name: 'Seda Plata', hex: '#94a3b8', finish: 'Seda' },
];

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedFilament, setSelectedFilament] = useState(PLA_FILAMENTS[0]);

  // Estado para Personalización AMS 4 Colores (+50%)
  const [isCustomAMS, setIsCustomAMS] = useState(false);
  const [amsSlots, setAmsSlots] = useState([
    PLA_FILAMENTS[0], // Ranura 1: Naranja
    PLA_FILAMENTS[2], // Ranura 2: Blanco
    PLA_FILAMENTS[1], // Ranura 3: Negro
    PLA_FILAMENTS[3], // Ranura 4: Verde
  ]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Auto-seleccionar la primera variante si existe
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }
      }
    }
  }, [params.id, products, loading]);

  // Imágenes a mostrar: de la variante seleccionada (si tiene) o del producto
  const displayImages = selectedVariant && selectedVariant.images.length > 0
    ? selectedVariant.images
    : product?.images || [];

  // Stock disponible: de la variante o del producto
  const availableStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  // Cálculo de Precio: Base + Ajuste variante + (50% de recargo si es Personalizado AMS por lote único)
  const basePrice = product ? product.price + (selectedVariant?.priceAdjustment || 0) : 0;
  const amsSurcharge = isCustomAMS ? Math.round(basePrice * 0.5 * 100) / 100 : 0;
  const finalPrice = basePrice + amsSurcharge;
  const formattedPrice = formatPrice(finalPrice);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0); // Reset a primera imagen de la variante
    setQuantity(1); // Reset cantidad
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Si el usuario activó la Personalización Multicolor AMS (+50%)
    if (isCustomAMS) {
      const customTitle = `Personalización AMS (R1:${amsSlots[0].name}, R2:${amsSlots[1].name}, R3:${amsSlots[2].name}, R4:${amsSlots[3].name})`;
      const customVariant: ProductVariant = {
        id: `custom_ams_${Date.now()}`,
        name: customTitle,
        colorHex: amsSlots[0].hex,
        images: displayImages,
        stock: availableStock,
        priceAdjustment: amsSurcharge + (selectedVariant?.priceAdjustment || 0),
      };
      addItem(product, quantity, customVariant);
      toast({
        title: '¡Pedido Personalizado AMS!',
        description: `${quantity}x ${product.name} (Tirada Única +50%) agregado al carrito`,
      });
      return;
    }

    // Si el producto tiene variantes regulares, se debe seleccionar una
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast({
        title: 'Selecciona una variante',
        description: 'Por favor elige un color/versión antes de agregar al carrito',
        variant: 'destructive',
      });
      return;
    }

    addItem(product, quantity, selectedVariant || undefined);

    const variantText = selectedVariant ? ` (${selectedVariant.name})` : '';
    toast({
      title: '¡Producto agregado!',
      description: `${quantity}x ${product.name}${variantText} agregado al carrito`,
    });
  };

  const incrementQuantity = () => {
    if (quantity < availableStock) {
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
          {/* Images & 3D Viewer */}
          <div className="space-y-4 animate-slideInLeft">
            {/* Control Bar: Mode Selector */}
            <div className="flex items-center justify-between bg-secondary/50 border border-border p-1 rounded-md">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant={viewMode === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('2d')}
                  className={viewMode === '2d' ? 'gradient-primary font-code text-xs uppercase' : 'font-code text-xs uppercase'}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Fotos (2D)
                </Button>
                <Button
                  type="button"
                  variant={viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                  className={viewMode === '3d' ? 'gradient-primary font-code text-xs uppercase' : 'font-code text-xs uppercase text-primary'}
                >
                  <Box className="mr-1.5 h-3.5 w-3.5" />
                  Visor 3D 360° &amp; AR
                </Button>
              </div>

              <span className="text-[10px] font-code text-primary uppercase font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 rounded hidden sm:inline-block">
                ★ 360° &amp; AR Disponibles
              </span>
            </div>

            {/* Viewport: 2D Gallery vs 3D Interactive Viewer */}
            {viewMode === '3d' ? (
              <Product3DViewer
                product={product}
                colorHex={!isCustomAMS ? selectedVariant?.colorHex : undefined}
                slotColors={isCustomAMS ? amsSlots.map((s) => s.hex) : undefined}
              />
            ) : (
              <div className="aspect-square w-full border-2 border-border bg-muted relative group overflow-hidden rounded-lg">
                <Image
                  src={displayImages[selectedImage] || '/placeholder-product.jpg'}
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
            )}

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {/* Botón directo a Modelo 3D */}
              <button
                onClick={() => setViewMode('3d')}
                className={`aspect-square border-2 transition-all flex flex-col items-center justify-center p-1 rounded-md ${
                  viewMode === '3d'
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/20 scale-95'
                    : 'border-primary/40 bg-secondary/40 hover:border-primary opacity-80 hover:opacity-100'
                }`}
                title="Probar en 3D 360°"
              >
                <Box className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-[9px] font-code text-primary font-bold uppercase mt-1">VISTA 3D</span>
              </button>

              {/* Miniaturas de imágenes 2D */}
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setViewMode('2d');
                  }}
                  className={`aspect-square border-2 transition-all hover:border-primary rounded-md overflow-hidden ${
                    viewMode === '2d' && selectedImage === index
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
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? 'text-primary fill-primary' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-code">
                  (4.0) · 12 reseñas
                </span>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold gradient-text">{formattedPrice}</p>
                {isCustomAMS && (
                  <Badge variant="outline" className="border-primary/50 text-primary font-code text-xs">
                    +50% Producción Única
                  </Badge>
                )}
              </div>
              {isCustomAMS ? (
                <p className="text-xs text-primary font-code mt-1 font-semibold">
                  ⚡ Incluye recargo del +50% ({formatPrice(amsSurcharge)}) por impresión individual y preparación personalizada de 4 canales en AMS.
                </p>
              ) : (
                selectedVariant && selectedVariant.priceAdjustment !== 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Precio base: {formatPrice(product.price)} {selectedVariant.priceAdjustment > 0 ? '+' : ''}{formatPrice(selectedVariant.priceAdjustment)} por variante "{selectedVariant.name}"
                  </p>
                )
              )}
            </div>

            {/* Configurador de Color & Personalización AMS 4 Colores */}
            <Separator />
            <div className="space-y-4">
              {/* Card / Toggle para activar Personalizado AMS (+50%) */}
              <div className={`p-4 border-2 rounded-lg transition-all ${isCustomAMS ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-secondary/20'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="font-code text-sm font-bold uppercase text-foreground">
                        Personalizar 4 Colores AMS (+50%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Configura libremente las 4 ranuras de filamento de tu pieza en tiempo real. <strong>(+50% por tirada de impresión individual)</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isCustomAMS;
                      setIsCustomAMS(nextState);
                      if (nextState) setViewMode('3d');
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isCustomAMS ? 'bg-primary' : 'bg-zinc-700'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isCustomAMS ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {/* Si la personalización AMS está activa, desplegar el seleccionador de 4 ranuras */}
                {isCustomAMS && (
                  <div className="mt-4 pt-3 border-t border-primary/20 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'R1: Cuerpo/Base', slot: 0 },
                        { label: 'R2: Secundario', slot: 1 },
                        { label: 'R3: Detalles', slot: 2 },
                        { label: 'R4: Acentos', slot: 3 },
                      ].map((s) => {
                        const isActive = activeSlot === s.slot;
                        const currentFil = amsSlots[s.slot];
                        return (
                          <button
                            key={s.slot}
                            type="button"
                            onClick={() => setActiveSlot(s.slot)}
                            className={`p-2 border rounded flex flex-col items-start gap-1 transition-all text-left ${isActive ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border bg-background hover:border-primary/50'}`}
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              <span className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: currentFil.hex }} />
                              <span className="text-[11px] font-code font-bold truncate">{s.label}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate w-full">{currentFil.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Paleta para la ranura activa */}
                    <div className="p-3 bg-background rounded border border-border space-y-2">
                      <p className="text-[11px] font-code text-muted-foreground uppercase">
                        Filamento para <strong className="text-primary">Ranura {activeSlot + 1} ({['Cuerpo/Base', 'Secundario', 'Detalles', 'Acentos'][activeSlot]})</strong>:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PLA_FILAMENTS.map((fil) => {
                          const isSelected = amsSlots[activeSlot].id === fil.id;
                          return (
                            <button
                              key={fil.id}
                              type="button"
                              onClick={() => {
                                const newSlots = [...amsSlots];
                                newSlots[activeSlot] = fil;
                                setAmsSlots(newSlots);
                                setViewMode('3d');
                              }}
                              className={`group relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'border-primary ring-2 ring-primary/40 scale-110' : 'border-border hover:scale-105'}`}
                              title={`${fil.name} (${fil.finish})`}
                            >
                              <span className="w-full h-full rounded-full border border-black/20" style={{ backgroundColor: fil.hex }} />
                              {isSelected && <Check className={`absolute h-4 w-4 ${fil.hex === '#f4f4f5' ? 'text-black' : 'text-white'} drop-shadow-md`} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-code uppercase text-muted-foreground tracking-wider">
                    SELECCIONAR VARIANTE
                    {selectedVariant && (
                      <span className="ml-2 text-primary font-bold">→ {selectedVariant.name}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const isOutOfStock = variant.stock === 0;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => !isOutOfStock && handleSelectVariant(variant)}
                          disabled={isOutOfStock}
                          className={`
                            relative flex items-center gap-2 px-3 py-2 border-2 transition-all
                            ${isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : isOutOfStock
                                ? 'border-border/50 opacity-50 cursor-not-allowed'
                                : 'border-border hover:border-primary/50 cursor-pointer'
                            }
                          `}
                          title={isOutOfStock ? 'Agotado' : variant.name}
                        >
                          {/* Color swatch */}
                          {variant.colorHex && (
                            <span
                              className="w-5 h-5 rounded-full border border-border/50 flex-shrink-0"
                              style={{ backgroundColor: variant.colorHex }}
                            />
                          )}
                          <span className="text-sm font-medium">{variant.name}</span>
                          {isOutOfStock && (
                            <span className="text-[10px] font-code text-destructive">AGOTADO</span>
                          )}
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />
            <Separator />

            {/* Quantity Selector - Control Panel Style */}
            <div className="bg-secondary/30 p-4 border border-border">
              <p className="text-xs font-code uppercase text-muted-foreground mb-3 tracking-wider">CANTIDAD OPERATIVA</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-none hover:bg-destructive hover:text-destructive-foreground border-r border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-code text-xl font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={!availableStock || quantity >= availableStock}
                    className="h-12 w-12 rounded-none hover:bg-primary hover:text-primary-foreground border-l border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs font-code">
                  <span className="block text-muted-foreground">ESTADO:</span>
                  <span className={availableStock > 0 ? 'text-green-500 font-bold uppercase' : 'text-destructive font-bold uppercase'}>
                    {availableStock > 0 ? 'DISPONIBLE' : 'NO_DISPONIBLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-0 border border-border p-1 bg-secondary/10">
              <Button
                onClick={handleAddToCart}
                disabled={availableStock === 0}
                className="flex-1 gradient-primary shadow-none hover:brightness-110 active:translate-y-[1px] transition-all duration-75 h-14 text-lg font-code uppercase tracking-widest rounded-none border-0"
                size="lg"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                {availableStock === 0 ? 'ESTADO: AGOTADO' : 'INICIAR PEDIDO'}
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
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-0 border border-border bg-background p-0 rounded-none h-12">
              <TabsTrigger
                value="specs"
                className="rounded-none border-r border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-code uppercase tracking-wider h-full"
              >
                1.0 // ESPECIFICACIONES
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-code uppercase tracking-wider h-full"
              >
                2.0 // DESCRIPCIÓN
              </TabsTrigger>
            </TabsList>

            <div className="border border-border border-t-0 p-6 md:p-8 bg-background relative">
              {/* Technical Corner Markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />

              {/* Tab: Especificaciones Técnicas */}
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
                      {product.sku && (
                        <tr>
                          <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">REF_SKU</td>
                          <td className="px-4 py-3 uppercase">{product.sku}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">REF_CATEGORÍA</td>
                        <td className="px-4 py-3 uppercase">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">ID_MATERIAL</td>
                        <td className="px-4 py-3 text-primary">{product.material}</td>
                      </tr>
                      {product.dimensions && (product.dimensions.width > 0 || product.dimensions.height > 0 || product.dimensions.depth > 0) && (
                        <tr>
                          <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">
                            <span className="flex items-center gap-2"><Ruler className="h-3.5 w-3.5" /> DIMENSIONES</span>
                          </td>
                          <td className="px-4 py-3">
                            {product.dimensions.width}cm × {product.dimensions.height}cm × {product.dimensions.depth}cm
                          </td>
                        </tr>
                      )}
                      {product.weight && product.weight > 0 && (
                        <tr>
                          <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">
                            <span className="flex items-center gap-2"><Weight className="h-3.5 w-3.5" /> PESO_NETO</span>
                          </td>
                          <td className="px-4 py-3">{product.weight}g</td>
                        </tr>
                      )}
                      {/* Atributos adicionales (excluyendo material que ya se muestra arriba) */}
                      {product.attributes && product.attributes
                        .filter(attr => !attr.name.toLowerCase().includes('material'))
                        .map((attr, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground uppercase">
                              {attr.name.replace(/\s+/g, '_')}
                            </td>
                            <td className="px-4 py-3">{attr.value}</td>
                          </tr>
                        ))}
                      <tr>
                        <td className="px-4 py-3 border-r border-border font-semibold text-muted-foreground">ESTADO_STOCK</td>
                        <td className="px-4 py-3">
                          <span className={product.stock > 0 ? 'bg-green-500/10 text-green-500 px-2 py-0.5 border border-green-500/20' : 'bg-destructive/10 text-destructive px-2 py-0.5 border border-destructive/20'}>
                            {product.stock > 0 ? `DISPONIBLE (${product.stock})` : 'AGOTADO'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Tab: Descripción */}
              <TabsContent value="description" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-code text-primary uppercase mb-4 tracking-widest border-b border-border pb-2 inline-block">
                      2.1 // ACERCA DEL PRODUCTO
                    </h3>
                    {product.description ? (
                      <p className="text-muted-foreground leading-relaxed font-sans text-lg">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground/60 leading-relaxed font-sans text-lg italic">
                        Producto fabricado con impresión 3D de alta calidad. Para más detalles técnicos, consulta la pestaña de especificaciones.
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-code text-muted-foreground uppercase mb-3 tracking-widest">
                        2.2 // ETIQUETAS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-code uppercase tracking-wider border border-border bg-secondary/20 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info de fabricación */}
                  <div className="mt-6 bg-secondary/10 border border-border p-4">
                    <h4 className="text-sm font-code text-muted-foreground uppercase mb-3 tracking-widest">
                      2.3 // FABRICACIÓN
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Categoría:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                    </div>
                  </div>
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
