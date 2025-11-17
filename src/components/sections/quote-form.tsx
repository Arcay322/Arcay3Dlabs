"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/schemas";

export function QuoteForm() {
  const { toast } = useToast();
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
    },
  });

  const fileRef = form.register("file");

  function onSubmit(data: QuoteFormValues) {
    console.log(data);
    toast({
      title: "¡Cotización enviada!",
      description: "Gracias por tu interés. Nos pondremos en contacto contigo pronto.",
    });
    form.reset();
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
              Describe tu idea o sube tu modelo 3D. Ofrecemos impresión en PLA, ABS y Resina con acabados profesionales. Ideal para prototipos, maquetas o piezas finales.
            </p>
            <p className="text-muted-foreground md:text-xl/relaxed">
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
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción de tu proyecto</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe las dimensiones, el uso previsto, el material y cualquier otro detalle importante."
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adjuntar Archivo (.stl, .obj)</FormLabel>
                        <FormControl>
                          <Input type="file" accept=".stl,.obj" {...fileRef} className="h-11" />
                        </FormControl>
                         <FormDescription>
                          Tamaño máximo: 5MB.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Solicitar Cotización
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
