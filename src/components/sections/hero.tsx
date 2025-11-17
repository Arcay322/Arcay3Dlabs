import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section id="inicio" className="relative h-[80vh] w-full min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {heroImage && (
        <div className="absolute inset-0">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover scale-105 transition-transform duration-700 hover:scale-110"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        </div>
      )}
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="animate-fadeIn">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm font-medium">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Impresión 3D de Alta Precisión
              </span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl animate-slideInLeft">
              De la Idea al Objeto:{" "}
              <span className="gradient-text block mt-2">
                Impresión 3D de Precisión
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-lg text-gray-200 md:text-xl animate-slideInRight leading-relaxed">
              Venta de modelos exclusivos y servicios de impresión 3D bajo demanda. 
              <span className="block mt-2 text-cyan-300 font-semibold">
                Transforma tus ideas en realidad
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <Button 
                asChild 
                size="lg" 
                className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300 text-base font-semibold group"
              >
                <Link href="#tienda" className="flex items-center gap-2">
                  Ver Productos
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="glass-dark border-white/30 hover:bg-white/20 backdrop-blur-md text-base font-semibold"
              >
                <Link href="#servicios">Solicitar Servicio</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto animate-scaleIn" style={{ animationDelay: '0.5s' }}>
              <div className="glass-dark rounded-lg p-4 backdrop-blur-md">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-gray-300 mt-1">Proyectos</div>
              </div>
              <div className="glass-dark rounded-lg p-4 backdrop-blur-md">
                <div className="text-3xl font-bold gradient-text">24h</div>
                <div className="text-sm text-gray-300 mt-1">Entrega Rápida</div>
              </div>
              <div className="glass-dark rounded-lg p-4 backdrop-blur-md">
                <div className="text-3xl font-bold gradient-text">99%</div>
                <div className="text-sm text-gray-300 mt-1">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
