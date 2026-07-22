import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy servidor para cargar modelos 3D (.glb, .gltf, .stl) omitiendo restricciones CORS del navegador
 * GET /api/model-proxy?url=https://firebasestorage.googleapis.com/...
 */
export async function GET(request: NextRequest) {
  try {
    const rawUrlIndex = request.url.indexOf('?url=');
    let targetUrl = '';

    if (rawUrlIndex !== -1) {
      targetUrl = request.url.substring(rawUrlIndex + 5);
      // Decodificar si la URL viene completamente encoded
      if (targetUrl.startsWith('http%3A') || targetUrl.startsWith('https%3A')) {
        targetUrl = decodeURIComponent(targetUrl);
      }
    } else {
      const { searchParams } = new URL(request.url);
      targetUrl = searchParams.get('url') || '';
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL del modelo es requerida' }, { status: 400 });
    }

    // Fetch directo desde el servidor a la URL completa (incluyendo alt=media&token=...)
    const response = await fetch(targetUrl, {
      method: 'GET',
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error(`[ModelProxy] Error desde Firebase/Fuente (${response.status}):`, targetUrl);
      return NextResponse.json(
        { error: `Error al obtener el modelo 3D desde la fuente: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'model/gltf-binary';

    // Retornar archivo binario con headers de CORS de amplio alcance
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error en proxy de modelos 3D:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud del modelo 3D' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
