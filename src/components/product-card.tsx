import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/firebase/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product);

    toast({
      title: "¡Producto agregado!",
      description: `${product.name} se agregó al carrito`,
    });
  };
  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const formattedPrice = formatPrice(product.price);

  return (
    <Card className="overflow-hidden bg-background border border-border transition-all duration-300 hover:shadow-lg group relative border-layered">
      <Link href={`/productos/${product.id}`} className="block h-full flex flex-col">
        {/* Technical Header */}
        <div className="border-b border-border bg-secondary/50 px-3 py-1 flex justify-between items-center text-[10px] font-code text-muted-foreground uppercase tracking-wider">
          <span>ID: {product.id.slice(0, 6)}</span>
          <span>ESTADO: EN STOCK</span>
        </div>

        <CardHeader className="p-0 relative border-b border-border">
          <div className="aspect-square w-full relative bg-zinc-100 dark:bg-zinc-900/50">
            {mainImage.startsWith('data:image') ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover p-4 transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {/* Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

            {/* Price Tag - Technical Label Style */}
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-code font-bold px-3 py-1 text-sm shadow-sm z-10">
              {formattedPrice}
            </div>

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                <div className="border-2 border-destructive text-destructive font-code font-bold px-4 py-2 uppercase rotate-[-15deg] text-lg">
                  AGOTADO
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3 flex-1">
          <div className="space-y-1">
            <div className="text-xs font-code text-primary uppercase tracking-tight">{product.category}</div>
            <CardTitle className="font-headline text-lg font-bold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 border border-border/50 p-1 rounded-sm bg-secondary/20">
              <span className="font-code text-[10px] uppercase opacity-70">Material:</span>
              <span className="font-medium text-foreground">PLA</span>
            </div>
            <div className="flex items-center gap-1 border border-border/50 p-1 rounded-sm bg-secondary/20">
              <span className="font-code text-[10px] uppercase opacity-70">Entrega:</span>
              <span className="font-medium text-foreground">24-48h</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full font-code text-xs uppercase tracking-wide bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm"
            size="sm"
          >
            <ShoppingCart className="h-3 w-3 mr-2" />
            {product.stock === 0 ? '> NO DISPONIBLE' : '> AÑADIR AL CARRITO'}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
