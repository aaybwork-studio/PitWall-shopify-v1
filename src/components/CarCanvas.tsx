import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface CarCanvasProps {
  modelName: string;
  modelUrl: string;
  mclarenUrl?: string;
  redbullUrl?: string;
  ferrariUrl?: string;
  mercedesUrl?: string;
  norrisHelmetUrl?: string;
  schumacherHelmetUrl?: string;
  verstappenHelmetUrl?: string;
  scrollProgress?: number;
  onLoadProgress?: (progress: number) => void;
  className?: string;
}

export function CarCanvas({ 
  modelName, 
  modelUrl, 
  mclarenUrl, 
  redbullUrl, 
  ferrariUrl, 
  mercedesUrl, 
  norrisHelmetUrl,
  schumacherHelmetUrl,
  verstappenHelmetUrl,
  scrollProgress = 0, 
  onLoadProgress, 
  className = '' 
}: CarCanvasProps) {
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
    
    const isHelmet = modelNameRef.current.includes('helmet') || modelNameRef.current.includes('schumacher') || modelNameRef.current.includes('norris');
    let distance = isHelmet ? 2.4 : 3.5;
    if (!isHelmet && aspect < 1.6) {
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
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    scene.add(ambientLight);

    // Studio directional lighting
    const frontLight = new THREE.DirectionalLight('#ffffff', 2.0);
    frontLight.position.set(5, 10, 8);
    frontLight.castShadow = true;
    frontLight.shadow.mapSize.width = 2048;
    frontLight.shadow.mapSize.height = 2048;
    frontLight.shadow.bias = -0.0001;
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 1.25);
    rimLight.position.set(-5, 6, -8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight('#ffffff', 0.5);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    // Pivot group that hosts all models and handles scrolling animations
    const pivot = new THREE.Group();
    pivot.name = 'car-pivot';
    scene.add(pivot);
    pivotRef.current = pivot;

    // Autonomous Scroll Listener
    const track = canvas.closest('.product-track-wrapper') || 
                  canvas.closest('.product-track') || 
                  document.querySelector('.product-track') || 
                  document.querySelector('.product-track-wrapper');
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
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      handleScroll();
    }

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      const asp = w / h;
      cameraRef.current.aspect = asp;

      const isCurrentHelmet = modelNameRef.current.includes('helmet') || modelNameRef.current.includes('schumacher') || modelNameRef.current.includes('norris');
      let dist = isCurrentHelmet ? 2.4 : 3.5;
      if (!isCurrentHelmet && asp < 1.6) {
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
          'lando-norris-helmet': Math.PI / 2,
          'schumacher-helmet': Math.PI / 2,
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
        window.removeEventListener('scroll', handleScroll, { capture: true } as any);
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

  // ─── 2. Background Model Preloading Effect ─────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    const pivot = pivotRef.current;
    if (!scene || !pivot) return;

    const urls: Record<string, string> = {
      mclaren: mclarenUrl || (modelName === 'mclaren' ? modelUrl : ''),
      redbull: redbullUrl || (modelName === 'redbull' ? modelUrl : ''),
      ferrari: ferrariUrl || (modelName === 'ferrari' ? modelUrl : ''),
      mercedes: mercedesUrl || (modelName === 'mercedes' ? modelUrl : ''),
      'lando-norris-helmet': norrisHelmetUrl || (modelName === 'lando-norris-helmet' ? modelUrl : ''),
      'schumacher-helmet': schumacherHelmetUrl || (modelName === 'schumacher-helmet' ? modelUrl : ''),
      'verstappen-helmet': verstappenHelmetUrl || (modelName === 'verstappen-helmet' ? modelUrl : ''),
    };

    const loader = new GLTFLoader();

    Object.entries(urls).forEach(([name, url]) => {
      if (!url || loadedModelsRef.current.has(name)) return;

      loader.load(
        url,
        (gltf) => {
          try {
            const model = gltf.scene;
            const isHelmet = name.includes('helmet') || name.includes('schumacher') || name.includes('norris');
            model.name = isHelmet ? `helmet-${name}` : `car-${name}`;

            model.traverse((node) => {
              if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                  mesh.material.envMapIntensity = isHelmet ? 2.0 : 1.5;
                  mesh.material.roughness = Math.max(mesh.material.roughness, 0.05);
                }
              }
            });

            // Autocenter and scale model
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
            const targetSize = isHelmet ? 1.7 : 3.2;
            const scaleFactor = targetSize / maxDim;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            model.position.x = -center.x * scaleFactor;
            model.position.y = -center.y * scaleFactor;
            model.position.z = -center.z * scaleFactor;
            
            // Adjust position offsets for perfect centering of helmets
            if (isHelmet) {
              model.position.y += 0.15;
            }

            pivot.add(model);
            loadedModelsRef.current.set(name, model);

            // Synchronize visibility instantly based on active model name ref
            model.visible = (modelNameRef.current === name);
            if (modelNameRef.current === name && onLoadProgressRef.current) {
              onLoadProgressRef.current(100);
            }
          } catch {
            setError('Scene parsing error: asset is structurally invalid.');
          }
        },
        undefined,
        () => {
          setError(`Failed to retrieve model asset.`);
        }
      );
    });
  }, [mclarenUrl, redbullUrl, ferrariUrl, mercedesUrl, norrisHelmetUrl, schumacherHelmetUrl, verstappenHelmetUrl]);

  // ─── 3. Instant Model Visibility & Snapping Rotation Effect ─────────────────
  useEffect(() => {
    const pivot = pivotRef.current;
    if (!pivot) return;

    const previousModelName = activeModelNameRef.current;
    activeModelNameRef.current = modelName;

    // Toggle preloaded model visibility instantly in memory
    loadedModelsRef.current.forEach((model, name) => {
      model.visible = (name === modelName);
    });

    if (onLoadProgressRef.current) {
      onLoadProgressRef.current(100);
    }

    // Dynamic Camera Distance Calibration
    if (cameraRef.current) {
      const isHelmet = modelName.includes('helmet') || modelName.includes('schumacher') || modelName.includes('norris');
      const aspect = cameraRef.current.aspect;
      let dist = isHelmet ? 2.4 : 3.5;
      if (!isHelmet && aspect < 1.6) {
        dist = 3.5 * (1.6 / aspect);
      }
      cameraRef.current.position.set(dist, 0, 0);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
    }

    // Instantly snap rotation to avoid visual lag when switching
    if (previousModelName !== modelName) {
      const TEAM_Y_ROTATIONS: Record<string, number> = {
        mclaren: Math.PI / 2,
        redbull: Math.PI / 2,
        ferrari: Math.PI / 2,
        mercedes: Math.PI / 2,
        'lando-norris-helmet': Math.PI / 2,
        'schumacher-helmet': Math.PI / 2,
      };
      const baseY = TEAM_Y_ROTATIONS[modelName] ?? Math.PI / 2;
      const sp = scrollProgressRef.current;
      const startY = baseY - Math.PI / 2;
      const endY   = baseY + 2 * Math.PI;
      const snapY  = startY + sp * (endY - startY);
      pivot.rotation.y = snapY;
      pivot.rotation.x = sp > 0 ? (sp - 0.5) * 0.04 : 0;
    }
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
