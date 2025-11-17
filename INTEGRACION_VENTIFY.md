# 🔗 Integración con Ventify API

Este proyecto consume datos en tiempo real desde el SaaS **Ventify** mediante su API pública.

## ⚙️ Configuración

### 1. Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```env
# URL de la API de Ventify
NEXT_PUBLIC_VENTIFY_API_URL=https://tu-dominio-ventify.com

# ID de tu cuenta en Ventify (lo obtienes del dashboard de Ventify)
NEXT_PUBLIC_ACCOUNT_ID=tu_account_id_aqui
```

### 2. Obtener tu Account ID

1. Ingresa a tu cuenta en **Ventify**
2. Ve a **Configuración** → **Integración API**
3. Copia tu **Account ID**
4. Pégalo en el `.env.local`

### 3. Desarrollo Local

Si estás probando con Ventify en desarrollo local:

```env
NEXT_PUBLIC_VENTIFY_API_URL=http://localhost:3000
NEXT_PUBLIC_ACCOUNT_ID=tu_account_id_de_prueba
```

---

## 🚀 Uso

### Productos

Los productos se obtienen automáticamente desde Ventify:

```typescript
import { ventifyAPI } from '@/lib/ventify-api'

// Obtener todos los productos activos
const products = await ventifyAPI.getProducts({ active: true })

// Filtrar por categoría
const figuras = await ventifyAPI.getProducts({ 
  category: 'Figuras',
  active: true 
})

// Limitar resultados
const featured = await ventifyAPI.getProducts({ 
  active: true,
  limit: 6 
})

// Obtener un producto específico
const product = await ventifyAPI.getProduct('product_id')
```

### Cotizaciones

Envía cotizaciones directo a Ventify:

```typescript
import { ventifyAPI } from '@/lib/ventify-api'

const quote = await ventifyAPI.createQuote({
  customerName: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+51 987 654 321',
  material: 'PLA',
  quantity: 5,
  description: 'Necesito 5 piezas personalizadas',
  fileName: 'pieza.stl',
  fileUrl: 'https://...'
})
```

---

## 📊 Sincronización de Datos

### Productos
- ✅ **Tiempo real**: Los cambios en Ventify se reflejan inmediatamente
- ✅ **Stock**: Se muestra el stock disponible total (todas las sucursales)
- ✅ **Precios**: Usa el precio sugerido configurado en Ventify
- ✅ **Imágenes**: Se cargan desde Firebase Storage de Ventify

### Cotizaciones
- ✅ Se guardan en la colección `quotes` de Firestore de Ventify
- ✅ Identificadas con `source: 'landing_page'`
- ✅ El equipo puede gestionarlas desde el dashboard de Ventify

---

## 🔒 Seguridad

- ✅ **Sin credenciales sensibles**: Solo se expone el Account ID
- ✅ **CORS habilitado**: Funciona desde cualquier dominio
- ✅ **Datos públicos**: No se exponen precios de costo ni márgenes
- ✅ **Read-only**: Las landing pages solo leen datos públicos

---

## 🐛 Troubleshooting

### "ACCOUNT_ID no configurado"

**Problema**: No se encuentra la variable de entorno

**Solución**:
```bash
# Verifica que .env.local tenga:
NEXT_PUBLIC_ACCOUNT_ID=tu_account_id_aqui

# Reinicia el servidor de desarrollo:
npm run dev
```

### "Error al obtener productos: 404"

**Problema**: Account ID incorrecto o no existe

**Solución**:
1. Verifica que el Account ID sea correcto
2. Asegúrate de que la cuenta esté activa en Ventify
3. Revisa que tengas productos creados en Ventify

### "CORS error"

**Problema**: La API de Ventify no permite tu dominio

**Solución**:
1. Verifica que Ventify tenga CORS habilitado (`Access-Control-Allow-Origin: *`)
2. Si estás en producción, contacta al admin de Ventify

---

## 📝 Modo Fallback (Mock Data)

Si la API de Ventify no está disponible, el sistema usa datos mock automáticamente:

```typescript
// El hook detecta errores y cambia a mock data
const { products, loading, error } = useProducts()

if (error) {
  console.log('Usando datos mock como fallback')
}
```

---

## 🔄 Migración desde Firebase Directo

Si anteriormente usabas Firebase directamente:

1. ✅ Elimina las variables `NEXT_PUBLIC_FIREBASE_*` de `.env.local`
2. ✅ Los hooks ya están adaptados para usar Ventify API
3. ✅ Los tipos de datos son compatibles
4. ✅ No necesitas cambiar componentes

---

## 📚 Documentación Completa

Para más detalles sobre la API, consulta:
- **Ventify**: `API_PUBLICA.md` en el repositorio de Ventify
- **Endpoints**: Todos los endpoints disponibles y ejemplos
- **Rate limits**: Límites de uso en producción

---

## 🆘 Soporte

¿Problemas con la integración?

1. Revisa este README
2. Consulta `API_PUBLICA.md` en Ventify
3. Contacta al equipo de Ventify

---

## ✅ Checklist de Configuración

- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Account ID obtenido desde Ventify
- [ ] Productos creados en Ventify con imágenes
- [ ] API URL apuntando al entorno correcto (dev/prod)
- [ ] Servidor de desarrollo reiniciado después de configurar
- [ ] Productos mostrándose correctamente en la landing
- [ ] Cotizaciones llegando a Ventify

---

¡Listo! Tu landing page ahora está 100% integrada con Ventify 🎉
