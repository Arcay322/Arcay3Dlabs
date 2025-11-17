import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group border-2 hover:border-primary/50">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {product.featured && (
              <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-cyan-500 border-0 shadow-lg animate-pulse">
                ⭐ Destacado
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Agotado
                </Badge>
              </div>
            )}
            
            {/* Quick View Button - Shows on Hover */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" className="gradient-primary shadow-glow">
                Vista Rápida
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="font-headline text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {product.category}
            </p>
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                Últimas {product.stock} unidades
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex gap-2 items-center p-4 pt-0">
        <div className="flex-1">
          <p className="text-2xl font-bold gradient-text">{formattedPrice}</p>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
