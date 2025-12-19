import { NextRequest, NextResponse } from 'next/server';

const VENTIFY_API_URL = process.env.VENTIFY_API_URL || 'http://localhost:9002';
const VENTIFY_API_KEY = process.env.VENTIFY_API_KEY;
const ACCOUNT_ID = process.env.VENTIFY_ACCOUNT_ID;

/**
 * GET /api/ventify/products
 * Proxy seguro para obtener productos desde Ventify
 */
export async function GET(request: NextRequest) {
  try {
    if (!VENTIFY_API_URL || !ACCOUNT_ID) {
      return NextResponse.json(
        { success: false, error: 'Servicio no configurado' },
        { status: 503 }
      );
    }

    // Obtener query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const limit = searchParams.get('limit');

    // Construir URL con parámetros
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (active) params.set('active', active);
    if (limit) params.set('limit', limit);

    const url = `${VENTIFY_API_URL}/api/public/stores/${ACCOUNT_ID}/products${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    console.log('📥 Fetching products from Ventify:', url);

    // Timeout de 8 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // API Key es opcional para lectura pública
      if (VENTIFY_API_KEY) {
        headers['X-API-Key'] = VENTIFY_API_KEY;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
        // Cache por 5 minutos
        next: { revalidate: 300 },
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        console.error('Ventify products error:', response.status, result);
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Error al obtener productos',
          },
          { status: response.status }
        );
      }

      console.log(`✅ Got ${result.data?.length || 0} products from Ventify`);

      return NextResponse.json(result, { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Timeout al obtener productos' },
          { status: 504 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('Error in products proxy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
