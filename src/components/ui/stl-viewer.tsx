'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  calculateSTLGeometryMetrics,
  estimateSTLCost,
  STLAnalysisResult,
} from '@/lib/stl-utils';
import { Badge } from '@/components/ui/badge';
import { Box, Layers, Weight, DollarSign, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface STLViewerProps {
  file: File | null;
  material?: string;
  infillPercent?: number;
  quantity?: number;
  onAnalysisComplete?: (result: STLAnalysisResult) => void;
}

export function STLViewer({
  file,
  material = 'PLA',
  infillPercent = 20,
  quantity = 1,
  onAnalysisComplete,
}: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<STLAnalysisResult | null>(null);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Escena, cámara y renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#14171d');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Limpiar contenedor e insertar canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Luces técnicas de taller
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf97316, 1.2); // Naranja hotend
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f3ff, 0.8); // Cian neón
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Rejilla de base técnica
    const gridHelper = new THREE.GridHelper(200, 20, 0xf97316, 0x334155);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Leer el archivo STL en binario
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!isMounted) return;

      try {
        const buffer = e.target?.result as ArrayBuffer;
        const loader = new STLLoader();
        const geometry = loader.parse(buffer);

        // Centrar y ajustar la escala del modelo 3D en el viewport
        geometry.center();
        geometry.computeVertexNormals();

        // Obtener métricas geométricas
        const { dimensions, volumeCm3 } = calculateSTLGeometryMetrics(geometry);

        // Material con estética de manufactura digital
        const meshMaterial = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          roughness: 0.3,
          metalness: 0.4,
          wireframe: false,
        });

        const mesh = new THREE.Mesh(geometry, meshMaterial);

        // Malla secundaria wireframe para efecto técnico
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        });
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        mesh.add(wireMesh);

        scene.add(mesh);

        // Ajustar posición de cámara acorde al tamaño del objeto
        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.8;
        cameraZ = Math.max(cameraZ, 50);

        camera.position.set(cameraZ * 0.7, cameraZ * 0.7, cameraZ);
        camera.lookAt(0, 0, 0);
        controls.update();

        // Calcular costo estimado
        const costEstimate = estimateSTLCost({
          volumeCm3,
          material,
          infillPercent,
          quantity,
        });

        const fullAnalysis: STLAnalysisResult = {
          dimensions,
          volumeCm3,
          ...costEstimate,
        };

        setMetrics(fullAnalysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(fullAnalysis);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error parseando archivo STL:', err);
        setError('No se pudo procesar el archivo STL. Verifica que el formato sea válido.');
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error leyendo el archivo desde el dispositivo.');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);

    // Bucle de animación 3D
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [file]);

  // Recalcular costo cuando cambien los parámetros (material, infill, cantidad)
  useEffect(() => {
    if (metrics) {
      const updatedCost = estimateSTLCost({
        volumeCm3: metrics.volumeCm3,
        material,
        infillPercent,
        quantity,
      });

      const updatedMetrics: STLAnalysisResult = {
        ...metrics,
        ...updatedCost,
      };

      setMetrics(updatedMetrics);
      if (onAnalysisComplete) {
        onAnalysisComplete(updatedMetrics);
      }
    }
  }, [material, infillPercent, quantity]);

  if (!file) return null;

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* Lienzo 3D */}
      <div className="relative w-full h-72 md:h-80 rounded-lg border-2 border-primary/30 overflow-hidden bg-zinc-950 shadow-inner group">
        <div ref={containerRef} className="w-full h-full" />

        {/* HUD Indicator */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-border text-xs font-code flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>MODELO 3D LOADED: {file.name.slice(0, 24)}</span>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-code text-xs text-primary uppercase tracking-wider">
              Analizando Geometría 3D...
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-destructive/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
            <AlertTriangle className="h-8 w-8" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="absolute bottom-3 right-3 text-[10px] font-code text-muted-foreground bg-black/60 px-2 py-1 rounded">
          Arrastra para rotar | Scroll para zoom
        </div>
      </div>

      {/* Panel de Métricas Calculadas en Tiempo Real */}
      {metrics && !loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Dimensiones */}
          <div className="p-3 bg-secondary/40 border border-border rounded-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-code uppercase">
              <Box className="h-3.5 w-3.5 text-primary" />
              <span>Medidas (mm)</span>
            </div>
            <p className="font-bold font-code text-sm text-foreground">
              {metrics.dimensions.x} × {metrics.dimensions.y} × {metrics.dimensions.z}
            </p>
          </div>

          {/* Volumen */}
          <div className="p-3 bg-secondary/40 border border-border rounded-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-code uppercase">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Volumen</span>
            </div>
            <p className="font-bold font-code text-sm text-foreground">
              {metrics.volumeCm3} cm³
            </p>
          </div>

          {/* Peso Estimado */}
          <div className="p-3 bg-secondary/40 border border-border rounded-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-code uppercase">
              <Weight className="h-3.5 w-3.5 text-primary" />
              <span>Peso Est. ({material})</span>
            </div>
            <p className="font-bold font-code text-sm text-foreground">
              ≈ {metrics.weightGrams} g
            </p>
          </div>

          {/* Estimación de Precio */}
          <div className="p-3 bg-primary/10 border border-primary/40 rounded-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-primary font-code uppercase font-semibold">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Est. Referencia</span>
            </div>
            <p className="font-bold font-code text-base text-primary">
              S/ {metrics.estimatedPrice.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground font-code">
              Rango: S/ {metrics.estimatedPriceMin} - {metrics.estimatedPriceMax}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
