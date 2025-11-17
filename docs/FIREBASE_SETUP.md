# Configuración de Firebase para Arcay3Dlabs

Este documento explica cómo configurar Firebase para el proyecto.

## 1. Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: "arcay3dlabs")
4. Sigue los pasos de configuración

## 2. Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona modo de **producción** o **prueba** (recomendado para desarrollo)
4. Elige una ubicación cercana a tus usuarios

### Reglas de Seguridad Recomendadas (para desarrollo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read public, write admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Quotes - anyone can create, admin can read all
    match /quotes/{quoteId} {
      allow create: if true;
      allow read, update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders - anyone can create, admin can read all
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Gallery - read public, write admin only
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 3. Configurar Storage

1. En el menú lateral, ve a **Storage**
2. Haz clic en "Comenzar"
3. Acepta las reglas de seguridad predeterminadas

### Reglas de Storage Recomendadas

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Quotes - anyone can upload
    match /quotes/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 50 * 1024 * 1024 // 50MB limit
                   && request.resource.contentType.matches('model/.*|application/.*');
    }
    
    // Gallery - admin only
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 4. Configurar Authentication (Opcional)

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Comenzar"
3. Habilita el método de autenticación **Email/Password**
4. (Opcional) Agrega otros métodos como Google, Facebook, etc.

### Crear Usuario Admin

Para crear un usuario administrador:

```javascript
// En Firebase Console > Authentication > Users
// 1. Crea un usuario con email/password
// 2. Copia su UID
// 3. Ve a Firestore > Crear colección "admins"
// 4. Agrega un documento con el UID del usuario:
{
  uid: "user_uid_here",
  email: "admin@arcay3dlabs.com",
  role: "admin",
  createdAt: timestamp
}
```

## 5. Obtener Credenciales

1. En Firebase Console, ve a **Configuración del proyecto** (ícono de engranaje)
2. En la pestaña "General", baja hasta "Tus aplicaciones"
3. Haz clic en el ícono web `</>`
4. Registra tu app con un nombre (ej: "Arcay3Dlabs Web")
5. Copia las credenciales que aparecen

## 6. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Rellena las variables con tus credenciales de Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

## 7. Estructura de Colecciones

El proyecto usa las siguientes colecciones en Firestore:

### `products`
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  material: string,
  dimensions: { width, height, depth },
  weight: number,
  images: string[],
  stock: number,
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `quotes`
```javascript
{
  id: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  description: string,
  material: 'PLA' | 'ABS' | 'PETG' | 'Resina' | 'TPU' | 'Otro',
  quantity: number,
  fileUrl: string,
  fileName: string,
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'rejected' | 'completed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `orders`
```javascript
{
  id: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  shippingAddress: { street, city, state, zipCode, country },
  items: [{ productId, productName, quantity, price, total }],
  subtotal: number,
  shipping: number,
  total: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `gallery`
```javascript
{
  id: string,
  title: string,
  description: string,
  imageUrl: string,
  category: string,
  tags: string[],
  featured: boolean,
  createdAt: timestamp
}
```

## 8. Agregar Productos de Ejemplo (Opcional)

Puedes agregar productos manualmente desde la consola de Firestore o crear un script de seed.

## Siguientes Pasos

Una vez configurado Firebase:
1. Reinicia el servidor de desarrollo
2. Las funciones de Firebase estarán disponibles en `src/lib/firebase`
3. Importa y usa: `import { getProducts, createQuoteRequest } from '@/lib/firebase'`
