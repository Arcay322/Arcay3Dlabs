'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Product } from '@/lib/firebase/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Smartphone,
  Sparkles,
  CheckCircle,
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
    // Jarrón Cerámico Espiralado Suave (64 segmentos)
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const y = t * 14 - 7;
      const radius = 3.5 + Math.sin(t * Math.PI * 2.5) * 1.8 + (t > 0.8 ? (t - 0.8) * 3 : 0);
      points.push(new THREE.Vector2(radius, y));
    }
    geo = new THREE.LatheGeometry(points, 64);
  } else if (cat.includes('mecánico') || n.includes('engranaje') || n.includes('arduino') || n.includes('carcasa')) {
    // Engranaje Mecánico de Precisión
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

    // Agujero eje central
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 2.2, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = { depth: 2.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.3, bevelThickness: 0.3 };
    geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  } else if (cat.includes('organizadores') || cat.includes('utilidades') || n.includes('soporte') || n.includes('celular') || n.includes('llaves')) {
    // Soporte Ergonómico para Celular / Dock de Escritorio
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
  } else if (cat.includes('arte') || cat.includes('juguetes') || n.includes('ajedrez') || n.includes('figura') || n.includes('busto')) {
    // Pieza de Escultura / Torre de Ajedrez Elegante
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(4.5, -7));
    points.push(new THREE.Vector2(4.5, -5.5));
    points.push(new THREE.Vector2(3.5, -4.5));
    points.push(new THREE.Vector2(2.5, 0));
    points.push(new THREE.Vector2(3.2, 3));
    points.push(new THREE.Vector2(3.8, 4.5));
    points.push(new THREE.Vector2(3.8, 6));
    points.push(new THREE.Vector2(2.0, 6));
    points.push(new THREE.Vector2(2.0, 7));
    points.push(new THREE.Vector2(0, 7));
    geo = new THREE.LatheGeometry(points, 48);
  } else {
    // Dodecaedro Geodésico de Diseño
    geo = new THREE.DodecahedronGeometry(6, 1);
  }

  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export function Product3DViewer({ product, colorHex }: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
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
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Limpiar contenedor e insertar canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controlsRef.current = controls;

    // Luces de Estudio de Fotografía 3D
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

    // Cama de impresión 3D (220x220 mm simulación)
    const gridHelper = new THREE.GridHelper(30, 15, 0xf97316, 0x334155);
    gridHelper.position.y = -7;
    scene.add(gridHelper);

    // Color del material (variante seleccionada o naranja por defecto)
    const activeColor = colorHex || '#f97316';

    const createMeshFallback = () => {
      const geometry = createProceduralProductGeometry(product.category, product.name);
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.35,
        metalness: 0.2,
        wireframe: wireframeMode,
      });

      const mesh = new THREE.Mesh(geometry, meshMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    // Si el producto tiene una URL de modelo 3D (.glb o .stl) adjunta desde Ventify
    if (product.modelUrl) {
      const url = product.modelUrl.trim();
      const ext = url.split('.').pop()?.toLowerCase();

      if (ext === 'glb' || ext === 'gltf') {
        const loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const center = bbox.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Respetar materiales y colores del AMS cargados en el GLB
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (wireframeMode && (child as THREE.Mesh).material) {
                  ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).wireframe = true;
                }
              }
            });

            scene.add(model);
          },
          undefined,
          (err) => {
            console.warn('No se pudo cargar el archivo GLB personalizado, usando vista previa:', err);
            createMeshFallback();
          }
        );
      } else if (ext === 'stl') {
        const loader = new STLLoader();
        loader.load(
          url,
          (geometry) => {
            geometry.center();
            geometry.computeVertexNormals();
            const meshMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(activeColor),
              roughness: 0.35,
              metalness: 0.2,
              wireframe: wireframeMode,
            });
            const mesh = new THREE.Mesh(geometry, meshMaterial);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
          },
          undefined,
          (err) => {
            console.warn('No se pudo cargar el archivo STL personalizado, usando vista previa:', err);
            createMeshFallback();
          }
        );
      } else {
        createMeshFallback();
      }
    } else {
      createMeshFallback();
    }

    // Posición inicial de cámara
    camera.position.set(18, 14, 24);
    camera.lookAt(0, 0, 0);
    controls.update();

    // Bucle de animación 3D
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.autoRotate = autoRotate;
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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [product, colorHex, wireframeMode, autoRotate]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
  };

  const handleOpenAR = () => {
    setShowARDialog(true);
  };

  return (
    <div className="w-full space-y-3">
      {/* Contenedor del Lienzo 3D */}
      <div className="relative aspect-square w-full border-2 border-primary/40 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl group">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* HUD Superior: Badge de 360° */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-border text-xs font-code flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-bold text-foreground">VISOR 3D 360°</span>
        </div>

        {/* Botón de Realidad Aumentada (AR) */}
        <div className="absolute top-3 right-3">
          <Button
            onClick={handleOpenAR}
            size="sm"
            className="gradient-primary font-code text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <Smartphone className="h-4 w-4" />
            <span>Ver en AR</span>
          </Button>
        </div>

        {/* HUD Inferior: Controles Interactivos */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
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

            {/* Wireframe / Capas Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${wireframeMode ? 'text-primary' : 'text-white'} hover:text-primary`}
              onClick={() => setWireframeMode(!wireframeMode)}
              title="Modo Capas 3D Wireframe"
            >
              <Layers className="h-4 w-4" />
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

      {/* Modal / Diálogo de Realidad Aumentada (AR) */}
      <Dialog open={showARDialog} onOpenChange={setShowARDialog}>
        <DialogContent className="max-w-md bg-card border-layered">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <span>Realidad Aumentada (AR)</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-body">
              Proyecta <strong>{product.name}</strong> a escala real en tu mesa o espacio físico antes de comprar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {isMobile ? (
              <div className="space-y-3 text-center">
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/10 space-y-2">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto" />
                  <p className="font-bold text-sm">¡Dispositivo Móvil Detectado!</p>
                  <p className="text-xs text-muted-foreground">
                    Haz clic a continuación para abrir la cámara e inspeccionar el objeto 3D en tu entorno real.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    alert('Lanzando cámara AR... Apunta a una superficie plana.');
                  }}
                  className="w-full gradient-primary font-code uppercase tracking-wider text-sm h-12"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Iniciar Visor AR en Cámara
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-6 border-2 border-dashed border-primary/40 rounded-lg bg-secondary/30 flex flex-col items-center justify-center space-y-3">
                  <div className="w-32 h-32 bg-white p-2 rounded-md shadow-inner flex items-center justify-center border border-border">
                    <div className="w-full h-full border-2 border-dashed border-zinc-800 flex items-center justify-center text-[10px] font-code text-zinc-800 text-center font-bold">
                      [ ESCANEAR CON LA CÁMARA DE TU CELULAR ]
                    </div>
                  </div>
                  <p className="text-xs font-code text-primary uppercase tracking-wider font-semibold">
                    Escanea el código QR con tu móvil
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Abre la cámara de tu teléfono Android o iPhone para proyectar esta pieza 3D en tu escritorio a escala real 1:1.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
