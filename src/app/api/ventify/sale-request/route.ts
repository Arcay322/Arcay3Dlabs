import { NextRequest, NextResponse } from 'next/server';

const VENTIFY_API_URL = process.env.VENTIFY_API_URL || 'http://localhost:9002';
const VENTIFY_API_KEY = process.env.VENTIFY_API_KEY; // Sin NEXT_PUBLIC_
const ACCOUNT_ID = process.env.VENTIFY_ACCOUNT_ID;   // Sin NEXT_PUBLIC_

/**
 * POST /api/ventify/sale-request
 * Proxy seguro para crear solicitudes de venta en Ventify
 * Las credenciales se mantienen en el servidor, no se exponen al cliente
 */
export async function POST(request: NextRequest) {
  try {
    // Validar que las credenciales estén configuradas
    if (!VENTIFY_API_URL || !VENTIFY_API_KEY || !ACCOUNT_ID) {
      console.error('Ventify credentials not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Servicio temporalmente no disponible. Por favor contacta a soporte.' 
        },
        { status: 503 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    
    // Validaciones básicas en el servidor
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Información del cliente incompleta' },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe incluir al menos un producto' },
        { status: 400 }
      );
    }

    // Validar cada item
    for (const item of body.items) {
      if (!item.productId || !item.productName || !item.quantity || typeof item.price !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Datos de productos incompletos o inválidos' },
          { status: 400 }
        );
      }

      if (item.quantity <= 0 || item.price < 0) {
        return NextResponse.json(
          { success: false, error: 'Cantidad o precio inválidos' },
          { status: 400 }
        );
      }
    }

    console.log('📤 Sending sale request to Ventify:', {
      accountId: ACCOUNT_ID,
      items: body.items.length,
      total: body.total,
    });

    // Llamar a la API de Ventify desde el servidor (credenciales seguras)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(
        `${VENTIFY_API_URL}/api/public/stores/${ACCOUNT_ID}/sale-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': VENTIFY_API_KEY, // ✅ Seguro en el servidor
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const result = await response.json();

      // Si Ventify responde con error
      if (!response.ok) {
        console.error('Ventify API error:', response.status, result);
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Error al procesar la solicitud',
            details: process.env.NODE_ENV === 'development' ? result : undefined,
          },
          { status: response.status }
        );
      }

      console.log('✅ Sale request created:', result.data?.requestNumber);

      // Retornar respuesta de Ventify al cliente
      return NextResponse.json(result, { status: response.status });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout to Ventify');
        return NextResponse.json(
          { 
            success: false, 
            error: 'La solicitud tardó demasiado. Por favor intenta nuevamente.' 
          },
          { status: 504 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('Error in sale-request proxy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
