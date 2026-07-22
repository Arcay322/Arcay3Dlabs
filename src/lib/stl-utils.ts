import * as THREE from 'three';

export interface STLAnalysisResult {
  dimensions: {
    x: number; // Ancho (mm)
    y: number; // Alto (mm)
    z: number; // Profundidad (mm)
  };
  volumeCm3: number; // Volumen físico (cm³)
  weightGrams: number; // Peso estimado (g)
  estimatedPrice: number; // Precio sugerido (S/)
  estimatedPriceMin: number; // Rango mínimo (S/)
  estimatedPriceMax: number; // Rango máximo (S/)
}

export const MATERIAL_DENSITIES: Record<string, number> = {
  PLA: 1.24,
  PETG: 1.27,
  ABS: 1.04,
  Resina: 1.15,
};

/**
 * Calcula el volumen signado de un triángulo 3D (Teorema de Gauss)
 */
function signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
  return p1.dot(p2.clone().cross(p3)) / 6.0;
}

/**
 * Analiza la geometría 3D para calcular dimensiones exactas (mm) y volumen (cm³)
 */
export function calculateSTLGeometryMetrics(geometry: THREE.BufferGeometry): {
  dimensions: { x: number; y: number; z: number };
  volumeCm3: number;
} {
  // Asegurar que la caja delimitadora esté calculada
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox || new THREE.Box3();

  const size = new THREE.Vector3();
  bbox.getSize(size);

  const dimensions = {
    x: Math.round(size.x * 10) / 10,
    y: Math.round(size.y * 10) / 10,
    z: Math.round(size.z * 10) / 10,
  };

  // Cálculo del volumen acumulado por triángulos
  let totalVolumeMm3 = 0;
  const position = geometry.attributes.position;
  const index = geometry.index;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      p1.fromBufferAttribute(position, index.getX(i));
      p2.fromBufferAttribute(position, index.getX(i + 1));
      p3.fromBufferAttribute(position, index.getX(i + 2));
      totalVolumeMm3 += signedVolumeOfTriangle(p1, p2, p3);
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      p1.fromBufferAttribute(position, i);
      p2.fromBufferAttribute(position, i + 1);
      p3.fromBufferAttribute(position, i + 2);
      totalVolumeMm3 += signedVolumeOfTriangle(p1, p2, p3);
    }
  }

  // Convertir mm³ a cm³
  const volumeCm3 = Math.max(0.1, Math.round((Math.abs(totalVolumeMm3) / 1000) * 100) / 100);

  return { dimensions, volumeCm3 };
}

/**
 * Calcula la estimación de peso y costo basado en volumen, material e infill
 */
export function estimateSTLCost({
  volumeCm3,
  material = 'PLA',
  infillPercent = 20,
  quantity = 1,
}: {
  volumeCm3: number;
  material?: string;
  infillPercent?: number;
  quantity?: number;
}): {
  weightGrams: number;
  estimatedPrice: number;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
} {
  const density = MATERIAL_DENSITIES[material] || 1.24;

  // Factor de relleno: Paredes externas (~25% volumen) + relleno interno proporcional
  const infillFactor = 0.25 + 0.75 * (Math.min(100, Math.max(10, infillPercent)) / 100);
  const effectiveVolume = volumeCm3 * infillFactor;

  const weightGrams = Math.max(1, Math.round(effectiveVolume * density * 10) / 10);

  // Tarifas de referencia
  const pricePerGram = material === 'Resina' || material === 'ABS' ? 0.25 : 0.15;
  const basePreparationFee = 5.0; // Tarifa base fija

  const unitCost = basePreparationFee + weightGrams * pricePerGram;
  const totalCost = unitCost * Math.max(1, quantity);

  const estimatedPrice = Math.round(totalCost * 10) / 10;
  const estimatedPriceMin = Math.max(8.0, Math.round(estimatedPrice * 0.9 * 10) / 10);
  const estimatedPriceMax = Math.round(estimatedPrice * 1.15 * 10) / 10;

  return {
    weightGrams,
    estimatedPrice,
    estimatedPriceMin,
    estimatedPriceMax,
  };
}
