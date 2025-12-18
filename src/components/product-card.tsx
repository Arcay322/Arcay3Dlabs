import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechButton } from "@/components/ui/tech-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
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

  // Usar imagen de placeholder de Unsplash si no hay imagen disponible
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1635774853448-f733a4c60e4c?w=400';

  const formattedPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <Card className="overflow-hidden transition-all duration-500 hover:-translate-y-2 group border border-white/10 bg-black/40 backdrop-blur-md hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]">
      <Link href={`/productos/${product.id}`}>
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="aspect-square w-full relative">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {product.featured && (
              <Badge className="absolute top-3 right-3 bg-neon-purple text-white border-none shadow-[0_0_10px_rgba(189,0,255,0.4)] animate-pulse">
                ⭐ Destacado
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2 font-bold tracking-wider">
                  AGOTADO
                </Badge>
              </div>
            )}

            {/* Quick View Button - Shows on Hover */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <TechButton size="sm" techVariant="glass" className="transition-all duration-300">
                <Eye className="w-4 h-4 mr-2" />
                Vista Rápida
              </TechButton>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="font-headline text-lg font-semibold line-clamp-2 text-white group-hover:text-neon-cyan transition-colors">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_5px_#bd00ff]" />
              {product.category}
            </p>
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400 bg-orange-500/10">
                Últimas {product.stock}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex gap-2 items-center p-4 pt-0">
        <div className="flex-1">
          <p className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{formattedPrice}</p>
        </div>
        <TechButton
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          techVariant="neon-cyan"
          size="sm"
          glow
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </TechButton>
      </CardFooter>
    </Card>
  );
}
