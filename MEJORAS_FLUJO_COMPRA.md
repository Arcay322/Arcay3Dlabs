# 📊 Análisis de Flujo de Compra: Arcay3Dlabs ↔ Ventify

## 🔍 Estado Actual del Flujo

### ✅ **Implementado y Funcionando:**

1. **Catálogo de Productos**
   - ✅ Productos se cargan desde Ventify API pública
   - ✅ React Query con caché de 5 minutos
   - ✅ Fallback a datos mock en caso de error
   - ✅ Rate limiting (60 req/min, 1000 req/hora)
   - ✅ Permisos granulares (`read:products`)

2. **Carrito de Compras**
   - ✅ Gestión local con Context API
   - ✅ Persiste en localStorage
   - ✅ Cálculo de subtotal, envío, impuestos

3. **Página de Checkout**
   - ✅ Formulario de información del cliente
   - ✅ Validación de campos
   - ✅ Cálculo de costos
   - ✅ Selección de método de pago

---

## ❌ **NO Implementado (Crítico):**

### 1. **Integración de Pedidos con Ventify**

**Problema actual:**
- Los pedidos solo se envían por WhatsApp
- Se guardan en localStorage del navegador
- **No se registran en Ventify** (no hay inventario actualizado, no hay registro de ventas)

**Impacto:**
- ❌ Stock NO se descuenta automáticamente
- ❌ Ventas NO aparecen en reportes de Ventify
- ❌ No hay trazabilidad de pedidos
- ❌ Gestión manual e ineficiente

---

## 🎯 Mejoras Requeridas

### **Fase 1: Crear Endpoint de Ventas en API Pública** (CRÍTICO)

**Archivo a crear:** `Ventify/src/app/api/public/stores/[accountId]/sales/route.ts`

**Funcionalidad:**
```typescript
POST /api/public/stores/{accountId}/sales
Headers: X-API-Key: ventify_...
Body: {
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  items: [
    {
      productId: string,
      quantity: number,
      price: number
    }
  ],
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  paymentMethod: 'transferencia' | 'contraeentrega',
  notes?: string,
  source: 'landing_page'
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "saleId": "sale_123456",
    "saleNumber": "#00123",
    "status": "pending",
    "total": 150.00
  }
}
```

**Permisos requeridos:**
- API key con permiso `write:sales`

---

### **Fase 2: Actualizar Checkout de Arcay3Dlabs**

**Archivo a modificar:** `Arcay3Dlabs/src/app/checkout/page.tsx`

**Cambios necesarios:**

1. **Agregar función para enviar pedido a Ventify:**
```typescript
async function createSaleInVentify(orderData) {
  const response = await fetch(
    `${VENTIFY_API_URL}/api/public/stores/${ACCOUNT_ID}/sales`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(orderData),
    }
  );
  
  if (!response.ok) {
    throw new Error('Error al registrar venta en Ventify');
  }
  
  return await response.json();
}
```

2. **Modificar handleSubmit:**
```typescript
// ANTES: Solo WhatsApp + localStorage
// AHORA:
try {
  // 1. Crear venta en Ventify (NUEVO)
  const ventifyResponse = await createSaleInVentify(orderData);
  
  // 2. Enviar por WhatsApp (mantener)
  window.open(whatsappUrl, '_blank');
  
  // 3. Redirigir a confirmación
  router.push(`/pedido-confirmado?orderId=${ventifyResponse.data.saleId}`);
} catch (error) {
  // Fallback: si falla Ventify, continuar con WhatsApp
  console.error('Error en Ventify, continuando con WhatsApp:', error);
}
```

---

### **Fase 3: Sistema de Estados de Pedidos**

**Archivo a crear:** `Ventify/src/app/api/public/stores/[accountId]/sales/[saleId]/route.ts`

**Funcionalidad:**
```typescript
// Obtener estado de un pedido
GET /api/public/stores/{accountId}/sales/{saleId}

// Respuesta:
{
  "success": true,
  "data": {
    "id": "sale_123",
    "saleNumber": "#00123",
    "status": "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    "statusHistory": [
      { status: "pending", date: "2025-12-18T10:00:00Z" },
      { status: "confirmed", date: "2025-12-18T11:30:00Z" }
    ],
    "customer": {...},
    "items": [...],
    "total": 150.00
  }
}
```

**Permisos:** `read:sales`

---

### **Fase 4: Página de Seguimiento en Arcay3Dlabs**

**Archivo a crear:** `Arcay3Dlabs/src/app/pedido/[orderId]/page.tsx`

**Funcionalidad:**
- Consultar estado del pedido en Ventify
- Mostrar timeline de estados
- Información de envío
- Opción de contactar soporte

---

### **Fase 5: Webhooks para Notificaciones**

**Archivo a crear:** `Ventify/src/app/api/webhooks/sales/route.ts`

**Funcionalidad:**
- Notificar a Arcay3Dlabs cuando cambia el estado de un pedido
- Enviar emails automáticos al cliente
- Integración con sistemas de envío

---

### **Fase 6: Dashboard de Pedidos en Ventify**

**Archivo a modificar:** `Ventify/src/app/(dashboard)/sales/page.tsx`

**Mejoras:**
- Filtro por `source: 'landing_page'`
- Vista especial para pedidos de landing
- Asignación automática a sucursal principal
- Marcar como "Pedido Web" con badge

---

## 📝 Resumen de Archivos a Crear/Modificar

### **Ventify (Backend):**

| Archivo | Acción | Prioridad | Descripción |
|---------|--------|-----------|-------------|
| `src/app/api/public/stores/[accountId]/sales/route.ts` | Crear | 🔴 ALTA | POST para crear ventas desde landing |
| `src/app/api/public/stores/[accountId]/sales/[saleId]/route.ts` | Crear | 🟡 MEDIA | GET para consultar estado de venta |
| `src/lib/api-keys.ts` | Modificar | 🟡 MEDIA | Agregar permiso `write:sales` y `read:sales` |
| `src/app/(dashboard)/sales/page.tsx` | Modificar | 🟢 BAJA | Filtro y vista para pedidos web |
| `firestore.rules` | Modificar | 🔴 ALTA | Reglas para colección sales |

### **Arcay3Dlabs (Frontend):**

| Archivo | Acción | Prioridad | Descripción |
|---------|--------|-----------|-------------|
| `src/app/checkout/page.tsx` | Modificar | 🔴 ALTA | Integrar con endpoint de sales |
| `src/lib/ventify-api.ts` | Modificar | 🔴 ALTA | Agregar función `createSale()` |
| `src/app/pedido/[orderId]/page.tsx` | Crear | 🟡 MEDIA | Página de seguimiento de pedido |
| `src/components/order-status.tsx` | Crear | 🟡 MEDIA | Componente para mostrar estado |

---

## 🚀 Plan de Implementación Sugerido

### **Sprint 1 (1-2 días): Core de Ventas**
1. ✅ Crear endpoint POST `/api/public/stores/{accountId}/sales`
2. ✅ Agregar permisos `write:sales` y `read:sales`
3. ✅ Actualizar checkout de Arcay3Dlabs para enviar a Ventify
4. ✅ Testing end-to-end

### **Sprint 2 (1 día): Consulta de Estado**
1. ⏳ Crear endpoint GET `/api/public/stores/{accountId}/sales/{saleId}`
2. ⏳ Crear página de seguimiento en Arcay3Dlabs
3. ⏳ Testing de consultas

### **Sprint 3 (1-2 días): Mejoras UX**
1. ⏳ Dashboard mejorado en Ventify para pedidos web
2. ⏳ Emails de confirmación automáticos
3. ⏳ Notificaciones push

### **Sprint 4 (Opcional): Webhooks**
1. ⏳ Sistema de webhooks
2. ⏳ Integración con courier
3. ⏳ Sistema de tracking

---

## 🔒 Consideraciones de Seguridad

1. **API Keys:**
   - ✅ Usar key con permiso `write:sales` solo para checkout
   - ✅ Rate limiting específico para endpoint de ventas (10 req/min)
   - ✅ Validar stock disponible antes de crear venta

2. **Datos Sensibles:**
   - ❌ NO exponer precios de costo
   - ❌ NO exponer márgenes de ganancia
   - ✅ Validar email y teléfono en backend

3. **Inventario:**
   - ✅ Descuento de stock debe ser transaccional
   - ✅ Reservar stock temporalmente durante checkout
   - ✅ Liberar stock si no se confirma en X minutos

---

## 💡 Mejoras Opcionales Adicionales

1. **Carrito Persistente en Nube:**
   - Guardar carrito en Ventify (colección `carts`)
   - Recuperar carrito en múltiples dispositivos
   - Enviar recordatorios de carrito abandonado

2. **Cotizaciones vs Ventas:**
   - Diferenciar entre "solicitud de cotización" y "venta directa"
   - Flujo de aprobación para cotizaciones
   - Conversión de cotización a venta

3. **Pagos Online:**
   - Integración con Stripe/PayPal/MercadoPago
   - Confirmación automática al recibir pago
   - Generar comprobante electrónico

4. **Sistema de Reviews:**
   - Clientes pueden dejar reseñas de productos
   - Almacenar en Ventify, mostrar en landing
   - Moderación de reviews

5. **Programa de Puntos/Descuentos:**
   - Sistema de cupones de descuento
   - Programa de fidelidad
   - Descuentos por primera compra

---

## 📊 Métricas a Implementar

1. **Conversión:**
   - Productos vistos → Agregados al carrito
   - Carrito → Checkout iniciado
   - Checkout → Venta completada

2. **Abandono:**
   - % de carritos abandonados
   - Tiempo promedio en checkout
   - Motivos de abandono

3. **Revenue:**
   - Ticket promedio
   - Productos más vendidos desde landing
   - ROI de la landing page

---

## 🎯 Prioridad Recomendada

### **CRÍTICO (Implementar ahora):**
- ✅ Endpoint POST `/sales` para registrar ventas
- ✅ Actualizar checkout para enviar a Ventify
- ✅ Permisos `write:sales` en API keys

### **IMPORTANTE (Siguiente sprint):**
- ⏳ Endpoint GET `/sales/{id}` para consultar estado
- ⏳ Página de seguimiento de pedido
- ⏳ Dashboard mejorado en Ventify

### **NICE TO HAVE (Backlog):**
- ⏳ Webhooks
- ⏳ Pagos online
- ⏳ Sistema de reviews
- ⏳ Programa de puntos

---

## 📞 Próximos Pasos

1. **Revisar y aprobar este documento**
2. **Decidir qué fases implementar**
3. **Crear tareas en backlog**
4. **Comenzar con Sprint 1**

---

**Fecha:** 18 de Diciembre, 2025
**Estado:** Pendiente de aprobación
**Autor:** GitHub Copilot AI Assistant
