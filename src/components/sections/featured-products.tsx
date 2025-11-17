import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const products = [
  {
    id: '1',
    name: "Jarrón Geométrico",
    price: "$29.99",
    image: PlaceHolderImages.find((img) => img.id === "product-1"),
  },
  {
    id: '2',
    name: "Figurilla de Dragón",
    price: "$45.00",
    image: PlaceHolderImages.find((img) => img.id === "product-2"),
  },
  {
    id: '3',
    name: "Engranaje Mecánico",
    price: "$15.50",
    image: PlaceHolderImages.find((img) => img.id === "product-3"),
  },
  {
    id: '4',
    name: "Organizador de Escritorio",
    price: "$22.99",
    image: PlaceHolderImages.find((img) => img.id === "product-4"),
  },
];

export function FeaturedProducts() {
  return (
    <section id="tienda" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Nuestras Creaciones Destacadas
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explora nuestra colección de productos únicos, listos para enviar.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tienda">
              Ver toda la tienda &rarr;
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
