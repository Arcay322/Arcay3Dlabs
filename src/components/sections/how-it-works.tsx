import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Layers, Package, ArrowRight } from "lucide-react";

const processSteps = [
  {
    icon: <Upload className="h-10 w-10" />,
    title: "Sube tu Diseño",
    description: "Envíanos tu archivo .stl o .obj y elige tus especificaciones.",
    number: "01",
  },
  {
    icon: <Layers className="h-10 w-10" />,
    title: "Detalles de Impresión",
    description: "Trabajamos exclusivamente con PLA para garantizar resultados eco-amigables y precisos.",
    number: "02",
  },
  {
    icon: <Package className="h-10 w-10" />,
    title: "Recibe tu Pieza",
    description: "Imprimimos y enviamos tu proyecto con la máxima calidad y precisión.",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="materiales" className="w-full py-16 md:py-24 lg:py-32 gradient-secondary dark:bg-none dark:bg-deep-space relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center animate-fadeIn">
          <span className="text-sm font-semibold text-primary dark:text-neon-cyan uppercase tracking-wider">
            Proceso Simple
          </span>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-2">
            ¿Cómo{" "}
            <span className="gradient-text dark:gradient-text-cyan-purple">Funcionamos?</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Nuestro proceso está diseñado para ser simple, rápido y eficiente.
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 dark:from-neon-purple/20 dark:via-neon-purple dark:to-neon-purple/20" />

          <div className="grid gap-8 md:grid-cols-3 relative">
            {processSteps.map((step, index) => {
              const isMiddle = index === 1;
              return (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Card className={`relative flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 dark:bg-black/40 dark:backdrop-blur-md group overflow-hidden dark:border-white/10 ${isMiddle
                    ? 'dark:hover:border-neon-purple/50'
                    : 'dark:hover:border-neon-cyan/50'
                    }`}>
                    {/* Number Badge */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 bg-gradient-to-br from-primary to-cyan-500 dark:from-neon-cyan dark:to-neon-purple opacity-10 group-hover:opacity-100">
                      {step.number}
                    </div>

                    <CardHeader className="items-center pt-8">
                      <div className={`mb-4 rounded-full p-6 group-hover:scale-110 transition-transform duration-500 relative ${isMiddle
                        ? 'bg-gradient-to-br from-primary/10 to-cyan-500/10 dark:from-neon-purple/10 dark:to-fuchsia-500/10'
                        : 'bg-gradient-to-br from-primary/10 to-cyan-500/10 dark:from-neon-cyan/10 dark:to-cyan-500/10'
                        }`}>
                        <div className={`transition-colors ${isMiddle ? 'text-primary dark:text-neon-purple' : 'text-primary dark:text-neon-cyan'}`}>
                          {step.icon}
                        </div>
                        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${isMiddle
                          ? 'bg-primary/20 dark:bg-neon-purple/20 group-hover:bg-primary/40 dark:group-hover:bg-neon-purple/40'
                          : 'bg-primary/20 dark:bg-neon-cyan/20 group-hover:bg-primary/40 dark:group-hover:bg-neon-cyan/40'
                          }`} />
                      </div>
                      <CardTitle className={`font-headline text-2xl transition-colors ${isMiddle
                        ? 'group-hover:text-primary dark:group-hover:text-neon-purple'
                        : 'group-hover:text-primary dark:group-hover:text-neon-cyan'
                        }`}>
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>

                    {/* Arrow Icon for Flow */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 z-10">
                        <ArrowRight className={`w-8 h-8 animate-pulse ${isMiddle ? 'text-primary dark:text-neon-purple' : 'text-primary dark:text-neon-cyan'}`} />
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg text-muted-foreground mb-4">
            ¿Listo para comenzar tu proyecto?
          </p>
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 px-8 py-3 gradient-primary dark:bg-none dark:gradient-cyan dark:text-black text-white rounded-lg font-semibold shadow-glow hover:shadow-glow-lg dark:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300 group"
          >
            Solicitar Cotización
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
