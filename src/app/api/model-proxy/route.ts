import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy servidor para cargar modelos 3D (.glb, .gltf, .stl) omitiendo restricciones CORS del navegador
 * GET /api/model-proxy?url=https://firebasestorage.googleapis.com/...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelUrl = searchParams.get('url');

    if (!modelUrl) {
      return NextResponse.json({ error: 'URL del modelo es requerida' }, { status: 400 });
    }

    // Descodificar URL si es necesario
    const decodedUrl = decodeURIComponent(modelUrl);

    // Fetch al recurso 3D desde el servidor (los servidores no están sujetos a CORS del navegador)
    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Arcay3DLabs-ModelProxy/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error al obtener el modelo 3D desde la fuente: ${response.statusText}` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Retornar el archivo binario con headers de CORS abiertos para el cliente
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
