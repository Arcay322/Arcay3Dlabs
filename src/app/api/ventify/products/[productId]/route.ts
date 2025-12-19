import { NextRequest, NextResponse } from 'next/server';

const VENTIFY_API_URL = process.env.VENTIFY_API_URL || 'http://localhost:9002';
const VENTIFY_API_KEY = process.env.VENTIFY_API_KEY;
const ACCOUNT_ID = process.env.VENTIFY_ACCOUNT_ID;

/**
 * GET /api/ventify/products/[productId]
 * Proxy seguro para obtener un producto específico desde Ventify
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    if (!VENTIFY_API_URL || !ACCOUNT_ID) {
      return NextResponse.json(
        { success: false, error: 'Servicio no configurado' },
        { status: 503 }
      );
    }

    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID requerido' },
        { status: 400 }
      );
    }

    const url = `${VENTIFY_API_URL}/api/public/stores/${ACCOUNT_ID}/products/${productId}`;

    console.log('📥 Fetching product from Ventify:', productId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

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
        console.error('Ventify product error:', response.status, result);
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Error al obtener producto',
          },
          { status: response.status }
        );
      }

      console.log('✅ Got product from Ventify:', result.data?.name);

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
          { success: false, error: 'Timeout al obtener producto' },
          { status: 504 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('Error in product proxy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener producto',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
