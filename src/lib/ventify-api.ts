/**
 * Cliente API para conectar con Ventify
 * Maneja todas las llamadas a la API pública de Ventify
 */

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

  constructor() {
    this.baseUrl = API_URL
    this.accountId = ACCOUNT_ID
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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

// Exportar instancia singleton
export const ventifyAPI = new VentifyAPI()

// Exportar clase para testing
export default VentifyAPI
