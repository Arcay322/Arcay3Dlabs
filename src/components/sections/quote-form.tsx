"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechButton } from "@/components/ui/tech-button";
import { TechLoader } from "@/components/ui/tech-loader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/schemas";
import { MATERIALS } from "@/lib/firebase";
import { uploadQuoteFile } from "@/lib/firebase/quotes";
import { ventifyAPI } from "@/lib/ventify-api";

export function QuoteForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
      quantity: 1,
      material: "PLA",
    },
  });

  async function onSubmit(data: QuoteFormValues) {
    try {
      setIsSubmitting(true);

      let fileUrl: string | undefined;
      let fileName: string | undefined;

      if (data.file && data.file.length > 0) {
        try {
          const file = data.file[0];
          fileName = file.name;
          fileUrl = await uploadQuoteFile(file);
        } catch (e) {
          console.warn('No se pudo subir el archivo:', e);
          toast({
            title: "Advertencia",
            description: "No se pudo adjuntar el archivo (servicio de almacenamiento no disponible), pero enviaremos tu cotización.",
            variant: "default", // Orange/Yellow warning would be better but default is fine
          });
        }
      }

      await ventifyAPI.createQuote({
        customerName: data.name,
        email: data.email,
        phone: data.phone,
        description: data.description,
        material: data.material,
        quantity: data.quantity,
        fileUrl,
        fileName,
      });

      console.log('Cotización enviada a Ventify:', data);

      toast({
        title: "¡Cotización enviada!",
        description: "Gracias por tu interés. Nos pondremos en contacto contigo en las próximas 24-48 horas.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu cotización. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="servicios" className="w-full py-16 md:py-24 lg:py-32 bg-transparent relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className="space-y-6 animate-slideInLeft">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              ¿Tienes un <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Proyecto</span> en Mente?
            </h2>
            <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed">
              Describe tu idea o sube tu modelo 3D. Ofrecemos impresión en PLA, ABS, PETG, Resina y TPU con acabados profesionales.
            </p>

            <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="font-semibold text-neon-cyan text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_#00f3ff]" />
                Materiales Disponibles
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="text-neon-purple">•</span> <strong>PLA:</strong> Prototipos y decoración</li>
                <li className="flex items-center gap-2"><span className="text-neon-purple">•</span> <strong>ABS:</strong> Resistencia mecánica</li>
                <li className="flex items-center gap-2"><span className="text-neon-purple">•</span> <strong>PETG:</strong> Flexible y resistente</li>
                <li className="flex items-center gap-2"><span className="text-neon-purple">•</span> <strong>Resina:</strong> Alta precisión</li>
                <li className="flex items-center gap-2"><span className="text-neon-purple">•</span> <strong>TPU:</strong> Flexible y elástico</li>
              </ul>
            </div>

            <p className="text-gray-400 italic border-l-2 border-neon-purple pl-4">
              "Nuestro equipo de expertos revisará tu solicitud y te enviará una cotización detallada lo antes posible."
            </p>
          </div>

          <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md animate-scaleIn">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-white">Solicitar Cotización</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} className="bg-white/5 border-white/10 text-white focus:border-neon-cyan/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} className="bg-white/5 border-white/10 text-white focus:border-neon-cyan/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+52 123 456 7890" {...field} className="bg-white/5 border-white/10 text-white focus:border-neon-cyan/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Material *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-neon-cyan/50">
                                <SelectValue placeholder="Selecciona un material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black/90 border-white/10 text-white">
                              {MATERIALS.map((material) => (
                                <SelectItem key={material} value={material} className="focus:bg-neon-cyan/20 focus:text-white">
                                  {material}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Cantidad *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              className="bg-white/5 border-white/10 text-white focus:border-neon-cyan/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Descripción del Proyecto *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe las dimensiones, el uso previsto, color deseado y cualquier otro detalle importante..."
                            className="min-h-[120px] bg-white/5 border-white/10 text-white focus:border-neon-cyan/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Adjuntar Archivo 3D (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".stl,.obj,.3mf,.gcode"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                            className="h-11 cursor-pointer bg-white/5 border-white/10 text-white file:text-neon-cyan file:bg-transparent file:border-0 file:mr-4 file:font-semibold hover:file:text-neon-purple transition-colors"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">
                          Formatos aceptados: STL, OBJ, 3MF, GCODE. Tamaño máximo: 50MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <TechButton
                    type="submit"
                    techVariant="neon-cyan"
                    glow
                    printing
                    className="w-full font-bold"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <TechLoader size="sm" className="mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Solicitar Cotización
                      </>
                    )}
                  </TechButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
