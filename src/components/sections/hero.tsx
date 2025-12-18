import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Scene3D } from "@/components/ui/scene-3d";
import { TechButton } from "@/components/ui/tech-button";

export function Hero() {
  return (
    <section id="inicio" className="relative h-[80vh] w-full min-h-[500px] max-h-[900px] overflow-hidden flex items-center justify-center">
      {/* 3D Scene Background */}
      <Scene3D />

      {/* Gradient Overlay - Lighter to show 3D */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 md:px-6 w-full max-w-5xl mx-auto">
        <div className="space-y-8 backdrop-blur-sm bg-black/10 p-8 rounded-3xl border border-white/5">
          {/* Badge */}
          <div className="animate-fadeIn flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm font-medium border border-neon-cyan/30 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <Sparkles className="w-4 h-4" />
              Impresión 3D Next-Gen
            </span>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl animate-slideInLeft">
            De la Idea al Objeto:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple block mt-2 drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
              Realidad Tangible
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg text-gray-300 md:text-xl animate-slideInRight leading-relaxed font-light">
            Servicios de impresión 3D de alta precisión y venta de modelos exclusivos.
            <span className="block mt-2 text-white font-medium">
              Materializa tu imaginación.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fadeIn pt-4" style={{ animationDelay: '0.3s' }}>
            <TechButton
              asChild
              size="lg"
              techVariant="neon-cyan"
              glow
              className="text-base"
            >
              <Link href="#tienda" className="flex items-center gap-2">
                Ver Catálogo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </TechButton>
            <TechButton
              asChild
              size="lg"
              techVariant="outline-purple"
              className="backdrop-blur-md text-base font-semibold text-white"
            >
              <Link href="#servicios">Cotizar Proyecto</Link>
            </TechButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto animate-scaleIn border-t border-white/10 mt-8" style={{ animationDelay: '0.5s' }}>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white font-headline">500+</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-wider">Proyectos</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white font-headline">24h</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-wider">Entrega Rápida</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white font-headline">100%</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-wider">Calidad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-neon-cyan/30 flex items-start justify-center p-2 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
          <div className="w-1 h-3 bg-neon-cyan rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
