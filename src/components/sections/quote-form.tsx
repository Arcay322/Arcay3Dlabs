"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
// import { createQuoteRequest, uploadQuoteFile } from "@/lib/firebase"; // TODO: Descomentar cuando Firebase esté configurado

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

      // TODO: Cuando Firebase esté configurado, descomentar esto
      // let fileUrl: string | undefined;
      // let fileName: string | undefined;

      // if (data.file && data.file.length > 0) {
      //   const file = data.file[0];
      //   fileName = file.name;
      //   fileUrl = await uploadQuoteFile(file);
      // }

      // await createQuoteRequest({
      //   customerName: data.name,
      //   customerEmail: data.email,
      //   customerPhone: data.phone,
      //   description: data.description,
      //   material: data.material,
      //   quantity: data.quantity,
      //   fileUrl,
      //   fileName,
      // });

      // Por ahora solo simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Cotización (modo demo):', data);

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
    <section id="servicios" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¿Tienes un Proyecto en Mente?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Describe tu idea o sube tu modelo 3D. Ofrecemos impresión en PLA, ABS, PETG, Resina y TPU con acabados profesionales.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Materiales Disponibles:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>PLA:</strong> Ideal para prototipos y decoración</li>
                <li><strong>ABS:</strong> Mayor resistencia mecánica</li>
                <li><strong>PETG:</strong> Flexible y resistente</li>
                <li><strong>Resina:</strong> Alta precisión y detalles finos</li>
                <li><strong>TPU:</strong> Flexible y elástico</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              Nuestro equipo de expertos revisará tu solicitud y te enviará una cotización detallada lo antes posible.
            </p>
          </div>
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Solicitar Cotización</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
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
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+52 123 456 7890" {...field} />
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
                          <FormLabel>Material *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIALS.map((material) => (
                                <SelectItem key={material} value={material}>
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
                          <FormLabel>Cantidad *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                        <FormLabel>Descripción del Proyecto *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe las dimensiones, el uso previsto, color deseado y cualquier otro detalle importante..."
                            className="min-h-[120px]"
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
                        <FormLabel>Adjuntar Archivo 3D (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".stl,.obj,.3mf,.gcode"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                            className="h-11 cursor-pointer"
                          />
                        </FormControl>
                        <FormDescription>
                          Formatos aceptados: STL, OBJ, 3MF, GCODE. Tamaño máximo: 50MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Solicitar Cotización
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
