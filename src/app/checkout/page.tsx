'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck, Package, CheckCircle2, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Contact Info
    fullName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Perú',
    
    // Payment Method
    paymentMethod: 'transferencia',
    
    // Additional Notes
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > siteConfig.shipping.freeShippingThreshold ? 0 : 5.99;
  const tax = subtotal * siteConfig.tax.rate;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.state.trim()) newErrors.state = 'El estado es requerido';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrito vacío',
        description: 'Agrega productos antes de realizar el pedido',
      });
      return;
    }

    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Formulario incompleto',
        description: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. ENVIAR SOLICITUD DE VENTA A VENTIFY
      let requestId = '';
      let requestNumber = '';
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_VENTIFY_API_URL;
        const accountId = process.env.NEXT_PUBLIC_ACCOUNT_ID;
        const apiKey = process.env.NEXT_PUBLIC_VENTIFY_API_KEY;

        if (!apiUrl || !accountId || !apiKey) {
          throw new Error('Ventify API not configured');
        }

        const saleRequestData = {
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: items.map(item => ({
            productId: item.id,
            productName: item.name,
            sku: item.sku || '',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          subtotal,
          shipping,
          tax,
          total,
          preferredPaymentMethod: formData.paymentMethod,
          notes: formData.notes,
        };

        const response = await fetch(`${apiUrl}/api/public/stores/${accountId}/sale-requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(saleRequestData),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          requestId = result.data.requestId;
          requestNumber = result.data.requestNumber;
          console.log('✅ Solicitud registrada en Ventify:', requestNumber);
        }
      } catch (error) {
        console.error('❌ Error registrando en Ventify:', error);
        // Continuamos con WhatsApp aunque falle Ventify
      }

      // 2. GENERAR MENSAJE DE WHATSAPP
      const phoneNumber = siteConfig.contact.whatsapp;
      
      let message = `*🛒 NUEVO PEDIDO - Arcay3Dlabs*\n\n`;
      
      // Agregar número de solicitud si existe
      if (requestNumber) {
        message += `*� Solicitud: ${requestNumber}*\n\n`;
      }
      
      message += `*�👤 Cliente:*\n`;
      message += `Nombre: ${formData.fullName}\n`;
      message += `Email: ${formData.email}\n`;
      message += `Teléfono: ${formData.phone}\n\n`;
      
      message += `*📦 Productos:*\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Cantidad: ${item.quantity}\n`;
        message += `   Precio: $${item.price.toFixed(2)} c/u\n`;
        message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
      });
      
      message += `*💰 Resumen de Costos:*\n`;
      message += `Subtotal: $${subtotal.toFixed(2)}\n`;
      message += `Envío: ${shipping === 0 ? 'GRATIS 🎉' : `$${shipping.toFixed(2)}`}\n`;
      message += `IVA (16%): $${tax.toFixed(2)}\n`;
      message += `*Total: $${total.toFixed(2)}*\n\n`;
      
      message += `*📍 Dirección de Envío:*\n`;
      message += `${formData.address}\n`;
      message += `${formData.city}, ${formData.state}\n`;
      message += `CP: ${formData.zipCode}\n`;
      message += `${formData.country}\n\n`;
      
      message += `*💳 Método de Pago:*\n`;
      message += formData.paymentMethod === 'transferencia' 
        ? '🏦 Transferencia Bancaria\n\n' 
        : '💵 Pago Contra Entrega\n\n';
      
      if (formData.notes) {
        message += `*📝 Notas Adicionales:*\n${formData.notes}\n\n`;
      }
      
      message += `_Generado desde Arcay3Dlabs - ${new Date().toLocaleString('es-PE')}_`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // 3. GUARDAR EN LOCALSTORAGE (backup)
      const orderId = requestId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const orderData = {
        id: orderId,
        requestNumber: requestNumber || null,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      };

      try {
        const orders = JSON.parse(localStorage.getItem('arcay3dlabs_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('arcay3dlabs_orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving order to localStorage:', error);
      }

      // 4. LIMPIAR CARRITO
      clearCart();

      // 5. MOSTRAR MENSAJE DE ÉXITO
      toast({
        title: '¡Redirigiendo a WhatsApp!',
        description: 'Te conectaremos con un asesor de ventas',
      });

      // 6. ABRIR WHATSAPP
      window.open(whatsappUrl, '_blank');

      // 7. REDIRIGIR A PÁGINA DE CONFIRMACIÓN
      setTimeout(() => {
        router.push(`/pedido-confirmado?orderId=${orderId}&requestNumber=${requestNumber}`);
      }, 1000);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        variant: 'destructive',
        title: 'Error al procesar el pedido',
        description: 'Por favor intenta nuevamente o contáctanos directamente',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="text-center max-w-md mx-auto px-4 animate-fadeIn">
          <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Carrito Vacío</h1>
          <p className="text-muted-foreground mb-8">
            Agrega algunos productos antes de proceder al checkout
          </p>
          <Button asChild className="gradient-primary">
            <Link href="/tienda">Ir a la Tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/tienda">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">
            Finalizar <span className="gradient-text">Compra</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Completa tu información y te conectaremos con un asesor de ventas por WhatsApp
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="animate-slideInLeft border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    Información de Contacto
                  </CardTitle>
                  <CardDescription>
                    Para confirmar tu pedido y enviarte actualizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@ejemplo.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+52 123 456 7890"
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="animate-slideInLeft border-2 hover:border-primary/50 transition-colors" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    Dirección de Envío
                  </CardTitle>
                  <CardDescription>
                    Donde recibirás tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número, colonia"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lima"
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">Departamento *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Lima"
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Código Postal *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="15001"
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="animate-slideInLeft border-2 hover:border-primary/50 transition-colors" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    Método de Pago Preferido
                  </CardTitle>
                  <CardDescription>
                    Coordinarás el pago con nuestro asesor de ventas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Label htmlFor="transferencia" className="flex-1 cursor-pointer flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Transferencia / Depósito Bancario</p>
                          <p className="text-sm text-muted-foreground">El asesor te compartirá los datos bancarios</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="efectivo" id="efectivo" />
                      <Label htmlFor="efectivo" className="flex-1 cursor-pointer flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Pago contra entrega</p>
                          <p className="text-sm text-muted-foreground">Paga en efectivo al recibir tu pedido</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="otro" id="otro" />
                      <Label htmlFor="otro" className="flex-1 cursor-pointer flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Otro método</p>
                          <p className="text-sm text-muted-foreground">Coordinamos opciones con el asesor</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card className="animate-slideInLeft border-2 hover:border-primary/50 transition-colors" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                  <CardDescription>Opcional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="¿Alguna instrucción especial para tu pedido?"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="animate-slideInRight border-2">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={item.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>¡Envío gratis en compras mayores a ${siteConfig.shipping.freeShippingThreshold}!</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{siteConfig.tax.name} ({siteConfig.tax.rate * 100}%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="gradient-text">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Continuar por WhatsApp
                      </>
                    )}
                  </Button>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Envío en {siteConfig.shipping.estimatedDays}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Atención por WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Rastreo de pedido incluido</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
