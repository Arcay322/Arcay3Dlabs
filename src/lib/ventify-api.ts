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
  attributes?: Array<{ name: string; value: string }>;
  galleryImages?: string[];
  isFeatured?: boolean;

  // E-commerce Fields
  slug?: string;
  tags?: string[];
  dimensions?: { length: number; width: number; height: number };
  weight?: number;
  seo?: { metaTitle?: string; metaDescription?: string };
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
  if (!attributes) return { width: 10, height: 10, depth: 10 };

  const width = attributes.find(a => a.name?.toLowerCase().includes('ancho'))?.value;
  const height = attributes.find(a => a.name?.toLowerCase().includes('alto'))?.value;
  const depth = attributes.find(a => a.name?.toLowerCase().includes('profundidad') || a.name?.toLowerCase().includes('largo'))?.value;

  return {
    width: width ? parseInt(width) : 10,
    height: height ? parseInt(height) : 10,
    depth: depth ? parseInt(depth) : 10,
  };
}

/**
 * Helper: extraer peso de attributes
 */
function extractWeightFromAttributes(attributes?: Array<{ name: string; value: string }>): number {
  if (!attributes) return 100;

  const weight = attributes.find(a => a.name?.toLowerCase().includes('peso'))?.value;
  return weight ? parseInt(weight) : 100;
}

/**
 * Helper: extraer material desde attributes o inferir desde categoría
 */
function getMaterialFromProduct(vp: VentifyProduct): string {
  // 1. Buscar material en atributos
  if (vp.attributes && vp.attributes.length > 0) {
    const materialAttr = vp.attributes.find(a =>
      a.name?.toLowerCase().includes('material')
    );
    if (materialAttr?.value) return materialAttr.value;
  }

  // 2. Fallback: inferir desde categoría
  return getMaterialFromCategory(vp.category);
}

/**
 * Adaptador: Convierte datos de Ventify API al formato interno de Arcay3DLabs
 * Transforma VentifyProduct → Product (formato interno)
 */
export function adaptVentifyProduct(vp: VentifyProduct): Product {
  return {
    id: vp.id,
    name: vp.name,
    description: vp.description || 'Sin descripción',
    price: vp.price,
    category: vp.category,

    // Extraer material desde atributos o inferir desde categoría
    material: getMaterialFromProduct(vp),

    // Manejar imágenes (priorizar galleryImages si existe)
    images: vp.galleryImages && vp.galleryImages.length > 0
      ? vp.galleryImages
      : vp.imageUrl && vp.imageUrl.length > 0
        ? [vp.imageUrl]
        : ['/images/a3dl_logo.webp'],

    stock: vp.stock,
    // Solo usar isFeatured del backend, no inferir de stock
    featured: vp.isFeatured || false,

    // Timestamps - usar fecha actual como fallback
    createdAt: new Date(),
    updatedAt: new Date(),

    // Extraer de attributes o usar defaults, priorizando dimensiones nativas
    dimensions: vp.dimensions ? { width: vp.dimensions.width, height: vp.dimensions.height, depth: vp.dimensions.length } : extractDimensionsFromAttributes(vp.attributes),
    weight: vp.weight || extractWeightFromAttributes(vp.attributes),

    // Custom E-commerce mapping
    slug: vp.slug,
    tags: vp.tags || [],
    seo: vp.seo || undefined,
  };
}


// Exportar instancia singleton
export const ventifyAPI = new VentifyAPI()

// Exportar clase para testing
export default VentifyAPI
