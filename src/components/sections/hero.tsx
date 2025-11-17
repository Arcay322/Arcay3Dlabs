import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section id="inicio" className="relative h-[80vh] w-full min-h-[500px] max-h-[900px]">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
              De la Idea al Objeto: Impresión 3D de Precisión
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-200 md:text-xl">
              Venta de modelos exclusivos y servicios de impresión 3D bajo demanda.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="#tienda">Ver Productos</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#servicios">Solicitar Servicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
