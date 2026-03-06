/**
 * Cliente API para conectar con Ventify a través de proxy seguro
 * ✅ Las credenciales se mantienen en el servidor, no se exponen al cliente
 */

import { Product } from '@/lib/firebase/types';

// ✅ Ya no necesitamos estas variables públicas
// Las credenciales están seguras en el servidor
const PROXY_BASE_URL = '/api/ventify' // Proxy local

export interface VentifyProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  inStock: boolean
  sku: string
  imageUrl: string
  description: string
  supplier?: string
  // Campos de integración avanzada
  // API puede devolver 'key' o 'name' según versión desplegada
  attributes?: Array<{ name?: string; key?: string; value: string }>;
  galleryImages?: string[];
  isFeatured?: boolean;

  // E-commerce Fields (disponibles cuando Ventify tenga deploy con estos campos)
  slug?: string;
  tags?: string[];
  dimensions?: { length: number; width: number; height: number };
  weight?: number;
  seo?: { metaTitle?: string; metaDescription?: string };
  variants?: Array<{
    id: string;
    name: string;
    colorHex?: string;
    images: string[];
    stock: number;
    priceAdjustment: number;
    sku?: string;
  }>;
}

export interface VentifyQuote {
  customerName: string
  email: string
  phone: string
  material?: string
  quantity?: number
  finish?: string
  description?: string
  fileName?: string
  fileUrl?: string
}

class VentifyAPI {
  private proxyUrl: string

  constructor() {
    // ✅ Usar proxy local en lugar de llamar directamente a Ventify
    this.proxyUrl = PROXY_BASE_URL
  }

  /**
   * Verificar si la API está configurada
   * En el cliente siempre devolvemos true, la validación real ocurre en el proxy
   */
  isConfigured(): boolean {
    return true;
  }

  /**
   * Obtener headers para las requests al proxy
   * Ya no necesitamos API Key aquí, el proxy la maneja
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Obtener todos los productos a través del proxy
   */
  async getProducts(options?: {
    category?: string
    active?: boolean
    limit?: number
  }): Promise<VentifyProduct[]> {
    const params = new URLSearchParams()
    if (options?.category) params.set('category', options.category)
    if (options?.active !== undefined) params.set('active', String(options.active))
    if (options?.limit) params.set('limit', String(options.limit))

    // ✅ Llamar al proxy local, no directamente a Ventify
    const url = `${this.proxyUrl}/products${params.toString() ? `?${params.toString()}` : ''
      }`

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(error.error || `Error al obtener productos: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener productos')
    }

    return result.data
  }

  /**
   * Obtener un producto por ID a través del proxy
   */
  async getProduct(productId: string): Promise<VentifyProduct> {
    if (!productId) {
      throw new Error('Product ID requerido')
    }

    // ✅ Llamar al proxy local
    const url = `${this.proxyUrl}/products/${productId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Producto no encontrado')
      }
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(error.error || `Error al obtener producto: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener producto')
    }

    return result.data
  }

  /**
   * Crear una solicitud de venta a través del proxy
   */
  async createSaleRequest(saleData: any): Promise<{ requestId: string; requestNumber: string }> {
    // ✅ Llamar al proxy local que maneja las credenciales de forma segura
    const url = `${this.proxyUrl}/sale-request`

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(saleData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(error.error || `Error al crear solicitud: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Error al crear solicitud')
    }

    return {
      requestId: result.data.requestId,
      requestNumber: result.data.requestNumber,
    }
  }

  /**
   * Crear una cotización (deprecated - usar createSaleRequest en su lugar)
   * Este método se mantiene por compatibilidad pero debería migrar a sale-request
   */
  async createQuote(quoteData: VentifyQuote): Promise<{ id: string; status: string }> {
    console.warn('⚠️ createQuote() está deprecated. Use createSaleRequest() en su lugar.')

    // Si necesitas mantener cotizaciones, habría que crear un proxy similar
    throw new Error('Método createQuote() no implementado. Use createSaleRequest() en su lugar.')
  }
}

// ============================================================================
// FUNCIONES ADAPTADORAS
// ============================================================================

/**
 * Helper: normalizar atributos de la API (puede venir con 'key' o 'name')
 */
function normalizeAttributes(attributes?: Array<{ name?: string; key?: string; value: string }>): Array<{ name: string; value: string }> {
  if (!attributes || attributes.length === 0) return [];
  return attributes.map(a => ({
    name: (a.name || a.key || '').trim(),
    value: (a.value || '').trim(),
  })).filter(a => a.name && a.value);
}

/**
 * Helper: construir array de imágenes respetando la imagen principal de Ventify
 * imageUrl = imagen elegida como principal en Ventify
 * galleryImages = todas las imágenes del producto
 * Resultado: imagen principal primero, luego el resto
 */
function buildImageArray(imageUrl?: string, galleryImages?: string[]): string[] {
  const mainImage = imageUrl?.trim();
  const gallery = (galleryImages || []).filter(url => url?.trim());

  if (!gallery.length && !mainImage) {
    return ['/images/a3dl_logo.webp'];
  }

  if (!gallery.length) {
    return mainImage ? [mainImage] : ['/images/a3dl_logo.webp'];
  }

  if (!mainImage) {
    return gallery;
  }

  // Poner la imagen principal primero, luego el resto sin duplicar
  const rest = gallery.filter(url => url !== mainImage);
  return [mainImage, ...rest];
}

/**
 * Helper: inferir material desde categoría
 */
function getMaterialFromCategory(category: string): string {
  const materialMap: Record<string, string> = {
    'Figuras': 'Resina',
    'Decoración': 'PLA',
    'Arte': 'Resina',
    'Mecánico': 'ABS',
    'Organizadores': 'PETG',
    'Tecnología': 'ABS',
    'Tecnologia': 'ABS', // Sin acento también
    'Juguetes': 'PLA',
  };
  return materialMap[category] || 'PLA';
}

/**
 * Helper: extraer dimensiones de attributes si existen
 */
function extractDimensionsFromAttributes(attributes?: Array<{ name: string; value: string }>) {
  if (!attributes || attributes.length === 0) return undefined;

  const width = attributes.find(a => a.name?.toLowerCase().includes('ancho'))?.value;
  const height = attributes.find(a => a.name?.toLowerCase().includes('alto'))?.value;
  const depth = attributes.find(a => a.name?.toLowerCase().includes('profundidad') || a.name?.toLowerCase().includes('largo'))?.value;

  // Solo retornar si al menos un valor fue encontrado
  if (!width && !height && !depth) return undefined;

  return {
    width: width ? parseInt(width) : 0,
    height: height ? parseInt(height) : 0,
    depth: depth ? parseInt(depth) : 0,
  };
}

/**
 * Helper: extraer peso de attributes
 */
function extractWeightFromAttributes(attributes?: Array<{ name: string; value: string }>): number | undefined {
  if (!attributes || attributes.length === 0) return undefined;

  const weight = attributes.find(a => a.name?.toLowerCase().includes('peso'))?.value;
  return weight ? parseInt(weight) : undefined;
}

/**
 * Helper: extraer material desde attributes o inferir desde categoría
 */
function getMaterialFromProduct(vp: VentifyProduct): string {
  // 1. Buscar material en atributos (soportar key o name)
  if (vp.attributes && vp.attributes.length > 0) {
    const materialAttr = vp.attributes.find(a =>
      (a.name || a.key || '').toLowerCase().includes('material')
    );
    if (materialAttr?.value) return materialAttr.value.trim();
  }

  // 2. Fallback: inferir desde categoría
  return getMaterialFromCategory(vp.category);
}

/**
 * Adaptador: Convierte datos de Ventify API al formato interno de Arcay3DLabs
 * Transforma VentifyProduct → Product (formato interno)
 */
export function adaptVentifyProduct(vp: VentifyProduct): Product {
  // Normalizar atributos una sola vez (soporta key o name)
  const attrs = normalizeAttributes(vp.attributes);

  // Descripción: ignorar placeholders vacíos como "product image"
  const rawDesc = (vp.description || '').trim();
  const isPlaceholder = !rawDesc || rawDesc.toLowerCase() === 'product image';

  return {
    id: vp.id,
    name: vp.name,
    description: isPlaceholder ? '' : rawDesc,
    price: vp.price,
    category: vp.category,

    // Extraer material desde atributos o inferir desde categoría
    material: getMaterialFromProduct(vp),

    // Manejar imágenes: respetar imagen principal (imageUrl) de Ventify
    images: buildImageArray(vp.imageUrl, vp.galleryImages),

    stock: vp.stock,
    // Solo usar isFeatured del backend, no inferir de stock
    featured: vp.isFeatured || false,

    // Timestamps - usar fecha actual como fallback
    createdAt: new Date(),
    updatedAt: new Date(),

    // Campos de integración con Ventify
    sku: vp.sku,
    attributes: attrs,

    // Extraer de attributes o usar defaults, priorizando dimensiones nativas
    dimensions: vp.dimensions
      ? { width: vp.dimensions.width, height: vp.dimensions.height, depth: vp.dimensions.length }
      : extractDimensionsFromAttributes(attrs),
    weight: vp.weight || extractWeightFromAttributes(attrs),

    // Custom E-commerce mapping
    slug: vp.slug,
    tags: vp.tags || [],
    seo: vp.seo || undefined,

    // Variantes de producto
    variants: vp.variants && vp.variants.length > 0
      ? vp.variants.map(v => ({
          id: v.id,
          name: v.name,
          colorHex: v.colorHex,
          images: v.images || [],
          stock: v.stock || 0,
          priceAdjustment: v.priceAdjustment || 0,
          sku: v.sku,
        }))
      : undefined,
  };
}


// Exportar instancia singleton
export const ventifyAPI = new VentifyAPI()

// Exportar clase para testing
export default VentifyAPI
