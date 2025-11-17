'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Mail, Phone, MapPin, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Redirect countdown
    if (countdown === 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Pedido no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            No se pudo encontrar la información del pedido
          </p>
          <Button asChild className="gradient-primary">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-scaleIn">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            ¡Solicitud <span className="gradient-text">Enviada</span>!
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu solicitud ha sido enviada a nuestro equipo de ventas por WhatsApp
          </p>
        </div>

        {/* Order Info Card */}
        <Card className="mb-6 border-2 animate-slideInLeft">
          <CardContent className="p-6 space-y-6">
            {/* Order Number */}
            <div className="text-center pb-6 border-b">
              <p className="text-sm text-muted-foreground mb-2">Número de Referencia</p>
              <p className="text-2xl font-bold gradient-text font-mono">
                #{orderId.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Menciona este número en tu conversación de WhatsApp
              </p>
            </div>

            {/* Next Steps */}
            <div>
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Próximos Pasos
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Conversación por WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      Se ha abierto una ventana de WhatsApp con el resumen de tu pedido. Si no se abrió, revisa el bloqueador de ventanas emergentes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Atención Personalizada</p>
                    <p className="text-sm text-muted-foreground">
                      Un asesor de ventas responderá tu mensaje y te guiará en el proceso de compra
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Confirmación de Pago</p>
                    <p className="text-sm text-muted-foreground">
                      El asesor te indicará cómo realizar el pago y confirmará tu pedido
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Preparación y Envío</p>
                    <p className="text-sm text-muted-foreground">
                      Una vez confirmado el pago, prepararemos tu pedido en 2-3 días hábiles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-slideInRight">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/tienda">
              <Package className="h-5 w-5" />
              Seguir Comprando
            </Link>
          </Button>
          <Button asChild className="gradient-primary shadow-glow gap-2" size="lg">
            <Link href="/#contacto">
              <Mail className="h-5 w-5" />
              Contactar Soporte
            </Link>
          </Button>
        </div>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20 animate-fadeIn">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Información Importante
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Guarda tu número de referencia para la conversación de WhatsApp</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Si no se abrió WhatsApp automáticamente, puedes contactarnos directamente</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Nuestro horario de atención es de Lun-Vie 9:00-18:00, Sáb 9:00-14:00</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>El tiempo de entrega es de 5-7 días hábiles después del envío</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Auto Redirect Notice */}
        <div className="text-center mt-8 text-sm text-muted-foreground animate-pulse">
          Redirigiendo al inicio en {countdown} segundos...
        </div>
      </div>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
