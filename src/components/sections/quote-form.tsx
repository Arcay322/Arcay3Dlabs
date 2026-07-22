"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Send, Loader2, FileCode, Trash2, Sparkles, MessageCircle, Info } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/schemas";
import { MATERIALS } from "@/lib/firebase";
import { STLViewer } from "@/components/ui/stl-viewer";
import { STLAnalysisResult } from "@/lib/stl-utils";
import { siteConfig } from "@/config/site";

export function QuoteForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [stlMetrics, setStlMetrics] = useState<STLAnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const selectedMaterial = form.watch("material");
  const selectedQuantity = form.watch("quantity") || 1;

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!["stl", "obj", "3mf"].includes(ext || "")) {
      toast({
        variant: "destructive",
        title: "Formato no compatible",
        description: "Por favor selecciona un archivo .STL u .OBJ para el análisis 3D.",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo muy pesado",
        description: "El tamaño máximo permitido es 50MB.",
      });
      return;
    }

    setStlFile(file);
  };

  const removeSelectedFile = () => {
    setStlFile(null);
    setStlMetrics(null);
  };

  async function onSubmit(data: QuoteFormValues) {
    try {
      setIsSubmitting(true);

      const phoneNumber = siteConfig.contact.whatsapp;

      let message = `*⚙️ NUEVA SOLICITUD DE COTIZACIÓN 3D*\n\n`;
      message += `*👤 Cliente:* ${data.name}\n`;
      message += `*📧 Email:* ${data.email}\n`;
      if (data.phone) message += `*📞 Teléfono:* ${data.phone}\n`;
      message += `\n*📦 Especificaciones:*`;
      message += `\n• *Material:* ${data.material}`;
      message += `\n• *Cantidad:* ${data.quantity} unidad(es)`;
      message += `\n• *Relleno (Infill):* ${infillPercent}%`;

      if (stlFile && stlMetrics) {
        message += `\n\n*📐 Análisis del Modelo 3D (STL):*`;
        message += `\n• *Archivo:* ${stlFile.name}`;
        message += `\n• *Medidas:* ${stlMetrics.dimensions.x} × ${stlMetrics.dimensions.y} × ${stlMetrics.dimensions.z} mm`;
        message += `\n• *Volumen:* ${stlMetrics.volumeCm3} cm³`;
        message += `\n• *Peso Est.:* ≈ ${stlMetrics.weightGrams} g`;
        message += `\n• *Cotización Referencial:* S/ ${stlMetrics.estimatedPrice.toFixed(2)} (Rango S/ ${stlMetrics.estimatedPriceMin} - S/ ${stlMetrics.estimatedPriceMax})`;
      }

      if (data.description) {
        message += `\n\n*📝 Notas del Proyecto:*\n${data.description}`;
      }

      message += `\n\n_Enviado desde el Cotizador en Vivo de Arcay3DLabs_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

      toast({
        title: "¡Cotización generada!",
        description: "Conectando con un asesor técnico por WhatsApp...",
      });

      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error al enviar cotización:", error);
      toast({
        title: "Error al generar cotización",
        description: "Intenta nuevamente o contáctanos directamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="servicios" className="w-full py-16 md:py-24 lg:py-32 bg-secondary dark:bg-deep-space relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Columna Izquierda: Información de Capacidades */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/30 text-xs font-code text-primary uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Cotizador en Tiempo Real
            </div>

            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¿Tienes un <span className="gradient-text dark:gradient-text-cyan-purple">Proyecto 3D</span> en Mente?
            </h2>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-body">
              Sube tu modelo en formato <strong className="text-foreground">.STL</strong> u <strong className="text-foreground">.OBJ</strong> para analizar al instante sus medidas, volumen y peso en gramos, o describe tu idea para asesorarte desde cero.
            </p>

            {/* Tarjetas de Materiales */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 border border-border rounded-sm bg-background/60 backdrop-blur-sm">
                <h4 className="font-code text-xs text-primary font-bold uppercase mb-1">Impresión FDM (PLA / PETG)</h4>
                <p className="text-xs text-muted-foreground">Piezas funcionales, prototipos de ingeniería, carcazas y decoración.</p>
              </div>
              <div className="p-3 border border-border rounded-sm bg-background/60 backdrop-blur-sm">
                <h4 className="font-code text-xs text-primary font-bold uppercase mb-1">Impresión Resina UV</h4>
                <p className="text-xs text-muted-foreground">Figuras de alta resolución, joyería, miniaturas y acabados lisos.</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 border border-primary/20 rounded-sm bg-primary/5 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Procesamiento seguro en tu navegador</p>
                <p>El análisis 3D se realiza en tu dispositivo. Tu archivo no se almacena en servidores de terceros.</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario + Visualizador 3D */}
          <Card className="shadow-2xl border-layered bg-card">
            <CardHeader className="border-b border-border bg-secondary/30">
              <CardTitle className="font-headline text-2xl flex items-center justify-between">
                <span>Solicitar Cotización 3D</span>
                <Badge variant="outline" className="font-code text-[10px] uppercase">
                  Análisis Instantáneo
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Zona de Drag & Drop de Archivo 3D */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Adjuntar Archivo 3D (.STL / .OBJ)</label>

                {!stlFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFileSelect(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-md p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : "border-border hover:border-primary/50 bg-secondary/20"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".stl,.obj"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                      id="stl-file-input"
                    />
                    <label htmlFor="stl-file-input" className="cursor-pointer space-y-2 block">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Arrastra tu archivo .STL u .OBJ aquí
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          o haz clic para explorar tu dispositivo (Máx. 50MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="p-3 border border-border rounded-md bg-secondary/40 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <FileCode className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate font-code">{stlFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(stlFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeSelectedFile}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Quitar
                    </Button>
                  </div>
                )}
              </div>

              {/* Visualizador 3D interactivo si hay archivo cargado */}
              {stlFile && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-code uppercase text-primary block font-medium">
                    &gt; Vista Previa 3D &amp; Métricas
                  </label>
                  <STLViewer
                    file={stlFile}
                    material={selectedMaterial}
                    infillPercent={infillPercent}
                    quantity={selectedQuantity}
                    onAnalysisComplete={(metrics) => setStlMetrics(metrics)}
                  />

                  {/* Selector de Infill */}
                  <div className="pt-2">
                    <label className="text-xs font-code block font-medium">Densidad de Relleno (Infill)</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[15, 30, 100].map((val) => (
                        <Button
                          key={val}
                          type="button"
                          variant={infillPercent === val ? "default" : "outline"}
                          size="sm"
                          onClick={() => setInfillPercent(val)}
                          className={infillPercent === val ? "gradient-primary text-white font-code text-xs" : "font-code text-xs"}
                        >
                          {val === 15 ? "15% (Ligero)" : val === 30 ? "30% (Estándar)" : "100% (Sólido)"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Estándar */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
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
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+51 987 654 321" {...field} />
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
                                <SelectValue placeholder="Selecciona material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MATERIALS.map((mat) => (
                                <SelectItem key={mat} value={mat}>
                                  {mat}
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
                        <FormLabel>Detalles del Proyecto *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el uso del objeto, acabados requeridos o cualquier duda técnica..."
                            className="min-h-[90px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full gradient-primary font-code text-sm uppercase tracking-wide shadow-glow hover:shadow-glow-lg transition-all duration-300"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Enviar Cotización a WhatsApp
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
