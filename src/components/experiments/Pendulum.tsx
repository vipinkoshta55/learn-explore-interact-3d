
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Pendulum = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [length, setLength] = useState(2);
  const [gravity, setGravity] = useState(9.8);
  const [initialAngle, setInitialAngle] = useState(Math.PI / 4);
  
  // Animation refs
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const bobRef = useRef<THREE.Mesh>();
  const stringRef = useRef<THREE.Line>();
  const angleRef = useRef<number>(Math.PI / 4);
  const angularVelocityRef = useRef<number>(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (rendererRef.current) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Setup scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Add pivot point (fixed)
    const pivotGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const pivotMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
    const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
    pivot.position.set(0, 2, 0);
    scene.add(pivot);

    // Add pendulum bob
    const bobGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bobMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    const bob = new THREE.Mesh(bobGeometry, bobMaterial);
    bobRef.current = bob;
    scene.add(bob);

    // Add string line
    const stringMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const stringGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const string = new THREE.Line(stringGeometry, stringMaterial);
    stringRef.current = string;
    scene.add(string);

    // Update pendulum position
    updatePendulumPosition();

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
    };
  }, []);

  // Update the position of the pendulum based on current angle
  const updatePendulumPosition = () => {
    if (!bobRef.current || !stringRef.current) return;
    
    const x = length * Math.sin(angleRef.current);
    const y = -length * Math.cos(angleRef.current);
    
    // Update bob position
    bobRef.current.position.set(x, y + 2, 0);
    
    // Update string geometry
    const points = [
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(x, y + 2, 0),
    ];
    
    stringRef.current.geometry.dispose();
    stringRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
  };

  // Animation update
  const animate = (time: number) => {
    if (!previousTimeRef.current) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }
    
    const deltaTime = Math.min((time - previousTimeRef.current) / 1000, 0.1);
    previousTimeRef.current = time;
    
    if (isSimulationRunning) {
      // Physics update
      const angularAcceleration = -(gravity / length) * Math.sin(angleRef.current);
      angularVelocityRef.current += angularAcceleration * deltaTime;
      angleRef.current += angularVelocityRef.current * deltaTime;
      
      // Apply damping
      angularVelocityRef.current *= 0.995;
      
      updatePendulumPosition();
    }
    
    rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Start/stop simulation
  useEffect(() => {
    if (isSimulationRunning && !requestRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
        previousTimeRef.current = undefined;
      }
    };
  }, [isSimulationRunning]);
  
  // Reset pendulum
  const resetPendulum = () => {
    angleRef.current = initialAngle;
    angularVelocityRef.current = 0;
    updatePendulumPosition();
    setIsSimulationRunning(false);
  };
  
  // Update pendulum length
  useEffect(() => {
    updatePendulumPosition();
  }, [length]);
  
  // Update initial angle
  useEffect(() => {
    if (!isSimulationRunning) {
      angleRef.current = initialAngle;
      updatePendulumPosition();
    }
  }, [initialAngle, isSimulationRunning]);

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="h-[400px] w-full rounded-lg bg-gray-50 dark:bg-gray-900 shadow-inner overflow-hidden"></div>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="length-slider">Length (m): {length.toFixed(1)}</Label>
            </div>
            <Slider
              id="length-slider"
              min={0.5}
              max={3.0}
              step={0.1}
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              disabled={isSimulationRunning}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="gravity-slider">Gravity (m/s²): {gravity.toFixed(1)}</Label>
            </div>
            <Slider
              id="gravity-slider"
              min={1.0}
              max={20.0}
              step={0.1}
              value={[gravity]}
              onValueChange={([value]) => setGravity(value)}
              disabled={isSimulationRunning}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="angle-slider">Initial Angle (°): {(initialAngle * 180 / Math.PI).toFixed(0)}</Label>
            </div>
            <Slider
              id="angle-slider"
              min={0}
              max={Math.PI / 2}
              step={0.01}
              value={[initialAngle]}
              onValueChange={([value]) => setInitialAngle(value)}
              disabled={isSimulationRunning}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className="flex-1"
            >
              {isSimulationRunning ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" onClick={resetPendulum} className="flex-1">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pendulum;
