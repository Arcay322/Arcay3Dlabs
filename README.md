# Arcay3Dlabs - Plataforma de Impresión 3D

Plataforma web completa para negocio de impresión 3D con catálogo de productos, carrito de compras y sistema de cotizaciones.

## 🚀 Características

- ✅ **Landing Page Moderna**: Hero section, servicios, materiales, galería y formularios de contacto
- ✅ **Tienda de Productos**: Catálogo completo con filtros, búsqueda y ordenamiento
- ✅ **Carrito de Compras**: Sistema de carrito con persistencia en localStorage
- ✅ **Checkout por WhatsApp**: Los pedidos se envían directamente a WhatsApp Business con resumen completo
- ✅ **Páginas de Producto**: Vista detallada con especificaciones, imágenes y selector de cantidad
- ✅ **Sistema de Cotizaciones**: Formulario para proyectos personalizados con upload de archivos STL/OBJ
- ✅ **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- ✅ **Animaciones y Efectos**: Gradientes, glassmorphism, hover effects y micro-interacciones
- ✅ **Mock Data**: Sistema funcional sin necesidad de Firebase configurado

## 🛠️ Tecnologías

- **Framework**: Next.js 15.3.3 (App Router)
- **UI**: Tailwind CSS + Radix UI (shadcn/ui)
- **Lenguaje**: TypeScript
- **Iconos**: Lucide React
- **Validación**: React Hook Form + Zod
- **Animaciones**: Canvas Confetti
- **Backend (preparado)**: Firebase (Firestore, Storage, Authentication)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Arcay322/Arcay3Dlabs.git
cd Arcay3Dlabs
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura tu número de WhatsApp Business:
   - Edita `src/config/site.ts`
   - Actualiza `contact.whatsapp` con tu número (ver [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md))

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:9002](http://localhost:9002) en tu navegador

## ⚙️ Configuración

### Número de WhatsApp

Ver guía completa en [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)

```typescript
// src/config/site.ts
export const siteConfig = {
  contact: {
    whatsapp: '51987654321', // Tu número de Perú en formato internacional
    email: 'contacto@arcay3dlabs.com',
    phone: '+51 987 654 321',
  },
  // ... más configuraciones
};
```

### Firebase (Opcional)

Para usar Firebase en producción:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Copia las credenciales a `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Descomenta las implementaciones de Firebase en:
   - `src/hooks/use-products.ts`
   - `src/lib/firebase/orders.ts`
   - `src/components/sections/quote-form.tsx`

## 📁 Estructura del Proyecto

```
src/
├── app/                        # Rutas de Next.js
│   ├── checkout/              # Página de checkout
│   ├── pedido-confirmado/     # Confirmación de pedido
│   ├── productos/[id]/        # Página individual de producto
│   ├── tienda/                # Catálogo de productos
│   ├── layout.tsx             # Layout principal con header/footer
│   └── page.tsx               # Landing page
├── components/
│   ├── layout/                # Header, Footer
│   ├── sections/              # Secciones de landing page
│   ├── ui/                    # Componentes de shadcn/ui
│   ├── cart-sheet.tsx         # Panel lateral del carrito
│   └── product-card.tsx       # Tarjeta de producto
├── contexts/
│   └── cart-context.tsx       # Estado global del carrito
├── hooks/
│   ├── use-cart.ts            # Hook del carrito
│   ├── use-products.ts        # Hook de productos (con mock data)
│   └── use-toast.ts           # Hook de notificaciones
├── lib/
│   ├── firebase/              # Configuración y funciones de Firebase
│   └── utils.ts               # Utilidades
└── config/
    └── site.ts                # Configuración del sitio
```

## 🎨 Personalización

### Colores y Tema

Los colores principales están en `src/app/globals.css`:

```css
:root {
  --primary: 217 91% 60%;      /* Azul principal */
  --secondary: 240 4.8% 95.9%; /* Gris claro */
  /* ... más variables */
}
```

### Productos

Los productos mock están en `src/hooks/use-products.ts`. Para agregar más productos:

```typescript
const mockProducts: Product[] = [
  {
    id: 'nuevo-producto',
    name: 'Mi Producto',
    description: 'Descripción...',
    price: 29.99,
    category: 'Decoración',
    material: 'PLA',
    stock: 10,
    featured: false,
    images: ['/products/mi-producto.jpg'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... más productos
];
```

## 📱 Flujo de Compra

1. Cliente navega la tienda y agrega productos al carrito
2. Click en "Proceder al Pago" desde el carrito
3. Completa formulario de checkout (contacto, dirección, método de pago)
4. Click en "Continuar por WhatsApp"
5. Se abre WhatsApp con mensaje pre-llenado con toda la información
6. Asesor de ventas atiende y confirma el pedido
7. Cliente recibe página de confirmación con número de referencia

## 🚧 Desarrollo Futuro

- [ ] Panel de administración
- [ ] Integración con WhatsApp Business API
- [ ] Pasarelas de pago (Stripe/MercadoPago)
- [ ] Sistema de reseñas y calificaciones
- [ ] Blog para SEO
- [ ] Múltiples idiomas
- [ ] PWA (Progressive Web App)

## 📄 Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a Arcay3Dlabs.

## 📧 Contacto

- Email: contacto@arcay3dlabs.com
- WhatsApp: [Configurar número](WHATSAPP_SETUP.md)

---

Desarrollado con ❤️ por Arcay3Dlabs
