import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background py-24 md:py-32">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Input (Manifesto) */}
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-secondary border border-border text-xs font-code text-primary uppercase tracking-wider">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Estado: Operativo
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Taller de <br />
              <span className="text-primary">Manufactura Digital</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-body">
              Convertimos código en materia. Especialistas en <span className="font-semibold text-foreground">impresión FDM</span> con PLA de alta calidad.
              Sin mínimos, sin esperas innecesarias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-code text-sm tracking-wide border-layered"
              >
                <Link href="#tienda">
                  &gt; Explorar Catálogo
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary rounded-sm font-code text-sm tracking-wide"
              >
                <Link href="#servicios">&gt; Iniciar Proyecto</Link>
              </Button>
            </div>

            {/* Technical Specs Footer */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border mt-8">
              <div>
                <div className="font-code text-xs text-muted-foreground uppercase">Precisión</div>
                <div className="font-bold text-xl text-foreground">0.1mm</div>
              </div>
              <div>
                <div className="font-code text-xs text-muted-foreground uppercase">Material</div>
                <div className="font-bold text-xl text-foreground">PLA+</div>
              </div>
              <div>
                <div className="font-code text-xs text-muted-foreground uppercase">Volumen</div>
                <div className="font-bold text-xl text-foreground">220³</div>
              </div>
            </div>
          </div>

          {/* Right Column: Output (Visual) */}
          <div className="relative">
            <div className="relative aspect-square rounded-sm border-2 border-border bg-secondary/30 backdrop-blur-sm p-2">
              {/* Decorative corners */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />

              {heroImage && (
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-zinc-800">
                  <Image
                    src={heroImage.imageUrl}
                    alt="Proceso de impresión 3D"
                    fill
                    className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Overlay Grid */}
                  <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>
              )}
            </div>

            {/* Floating Label */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border p-4 shadow-xl max-w-[200px] hidden md:block animate-float">
              <div className="font-code text-xs text-primary mb-1"> &gt; Sistema Listo</div>
              <div className="text-xs text-muted-foreground">La máquina está lista para recibir tu archivo.</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
