import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Layers, Package, ArrowRight } from "lucide-react";
import { TechButton } from "@/components/ui/tech-button";

const processSteps = [
  {
    icon: <Upload className="h-10 w-10 text-neon-cyan" />,
    title: "Sube tu Diseño",
    description: "Envíanos tu archivo .stl o .obj y elige tus especificaciones.",
    number: "01",
  },
  {
    icon: <Layers className="h-10 w-10 text-neon-purple" />,
    title: "Elige el Material",
    description: "Selecciona entre una amplia gama de materiales como PLA, ABS, Resina y más.",
    number: "02",
  },
  {
    icon: <Package className="h-10 w-10 text-neon-cyan" />,
    title: "Recibe tu Pieza",
    description: "Imprimimos y enviamos tu proyecto con la máxima calidad y precisión.",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="materiales" className="w-full py-16 md:py-24 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center animate-fadeIn">
          <span className="text-sm font-semibold text-neon-cyan uppercase tracking-wider drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
            Proceso Simple
          </span>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-2 text-white">
            ¿Cómo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Funcionamos?</span>
          </h2>
          <p className="mt-4 text-gray-400 md:text-xl">
            Nuestro proceso está diseñado para ser simple, rápido y eficiente.
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan/20 via-neon-purple to-neon-cyan/20" />

          <div className="grid gap-8 md:grid-cols-3 relative">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card className="relative flex flex-col items-center text-center transition-all duration-500 border border-white/10 bg-black/40 backdrop-blur-md hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] group overflow-hidden">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center text-white font-bold text-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    {step.number}
                  </div>

                  <CardHeader className="items-center pt-8">
                    <div className="mb-4 rounded-full bg-white/5 p-6 group-hover:scale-110 transition-transform duration-500 relative border border-white/10 group-hover:border-neon-cyan/50">
                      {step.icon}
                      <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <CardTitle className="font-headline text-2xl text-white group-hover:text-neon-cyan transition-colors">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Arrow Icon for Flow */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-neon-purple animate-pulse" />
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg text-gray-300 mb-4">
            ¿Listo para comenzar tu proyecto?
          </p>
          <TechButton
            asChild
            techVariant="neon-cyan"
            glow
            printing
            className="px-8 py-6 text-lg font-bold"
          >
            <a href="#servicios">
              Solicitar Cotización
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </TechButton>
        </div>
      </div>
    </section>
  );
}
