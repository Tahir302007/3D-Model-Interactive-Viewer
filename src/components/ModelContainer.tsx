import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Center, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { SceneSettings } from '../types';

interface ModelContainerProps {
  settings: SceneSettings;
  onSelectPart: (partName: string | null) => void;
}

// 3D Loading Loader placed inside the Canvas using Drei's Html helper
export function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md px-6 py-4 rounded-xl border border-gray-700 shadow-2xl min-w-40 text-center animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Outer spinner */}
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          {/* inner progress percent */}
          <span className="absolute font-mono text-xs text-emerald-400 font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-xs text-gray-300 mt-3 font-semibold tracking-wider uppercase">
          Loading 3D Model
        </p>
      </div>
    </Html>
  );
}

interface InnerModelProps {
  modelUrl: string;
  settings: SceneSettings;
  onSelectPart: (partName: string | null) => void;
}

function InnerModel({ modelUrl, settings, onSelectPart }: InnerModelProps) {
  const { scene } = useGLTF(modelUrl);
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [bounceScale, setBounceScale] = useState(1);

  // Clone the scene graph so that color overrides are instance-specific and do not taint the global cache
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    // Enable shadows on all child meshes
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, modelUrl]);

  // Handle continuous rotation inside the frame loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (settings.autoRotate) {
        groupRef.current.rotation.y += settings.rotationSpeed * delta;
      }
    }
  });

  // Smooth bounce animation on scale when clicked
  useEffect(() => {
    if (bounceScale > 1) {
      const timer = setTimeout(() => setBounceScale(1), 150);
      return () => clearTimeout(timer);
    }
  }, [bounceScale]);

  return (
    <group
      ref={groupRef}
      scale={[
        settings.modelScale * bounceScale,
        settings.modelScale * bounceScale,
        settings.modelScale * bounceScale,
      ]}
    >
      <Center>
        <primitive
          object={clonedScene}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            const name = e.object.name || 'Unnamed Mesh Part';
            setHoveredPart(name);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation();
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          onPointerDown={(e: any) => {
            e.stopPropagation();
            const mesh = e.object as THREE.Mesh;
            const partName = mesh.name || 'Unnamed Mesh Part';
            
            // Invoke the callback to notify parent
            onSelectPart(partName);
            
            // Trigger visual bounce scaling
            setBounceScale(1.1);

            // If color override is active, dynamically color the clicked mesh
            if (settings.useColorOverride && settings.colorOverride) {
              if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat: any) => {
                  if ('color' in mat) {
                    mat.color.set(settings.colorOverride);
                    mat.needsUpdate = true;
                  }
                });
              }
            }
          }}
        />
      </Center>

      {/* Floating 3D Tooltip/Label inside the 3D space above the model */}
      {hoveredPart && (
        <Html distanceFactor={6} position={[0, 1.2, 0]} center>
          <div className="bg-[#0D0D0D]/95 text-white border border-white/20 backdrop-blur-md px-3 py-1.5 rounded shadow-xl text-[10px] uppercase font-bold tracking-wider whitespace-nowrap font-mono pointer-events-none select-none transition-all scale-100 flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Mesh: <strong className="text-blue-400">{hoveredPart}</strong></span>
          </div>
        </Html>
      )}

      {/* Persistent floating label for selected part */}
      {settings.selectedPartName && !hoveredPart && (
        <Html distanceFactor={8} position={[0, -1.2, 0]} center>
          <div className="bg-[#0D0D0D]/90 text-white/70 border border-white/10 px-2.5 py-1 rounded shadow-md text-[9px] uppercase font-bold tracking-wider whitespace-nowrap font-mono">
            Selected: <strong className="text-blue-400">{settings.selectedPartName}</strong>
          </div>
        </Html>
      )}
    </group>
  );
}

// Preload standard model files so switches are snappy
try {
  useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb');
  useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb');
} catch (e) {
  console.log('Loader preload ignored outside of browser runtime');
}

export default function ModelContainer({ settings, onSelectPart }: ModelContainerProps) {
  const modelUrl = settings.modelId === 'custom' ? settings.customModelUrl : null;
  const selectedPreset = PRESET_MODELS.find(m => m.id === settings.modelId);
  const activeUrl = modelUrl || (selectedPreset ? selectedPreset.url : PRESET_MODELS[0].url);

  return (
    <React.Suspense fallback={<CanvasLoader />}>
      {activeUrl && (
        <InnerModel
          modelUrl={activeUrl}
          settings={settings}
          onSelectPart={onSelectPart}
        />
      )}
    </React.Suspense>
  );
}

// Inline constants import to avoid circular dependency
import { PRESET_MODELS } from '../types';
