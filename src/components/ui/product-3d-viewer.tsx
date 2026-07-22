'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Product } from '@/lib/firebase/types';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  Play,
  Pause,
  Smartphone,
  Sparkles,
  CheckCircle,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Product3DViewerProps {
  product: Product;
  colorHex?: string;
}

/**
 * Genera una geometría 3D suave, realista y reconocible según el tipo de producto
 */
function createProceduralProductGeometry(category: string, name: string): THREE.BufferGeometry {
  const cat = category.toLowerCase();
  const n = name.toLowerCase();

  let geo: THREE.BufferGeometry;

  if (cat.includes('decoración') || n.includes('jarrón') || n.includes('maceta') || n.includes('lámpara')) {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const y = t * 14 - 7;
      const radius = 3.5 + Math.sin(t * Math.PI * 2.5) * 1.8 + (t > 0.8 ? (t - 0.8) * 3 : 0);
      points.push(new THREE.Vector2(radius, y));
    }
    geo = new THREE.LatheGeometry(points, 64);
  } else if (cat.includes('mecánico') || n.includes('engranaje') || n.includes('arduino') || n.includes('carcasa')) {
    const shape = new THREE.Shape();
    const teeth = 16;
    const outerRadius = 7.5;
    const innerRadius = 5.8;

    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
      const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;

      if (i === 0) shape.moveTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius);
      shape.lineTo(Math.cos(angle2) * innerRadius, Math.sin(angle2) * innerRadius);
      shape.lineTo(Math.cos(angle2) * outerRadius, Math.sin(angle2) * outerRadius);
      shape.lineTo(Math.cos(angle3) * outerRadius, Math.sin(angle3) * outerRadius);
      shape.lineTo(Math.cos(angle3) * innerRadius, Math.sin(angle3) * innerRadius);
      shape.lineTo(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius);
    }

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 2.2, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = { depth: 2.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.3, bevelThickness: 0.3 };
    geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  } else if (cat.includes('organizadores') || cat.includes('utilidades') || n.includes('soporte') || n.includes('celular') || n.includes('llaves')) {
    const shape = new THREE.Shape();
    shape.moveTo(-5, -4);
    shape.lineTo(5, -4);
    shape.lineTo(6, -2);
    shape.lineTo(2, 6);
    shape.lineTo(-2, 6);
    shape.lineTo(-6, -2);
    shape.closePath();

    const extrudeSettings = { depth: 7, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.4, bevelThickness: 0.4 };
    geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  } else {
    geo = new THREE.IcosahedronGeometry(6, 4);
  }

  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export function Product3DViewer({ product, colorHex }: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [showARDialog, setShowARDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Escena, cámara y renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d1117');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0, 0);
    controls.saveState();
    controlsRef.current = controls;

    // Luces de Estudio
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 1.4);
    keyLight.position.set(15, 25, 20);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f3ff, 1.0);
    rimLight.position.set(-20, 10, -20);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf97316, 0.8, 50);
    fillLight.position.set(0, -10, 15);
    scene.add(fillLight);

    // Cama de impresión 3D
    const gridHelper = new THREE.GridHelper(30, 15, 0xf97316, 0x334155);
    gridHelper.position.y = -7;
    scene.add(gridHelper);

    const activeColor = colorHex || '#f97316';

    const createMeshFallback = () => {
      const geometry = createProceduralProductGeometry(product.category, product.name);
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.35,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, meshMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    // Cargar modelo personalizado si existe
    if (product.modelUrl) {
      const url = product.modelUrl.trim();
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isStl = cleanUrl.endsWith('.stl') || url.toLowerCase().includes('.stl');
      const targetUrl = url.startsWith('http') ? `/api/model-proxy?url=${encodeURIComponent(url)}` : url;

      if (cleanUrl.endsWith('.glb') || cleanUrl.endsWith('.gltf') || url.toLowerCase().includes('.glb') || !isStl) {
        const loader = new GLTFLoader();
        loader.load(
          targetUrl,
          (gltf) => {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            if (maxDim > 0 && (maxDim < 2 || maxDim > 25)) {
              const scaleFactor = 12 / maxDim;
              model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }

            const scaledBbox = new THREE.Box3().setFromObject(model);
            const scaledCenter = scaledBbox.getCenter(new THREE.Vector3());
            model.position.sub(scaledCenter);

            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            scene.add(model);
          },
          undefined,
          (err) => {
            console.warn('No se pudo cargar GLB personalizado:', err);
            createMeshFallback();
          }
        );
      } else if (isStl) {
        const loader = new STLLoader();
        loader.load(
          targetUrl,
          (geometry) => {
            geometry.center();
            geometry.computeVertexNormals();
            const meshMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(activeColor),
              roughness: 0.35,
              metalness: 0.2,
            });
            const mesh = new THREE.Mesh(geometry, meshMaterial);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
          },
          undefined,
          (err) => {
            console.warn('No se pudo cargar STL personalizado:', err);
            createMeshFallback();
          }
        );
      } else {
        createMeshFallback();
      }
    } else {
      createMeshFallback();
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [product, colorHex, autoRotate]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleOpenAR = () => {
    const rawUrl = product.modelUrl || window.location.href;
    if (isMobile) {
      if (/Android/i.test(navigator.userAgent)) {
        window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(rawUrl)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
      } else {
        window.open(rawUrl, '_blank');
      }
    } else {
      setShowARDialog(true);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Contenedor del Lienzo 3D */}
      <div className="relative aspect-square w-full border-2 border-primary/40 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl group">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* HUD Superior: Badge de 360° */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-border text-xs font-code flex items-center gap-2 z-10">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-bold text-foreground">VISOR 3D 360°</span>
        </div>

        {/* Botón de Realidad Aumentada (AR) */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            type="button"
            onClick={handleOpenAR}
            size="sm"
            className="gradient-primary font-code text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <Smartphone className="h-4 w-4" />
            <span>Ver en AR</span>
          </Button>
        </div>

        {/* HUD Inferior: Controles Interactivos (Giro y Reset) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 pointer-events-auto bg-black/80 backdrop-blur-md p-1 rounded-md border border-border">
            {/* Auto-rotar Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-primary"
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pausar Rotación' : 'Girar 360°'}
            >
              {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            {/* Reset Vista */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-primary"
              onClick={handleResetCamera}
              title="Reiniciar Ángulo"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-[10px] font-code text-muted-foreground bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-border/50">
            Arrastra para rotar 360° | Scroll zoom
          </div>
        </div>
      </div>

      {/* Modal / Diálogo de Realidad Aumentada (AR) para PC */}
      <Dialog open={showARDialog} onOpenChange={setShowARDialog}>
        <DialogContent className="max-w-md bg-zinc-900 border-2 border-primary/50 text-white z-[100] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <span>Realidad Aumentada (AR)</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-body">
              Proyecta <strong>{product.name}</strong> a escala real en tu mesa o espacio físico.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-center">
            <div className="p-6 border-2 border-dashed border-primary/40 rounded-lg bg-secondary/30 flex flex-col items-center justify-center space-y-3">
              <div className="w-36 h-36 bg-white p-2 rounded-md shadow-md flex items-center justify-center border border-border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  alt="QR Realidad Aumentada"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs font-code text-primary uppercase tracking-wider font-semibold">
                Escanea el código QR con la cámara de tu celular
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Abre la cámara de tu teléfono móvil para proyectar esta pieza a escala real 1:1 sobre tu escritorio.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
