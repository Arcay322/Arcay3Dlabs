# Configuración de WhatsApp Business

## Configurar el Número de WhatsApp

Para configurar el número de WhatsApp al que se redirigirán los pedidos:

1. Abre el archivo `src/config/site.ts`
2. Busca la propiedad `contact.whatsapp`
3. Reemplaza el número con tu número de WhatsApp Business

### Formato del Número

El número debe estar en formato internacional **sin espacios, guiones ni caracteres especiales**:

**Perú (ejemplo):**
```typescript
whatsapp: '51917455538'
```

- **51**: Código de país (Perú)
- **9**: Primer dígito de móviles en Perú
- **17455538**: Resto del número (8 dígitos)

### Ejemplos por País

#### Perú
```typescript
whatsapp: '51987654321'  // +51 987 654 321
```

#### México
```typescript
whatsapp: '5213121234567'  // +52 312 123 4567
```

#### Estados Unidos
```typescript
whatsapp: '15551234567'     // +1 555 123 4567
```

#### España
```typescript
whatsapp: '34612345678'     // +34 612 345 678
```

#### Colombia
```typescript
whatsapp: '573001234567'    // +57 300 123 4567
```

#### Chile
```typescript
whatsapp: '56987654321'     // +56 9 8765 4321
```

#### Argentina
```typescript
whatsapp: '5491123456789'   // +54 9 11 2345 6789
```

## Cómo Funciona el Flujo de Compra

1. **Usuario completa el checkout**: El cliente llena el formulario con su información de contacto, dirección de envío y método de pago preferido.

2. **Click en "Continuar por WhatsApp"**: Al hacer click, el sistema:
   - Genera un resumen completo del pedido
   - Crea un número de referencia único
   - Guarda el pedido en localStorage
   - Vacía el carrito
   - Abre WhatsApp con el mensaje pre-llenado

3. **Mensaje de WhatsApp**: Se abre automáticamente una ventana de WhatsApp con un mensaje que incluye:
   - Información del cliente
   - Lista de productos con cantidades y precios
   - Resumen de costos (subtotal, envío, IVA, total)
   - Dirección de envío
   - Método de pago preferido
   - Notas adicionales (si las hay)
   - Número de referencia
   - Fecha y hora

4. **Página de confirmación**: El usuario es redirigido a una página de confirmación con:
   - Animación de confetti 🎉
   - Número de referencia
   - Instrucciones sobre los próximos pasos
   - Redirección automática a inicio después de 10 segundos

## Ejemplo del Mensaje de WhatsApp

```
🛒 NUEVO PEDIDO - Arcay3Dlabs

👤 Cliente:
Nombre: Juan Pérez
Email: juan@ejemplo.com
Teléfono: +51 987 654 321

📦 Productos:
1. Jarrón Geométrico
   Cantidad: 2
   Precio: $29.99 c/u
   Subtotal: $59.98

2. Dragón de Fuego
   Cantidad: 1
   Precio: $45.00 c/u
   Subtotal: $45.00

💰 Resumen de Costos:
Subtotal: $104.98
Envío: GRATIS 🎉
IGV (18%): $18.90
*Total: $123.88*

📍 Dirección de Envío:
Av. Ejemplo 123, Miraflores
Lima, Lima
CP: 15074
Perú

💳 Método de Pago:
🏦 Transferencia Bancaria

_Generado desde Arcay3Dlabs - 17/11/2025 10:30:45_
```

## Atención al Cliente

Una vez que el cliente envía el mensaje:

1. **Responde rápidamente**: La primera impresión es crucial
2. **Confirma la disponibilidad**: Verifica que los productos estén en stock
3. **Comparte los datos de pago**: Si eligió transferencia, envía la CLABE y datos bancarios
4. **Confirma el pago**: Una vez recibido, confirma y da un tiempo estimado de preparación
5. **Proporciona seguimiento**: Comparte el número de rastreo cuando envíes el pedido

## Personalización Adicional

Puedes personalizar otros aspectos en `src/config/site.ts`:

- **Email de contacto**
- **Teléfono**
- **Redes sociales**
- **Horarios de atención**
- **Configuración de envío** (umbral de envío gratis, días estimados)
- **Impuesto** (IVA o el que aplique en tu país)

## Notas Importantes

- ✅ El número debe ser de WhatsApp Business (o al menos WhatsApp normal)
- ✅ Asegúrate de que el número esté activo y monitorizado
- ✅ Considera configurar respuestas automáticas para fuera de horario
- ✅ Los pedidos también se guardan en localStorage del navegador del cliente como respaldo
- ✅ El cliente puede mencionar el número de referencia en la conversación

## Futuras Mejoras

Cuando estés listo para escalar, puedes considerar:

- Integración con WhatsApp Business API
- Pasarelas de pago (Stripe, MercadoPago, Paypal)
- Base de datos real (Firebase, PostgreSQL)
- Panel de administración para gestionar pedidos
- Notificaciones automáticas de estado del pedido
