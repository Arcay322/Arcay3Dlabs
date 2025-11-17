import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: string;
    image: ImagePlaceholder | undefined;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        {product.image && (
          <div className="aspect-square w-full relative">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.image.imageHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-lg font-semibold">{product.name}</CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-xl font-bold text-foreground">{product.price}</p>
        <Button>Comprar</Button>
      </CardFooter>
    </Card>
  );
}
