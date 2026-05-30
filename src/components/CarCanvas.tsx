import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface CarCanvasProps {
  modelName: 'mclaren' | 'redbull' | 'ferrari' | 'mercedes' | string;
  modelUrl: string; // Resolved Shopify CDN url
  scrollProgress?: number;
  onLoadProgress?: (progress: number) => void;
  className?: string;
}

export function CarCanvas({ modelName, modelUrl, scrollProgress = 0, onLoadProgress, className = '' }: CarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep scrollProgress and modelName in refs for the render loop to read safely
  const scrollProgressRef = useRef<number>(scrollProgress);
  useEffect(() => {
    if (scrollProgress !== undefined) {
      scrollProgressRef.current = scrollProgress;
    }
  }, [scrollProgress]);

  const modelNameRef = useRef<string>(modelName);
  useEffect(() => {
    modelNameRef.current = modelName;
  }, [modelName]);

  // Keep a stable ref to onLoadProgress to prevent reloading the model on parent renders
  const onLoadProgressRef = useRef(onLoadProgress);
  useEffect(() => {
    onLoadProgressRef.current = onLoadProgress;
  }, [onLoadProgress]);

  // Scene object refs for persistent caching and state tracking across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const loadedModelsRef = useRef<Map<string, THREE.Group>>(new Map());
  const activeModelNameRef = useRef<string>('');

  const [error, setError] = useState<string | null>(null);

  // ─── 1. Mount Effect: Initializes Three.js environment ONCE ───────────────────
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera: side-on view, FOV 40 for premium telephoto compression
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    
    let distance = 3.5;
    if (aspect < 1.6) {
      distance = 3.5 * (1.6 / aspect);
    }
    
    camera.position.set(distance, 0, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.7);
    scene.add(ambientLight);

    // Studio directional lighting
    const frontLight = new THREE.DirectionalLight('#ffffff', 1.8);
    frontLight.position.set(5, 10, 8);
    frontLight.castShadow = true;
    frontLight.shadow.mapSize.width = 2048;
    frontLight.shadow.mapSize.height = 2048;
    frontLight.shadow.bias = -0.0001;
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 1.0);
    rimLight.position.set(-5, 6, -8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight('#ffffff', 0.4);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    // Pivot group that hosts all models and handles scrolling animations
    const pivot = new THREE.Group();
    pivot.name = 'car-pivot';
    scene.add(pivot);
    pivotRef.current = pivot;

    // Autonomous Scroll Listener
    const track = canvas.closest('.product-track-wrapper');
    const handleScroll = () => {
      if (scrollProgress !== undefined && scrollProgress !== 0) return;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrolled = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrolled / maxScroll)) : 0;
      scrollProgressRef.current = progress;
    };

    if (scrollProgress === undefined || scrollProgress === 0) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      const asp = w / h;
      cameraRef.current.aspect = asp;

      let dist = 3.5;
      if (asp < 1.6) {
        dist = 3.5 * (1.6 / asp);
      }
      cameraRef.current.position.set(dist, 0, 0);
      cameraRef.current.lookAt(0, 0, 0);

      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const pvt = pivotRef.current;
      if (pvt) {
        const TEAM_Y_ROTATIONS: Record<string, number> = {
          mclaren: Math.PI / 2,
          redbull: Math.PI / 2,
          ferrari: Math.PI / 2,
          mercedes: Math.PI / 2,
        };

        const currentActive = modelNameRef.current;
        const sp = scrollProgressRef.current;
        const baseY = TEAM_Y_ROTATIONS[currentActive] !== undefined ? TEAM_Y_ROTATIONS[currentActive] : Math.PI / 2;

        const startY = baseY - Math.PI / 2;
        const endY   = baseY + 2 * Math.PI;
        const targetY = startY + sp * (endY - startY);

        pvt.rotation.y += (targetY - pvt.rotation.y) * 0.08;

        const targetX = sp > 0 ? (sp - 0.5) * 0.04 : 0;
        pvt.rotation.x += (targetX - pvt.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      if (scrollProgress === undefined || scrollProgress === 0) {
        window.removeEventListener('scroll', handleScroll);
      }

      loadedModelsRef.current.forEach((model) => {
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => mat.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      });

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      loadedModelsRef.current.clear();
      pivotRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  // ─── 2. Model Swapping Effect ────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    const pivot = pivotRef.current;
    if (!scene || !pivot || !modelUrl) return;

    const previousModelName = activeModelNameRef.current;
    activeModelNameRef.current = modelName;

    if (previousModelName && loadedModelsRef.current.has(previousModelName)) {
      const prevModel = loadedModelsRef.current.get(previousModelName);
      if (prevModel) {
        prevModel.visible = false;
      }
    }

    if (pivotRef.current && previousModelName !== modelName) {
      const TEAM_Y_ROTATIONS: Record<string, number> = {
        mclaren: Math.PI / 2,
        redbull: Math.PI / 2,
        ferrari: Math.PI / 2,
        mercedes: Math.PI / 2,
      };
      const baseY = TEAM_Y_ROTATIONS[modelName] ?? Math.PI / 2;
      const sp = scrollProgressRef.current;
      const startY = baseY - Math.PI / 2;
      const endY   = baseY + 2 * Math.PI;
      const snapY  = startY + sp * (endY - startY);
      pivotRef.current.rotation.y = snapY;
      pivotRef.current.rotation.x = sp > 0 ? (sp - 0.5) * 0.04 : 0;
    }

    if (loadedModelsRef.current.has(modelName)) {
      const activeModel = loadedModelsRef.current.get(modelName);
      if (activeModel) {
        activeModel.visible = true;
        if (onLoadProgressRef.current) onLoadProgressRef.current(100);
      }
      return;
    }

    setError(null);
    if (onLoadProgressRef.current) onLoadProgressRef.current(5);

    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        try {
          if (activeModelNameRef.current !== modelName) {
            gltf.scene.traverse((obj) => {
              if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
              }
            });
            return;
          }

          const model = gltf.scene;
          model.name = `car-${modelName}`;

          const staleModel = loadedModelsRef.current.get(modelName);
          if (staleModel && staleModel !== model) {
            pivot.remove(staleModel);
            staleModel.traverse((obj) => {
              if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach((m) => m.dispose());
                } else if (mesh.material) {
                  (mesh.material as THREE.Material).dispose();
                }
              }
            });
            loadedModelsRef.current.delete(modelName);
          }

          model.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.envMapIntensity = 1.5;
                mesh.material.roughness = Math.max(mesh.material.roughness, 0.05);
              }
            }
          });

          const box = new THREE.Box3();
          box.makeEmpty();
          model.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const lowerName = node.name.toLowerCase();
              if (
                !node.visible ||
                lowerName.includes('shadow') ||
                lowerName.includes('floor') ||
                lowerName.includes('ground') ||
                lowerName.includes('plane') ||
                lowerName.includes('light') ||
                lowerName.includes('camera') ||
                lowerName.includes('backdrop') ||
                lowerName.includes('helper')
              ) {
                return;
              }

              node.updateWorldMatrix(true, true);
              const geometry = (node as THREE.Mesh).geometry;
              if (geometry) {
                if (!geometry.boundingBox) geometry.computeBoundingBox();
                const meshBox = geometry.boundingBox!.clone();
                meshBox.applyMatrix4(node.matrixWorld);
                box.union(meshBox);
              }
            }
          });

          const center = new THREE.Vector3();
          box.getCenter(center);
          const size = new THREE.Vector3();
          box.getSize(size);

          const maxDim = Math.max(size.x, size.y, size.z);
          const targetSize = 3.2;
          const scaleFactor = targetSize / maxDim;
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);

          model.position.x = -center.x * scaleFactor;
          model.position.y = -center.y * scaleFactor;
          model.position.z = -center.z * scaleFactor;

          pivot.add(model);
          loadedModelsRef.current.set(modelName, model);

          model.visible = true;
          if (onLoadProgressRef.current) onLoadProgressRef.current(100);
        } catch {
          setError('Scene parsing error: chassis is structurally invalid.');
        }
      },
      (xhr) => {
        if (activeModelNameRef.current === modelName && xhr.total > 0 && onLoadProgressRef.current) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          onLoadProgressRef.current(percent);
        }
      },
      () => {
        setError(`Failed to retrieve model chassis.`);
      }
    );
  }, [modelName, modelUrl]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center border border-red-500 bg-white p-6 text-center text-red-500 ${className}`}>
        <span className="text-sm font-semibold uppercase tracking-wider mb-2">SYSTEM FAULT</span>
        <span className="text-xs uppercase opacity-70">{error}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full bg-transparent pointer-events-none" />
    </div>
  );
}
