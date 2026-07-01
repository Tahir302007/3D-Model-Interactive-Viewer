import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { SceneSettings } from '../types';
import ModelContainer from './ModelContainer';

interface ThreeCanvasProps {
  settings: SceneSettings;
  onSelectPart: (partName: string | null) => void;
  canvasKey: number; // Incrementing this key will reset the canvas/camera state instantly
}

export default function ThreeCanvas({ settings, onSelectPart, canvasKey }: ThreeCanvasProps) {
  return (
    <div 
      className="w-full h-full relative overflow-hidden rounded-2xl border border-white/10 shadow-inner"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <Canvas
        key={canvasKey}
        shadows
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Set background color dynamically inside Three.js */}
        <color attach="background" args={[settings.backgroundColor]} />

        {/* Dynamic Lights */}
        <ambientLight 
          intensity={settings.ambientIntensity} 
          color={settings.lightColor} 
        />
        
        <directionalLight
          castShadow
          position={[4, 8, 4]}
          intensity={settings.directionalIntensity}
          color={settings.lightColor}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Subtle rim light for better definition */}
        <pointLight position={[-4, 2, -4]} intensity={0.5} color="#cbd5e1" />

        {/* Main loaded model container */}
        <ModelContainer settings={settings} onSelectPart={onSelectPart} />

        {/* Orbit Controls for Rotation, Panning, and Zooming */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.8} // Prevent going too far under the floor
          minDistance={1.5}
          maxDistance={12}
        />

        {/* Optional Coordinate System Helpers */}
        {settings.showGrid && (
          <gridHelper 
            args={[30, 30, '#2563eb', '#1e293b']} 
            position={[0, -1, 0]} 
          />
        )}
        
        {settings.showAxes && (
          <axesHelper 
            args={[4]} 
            position={[0, -0.99, 0]} 
          />
        )}
      </Canvas>

      {/* Floating prompt hints inside the viewport */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none px-2 select-none">
        <div className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] text-white/50 uppercase tracking-wider font-semibold shadow-md">
          🖱️ <span className="text-white">Left Click + Drag</span> to rotate • <span className="text-white">Scroll</span> to zoom • <span className="text-white">Right Click</span> to pan
        </div>
        <div className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] text-blue-400 font-mono font-bold tracking-wider shadow-md flex items-center gap-1.5 uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Viewport Active
        </div>
      </div>
    </div>
  );
}
