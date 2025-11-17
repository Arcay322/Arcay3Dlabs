import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Layers, Package } from "lucide-react";

const processSteps = [
  {
    icon: <Upload className="h-10 w-10 text-primary" />,
    title: "Sube tu Diseño",
    description: "Envíanos tu archivo .stl o .obj y elige tus especificaciones.",
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "Elige el Material",
    description: "Selecciona entre una amplia gama de materiales como PLA, ABS, Resina y más.",
  },
  {
    icon: <Package className="h-10 w-10 text-primary" />,
    title: "Recibe tu Pieza",
    description: "Imprimimos y enviamos tu proyecto con la máxima calidad y precisión.",
  },
];

export function HowItWorks() {
  return (
    <section id="materiales" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            ¿Cómo Funcionamos?
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Nuestro proceso está diseñado para ser simple, rápido y eficiente.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <Card key={index} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
