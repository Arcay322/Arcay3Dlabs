/**
 * Cliente API para conectar con Ventify
 * Maneja todas las llamadas a la API pública de Ventify
 */

import { Product } from '@/lib/firebase/types';

const API_URL = process.env.NEXT_PUBLIC_VENTIFY_API_URL || 'http://localhost:3000'
const ACCOUNT_ID = process.env.NEXT_PUBLIC_ACCOUNT_ID

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
  // Campos opcionales nuevos de la API
  attributes?: Array<{ name: string; value: string }>;
  galleryImages?: string[];
  isFeatured?: boolean;
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
  private baseUrl: string
  private accountId: string | undefined
  private apiKey: string | undefined

  constructor() {
    this.baseUrl = API_URL
    this.accountId = ACCOUNT_ID
    this.apiKey = process.env.NEXT_PUBLIC_VENTIFY_API_KEY
  }

  /**
   * Obtener headers para las requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey
    }
    
    return headers
  }

  /**
   * Obtener todos los productos
   */
  async getProducts(options?: {
    category?: string
    active?: boolean
    limit?: number
  }): Promise<VentifyProduct[]> {
    if (!this.accountId) {
      console.warn('ACCOUNT_ID no configurado, usando datos mock')
      throw new Error('ACCOUNT_ID no configurado')
    }

    const params = new URLSearchParams()
    if (options?.category) params.set('category', options.category)
    if (options?.active !== undefined) params.set('active', String(options.active))
    if (options?.limit) params.set('limit', String(options.limit))

    const url = `${this.baseUrl}/api/public/stores/${this.accountId}/products${
      params.toString() ? `?${params.toString()}` : ''
    }`

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener productos')
    }

    return result.data
  }

  /**
   * Obtener un producto por ID
   */
  async getProduct(productId: string): Promise<VentifyProduct> {
    if (!this.accountId) {
      throw new Error('ACCOUNT_ID no configurado')
    }

    const url = `${this.baseUrl}/api/public/stores/${this.accountId}/products/${productId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Producto no encontrado')
      }
      throw new Error(`Error al obtener producto: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener producto')
    }

    return result.data
  }

  /**
   * Crear una cotización
   */
  async createQuote(quoteData: VentifyQuote): Promise<{ id: string; status: string }> {
    if (!this.accountId) {
      throw new Error('ACCOUNT_ID no configurado')
    }

    const url = `${this.baseUrl}/api/public/stores/${this.accountId}/quotes`

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(quoteData),
    })

    if (!response.ok) {
      throw new Error(`Error al crear cotización: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Error al crear cotización')
    }

    return result.data
  }

  /**
   * Verificar si la API está configurada
   */
  isConfigured(): boolean {
    return Boolean(this.accountId)
  }

  /**
   * Obtener la URL base de la API
   */
  getBaseUrl(): string {
    return this.baseUrl
  }

  /**
   * Obtener el Account ID configurado
   */
  getAccountId(): string | undefined {
    return this.accountId
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
  
  const width = attributes.find(a => a.name.toLowerCase().includes('ancho'))?.value;
  const height = attributes.find(a => a.name.toLowerCase().includes('alto'))?.value;
  const depth = attributes.find(a => a.name.toLowerCase().includes('profundidad'))?.value;
  
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
  
  const weight = attributes.find(a => a.name.toLowerCase().includes('peso'))?.value;
  return weight ? parseInt(weight) : 100;
}

/**
 * Adaptador: Convierte datos de Ventify API al formato interno de Arcay3Dlabs
 * Transforma VentifyProduct → Product (formato interno)
 */
export function adaptVentifyProduct(vp: VentifyProduct): Product {
  return {
    id: vp.id,
    name: vp.name,
    description: vp.description || 'Sin descripción',
    price: vp.price,
    category: vp.category,
    
    // Inferir material desde categoría
    material: getMaterialFromCategory(vp.category),
    
    // Manejar imágenes (priorizar galleryImages si existe)
    // Si no hay imagen, usar data URI para evitar errores de carga externa
    images: vp.galleryImages && vp.galleryImages.length > 0 
      ? vp.galleryImages 
      : vp.imageUrl && vp.imageUrl.length > 0
        ? [vp.imageUrl] 
        : ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569"%3ESin Imagen%3C/text%3E%3C/svg%3E'],
    
    stock: vp.stock,
    // Marcar como destacado si: 1) tiene el flag isFeatured, O 2) tiene stock disponible (temporal)
    featured: vp.isFeatured || vp.inStock,
    
    // Timestamps - usar fecha actual como fallback
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Extraer de attributes o usar defaults
    dimensions: extractDimensionsFromAttributes(vp.attributes),
    weight: extractWeightFromAttributes(vp.attributes),
  };
}


// Exportar instancia singleton
export const ventifyAPI = new VentifyAPI()

// Exportar clase para testing
export default VentifyAPI
