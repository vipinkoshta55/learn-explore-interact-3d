
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ModelViewerProps {
  modelUrl?: string;
  modelType?: "gltf" | "obj" | "fbx";
  className?: string;
}

const ModelViewer = ({ 
  modelUrl, 
  modelType = "gltf", 
  className 
}: ModelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const animationMixerRef = useRef<THREE.AnimationMixer>();
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const modelRef = useRef<THREE.Object3D>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAnimations, setHasAnimations] = useState(false);
  
  // Setup scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 1, 5);
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update animations
      if (animationMixerRef.current && isPlaying) {
        const delta = clockRef.current.getDelta();
        animationMixerRef.current.update(delta);
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Load model when URL changes
  useEffect(() => {
    if (!modelUrl || !sceneRef.current) {
      setError("No model URL provided");
      setIsLoading(false);
      return;
    }
    
    const loadModel = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Clear any existing model
        if (modelRef.current && sceneRef.current) {
          sceneRef.current.remove(modelRef.current);
        }
        
        // Reset animation mixer
        animationMixerRef.current = undefined;
        
        // Load model based on type
        if (modelType === "gltf") {
          const loader = new GLTFLoader();
          loader.load(
            modelUrl,
            (gltf) => {
              const model = gltf.scene;
              
              // Set up model
              model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                }
              });
              
              // Add model to scene
              sceneRef.current?.add(model);
              modelRef.current = model;
              
              // Center model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              model.position.sub(center);
              
              // Set up animations
              if (gltf.animations.length > 0) {
                setHasAnimations(true);
                animationMixerRef.current = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                  animationMixerRef.current?.clipAction(clip).play();
                });
                
                // Pause animations initially
                animationMixerRef.current.timeScale = 0;
              } else {
                setHasAnimations(false);
              }
              
              setIsLoading(false);
            },
            (xhr) => {
              // Loading progress
            },
            (error) => {
              // Fix: Ensure error has a message property or use a default string
              const errorMessage = error instanceof Error ? error.message : String(error);
              setError(`Error loading model: ${errorMessage}`);
              setIsLoading(false);
            }
          );
        } else if (modelType === "obj") {
          const loader = new OBJLoader();
          loader.load(
            modelUrl,
            (obj) => {
              // Set up model
              obj.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                }
              });
              
              // Add model to scene
              sceneRef.current?.add(obj);
              modelRef.current = obj;
              
              // Center model
              const box = new THREE.Box3().setFromObject(obj);
              const center = box.getCenter(new THREE.Vector3());
              obj.position.sub(center);
              
              setIsLoading(false);
              setHasAnimations(false);
            },
            (xhr) => {
              // Loading progress
            },
            (error) => {
              // Fix: Ensure error has a message property or use a default string
              const errorMessage = error instanceof Error ? error.message : String(error);
              setError(`Error loading model: ${errorMessage}`);
              setIsLoading(false);
            }
          );
        } else {
          setError(`Unsupported model type: ${modelType}`);
          setIsLoading(false);
        }
      } catch (err) {
        // Fix: Safely handle the error by converting it to a string
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Error loading model: ${errorMessage}`);
        setIsLoading(false);
      }
    };
    
    loadModel();
  }, [modelUrl, modelType]);
  
  // Animation controls
  const toggleAnimation = () => {
    if (!animationMixerRef.current || !hasAnimations) return;
    
    if (isPlaying) {
      animationMixerRef.current.timeScale = 0;
    } else {
      animationMixerRef.current.timeScale = 1;
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const resetView = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    
    cameraRef.current.position.set(0, 1, 5);
    controlsRef.current.reset();
  };
  
  const zoomIn = () => {
    if (!cameraRef.current) return;
    
    cameraRef.current.position.z -= 0.5;
  };
  
  const zoomOut = () => {
    if (!cameraRef.current) return;
    
    cameraRef.current.position.z += 0.5;
  };
  
  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-0 overflow-hidden">
        <div>
          <div 
            ref={mountRef} 
            className="w-full h-[400px] relative bg-gray-50"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-white p-4 rounded-md shadow-md max-w-xs">
                  <p className="text-red-500">{error}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center gap-2 p-2 bg-muted/50">
            <div className="flex items-center gap-1">
              {hasAnimations && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={toggleAnimation}
                  disabled={isLoading || !!error}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={resetView}
                disabled={isLoading || !!error}
              >
                <RotateCcw size={18} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={zoomIn}
                disabled={isLoading || !!error}
              >
                <ZoomIn size={18} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={zoomOut}
                disabled={isLoading || !!error}
              >
                <ZoomOut size={18} />
              </Button>
            </div>
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={toggleFullscreen}
              disabled={isLoading || !!error}
            >
              <Maximize2 size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelViewer;
