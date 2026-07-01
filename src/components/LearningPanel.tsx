import React, { useState } from 'react';
import { BookOpen, Code, Lightbulb, Box, HelpCircle } from 'lucide-react';
import { SceneSettings, PRESET_MODELS } from '../types';

interface LearningPanelProps {
  settings: SceneSettings;
}

type TabType = 'basics' | 'gltf' | 'lighting' | 'interactions';

export default function LearningPanel({ settings }: LearningPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basics');

  const selectedModelPreset = PRESET_MODELS.find(m => m.id === settings.modelId);
  const modelUrlString = settings.modelId === 'custom' 
    ? (settings.customModelName || 'custom-model.glb')
    : selectedModelPreset?.url || 'duck.glb';

  // Live-updating code generators based on user settings
  const codeSnippets = {
    basics: `import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Scene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas 
        shadows 
        camera={{ position: [0, 1.5, 4], fov: 45 }}
      >
        {/* Set background color attachment */}
        <color attach="background" args={['${settings.backgroundColor}']} />

        {/* OrbitControls enables rotate/pan/zoom */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={1.5}
          maxDistance={12}
        />
        
        {/* Your 3D models and lights go here */}
      </Canvas>
    </div>
  );
}`,
    gltf: `import React, { Suspense } from 'react';
import { useGLTF, Center, Html, useProgress } from '@react-three/drei';

// Loader indicator for Suspense
function Loader() {
  const { progress } = useProgress();
  return <Html center>{Math.round(progress)}% loaded</Html>;
}

function Model() {
  // Load .glb binary asset file (Drei helper)
  const { scene } = useGLTF('${modelUrlString.substring(0, 50)}...');

  return (
    <group scale={[${settings.modelScale.toFixed(2)}, ${settings.modelScale.toFixed(2)}, ${settings.modelScale.toFixed(2)}]}>
      <Center> {/* Automatically centers model at origin */}
        <primitive object={scene} castShadow receiveShadow />
      </Center>
    </group>
  );
}

export default function SceneWithModel() {
  return (
    <Suspense fallback={<Loader />}>
      <Model />
    </Suspense>
  );
}`,
    lighting: `<Canvas shadows>
  {/* Ambient Light illuminates all objects equally */}
  <ambientLight 
    intensity={${settings.ambientIntensity.toFixed(1)}} 
    color="${settings.lightColor}" 
  />

  {/* Directional Light mimics sunlight and casts shadows */}
  <directionalLight
    castShadow
    position={[4, 8, 4]}
    intensity={${settings.directionalIntensity.toFixed(1)}}
    color="${settings.lightColor}"
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
  />

  {/* Developer helpers configured in active viewport */}
  ${settings.showGrid ? `<gridHelper args={[30, 30, '#2563eb', '#1e293b']} position={[0, -1, 0]} />` : '// Grid helper disabled'}
  ${settings.showAxes ? `<axesHelper args={[4]} position={[0, -0.99, 0]} />` : '// Axes helper disabled'}
</Canvas>`,
    interactions: `import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function InteractiveMesh({ settings }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // useFrame hooks into the continuous animation clock loop
  useFrame((state, delta) => {
    if (${settings.autoRotate}) {
      // Rotates object on the Y axis in radians per second
      meshRef.current.rotation.y += ${settings.rotationSpeed.toFixed(2)} * delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      // Click pointer events bubble in React Three Fiber
      onPointerDown={(e) => {
        e.stopPropagation();
        console.log("Clicked part name:", e.object.name);
        ${settings.useColorOverride ? `// Recolor clicked mesh
        if (e.object.material) {
          e.object.material.color.set('${settings.colorOverride}');
        }` : '// Custom coloring disabled'}
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer'; // Dynamic cursor feedback
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    />
  );
}`
  };

  return (
    <div className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Lab Sandbox // Concept & Code Playground</h2>
        </div>
        <span className="text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
          React Three Fiber
        </span>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/5 p-1 bg-black/40 rounded-xl">
        <button
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'basics' 
              ? 'bg-blue-600/10 text-white border border-blue-500/30 shadow-md' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          1. Canvas
        </button>
        <button
          onClick={() => setActiveTab('gltf')}
          className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'gltf' 
              ? 'bg-blue-600/10 text-white border border-blue-500/30 shadow-md' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          2. Models
        </button>
        <button
          onClick={() => setActiveTab('lighting')}
          className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'lighting' 
              ? 'bg-blue-600/10 text-white border border-blue-500/30 shadow-md' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          3. Lighting
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'interactions' 
              ? 'bg-blue-600/10 text-white border border-blue-500/30 shadow-md' 
              : 'text-white/40 hover:text-white'
          }`}
        >
          4. Loops
        </button>
      </div>

      {/* Tab Contents: Explanations + Code Snippet */}
      <div className="flex-1 flex flex-col gap-4 min-h-[350px]">
        {/* Conceptual Explanations Card */}
        <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2.5">
          {activeTab === 'basics' && (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                What is the Canvas component?
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                The <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">{'<Canvas />'}</code> component from <code className="text-blue-300 font-mono text-[11px]">@react-three/fiber</code> acts as our gateway to WebGL. It handles setting up a 3D renderer, standard cameras, lighting bounds, and resizes fluidly with its HTML parent wrapper to guarantee layout responsiveness.
              </p>
              <div className="text-[10px] text-white/40 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Canvas container uses a relative, full-size class layout (100% width and height).
              </div>
            </>
          )}

          {activeTab === 'gltf' && (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                <Box className="w-4 h-4 text-blue-400" />
                How are 3D assets loaded?
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                We load industry-standard <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">.glb</code> or <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">.gltf</code> models using the React hook <code className="text-blue-400 font-mono text-[11px]">useGLTF</code> from <code className="text-blue-400 font-mono text-[11px]">@react-three/drei</code>. It automatically cache-mounts assets and feeds Three's loader. We wrap loading elements inside standard React <code className="text-blue-300 font-mono text-[11px]">{'<Suspense>'}</code> gates to handle async download state with elegant loading indicators.
              </p>
              <div className="text-[10px] text-white/40 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Center, Scale, and Normal Maps are pre-calculated for precise mesh bounds.
              </div>
            </>
          )}

          {activeTab === 'lighting' && (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                How does lighting work?
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                3D scenes require lights to be visible. <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">{'<ambientLight />'}</code> acts as environment scatter light (casts no shadows, non-directional), while <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">{'<directionalLight />'}</code> projects rays from infinity mimicking the sun. To get shadows, enable <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">shadows</code> on the Canvas and <code className="text-blue-300 font-mono text-[11px] bg-black px-1 py-0.5 rounded">castShadow</code> on the lights.
              </p>
              <div className="text-[10px] text-white/40 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Active values: Ambient Intensity ({settings.ambientIntensity.toFixed(1)}) • Directional ({settings.directionalIntensity.toFixed(1)})
              </div>
            </>
          )}

          {activeTab === 'interactions' && (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                <Code className="w-4 h-4 text-blue-400" />
                What are frame loops and events?
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                To animate continuously (like our rotation), we run the <code className="text-blue-400 font-mono text-[11px]">useFrame</code> hook. It triggers 60+ times per second outside React render cycles. Standard pointer listeners (hover, click) are injected directly into mesh nodes, using Three's Raycaster behind the scenes to track click intersections.
              </p>
              <div className="text-[10px] text-white/40 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Active values: Spin ({settings.autoRotate ? 'On' : 'Off'}) • Rotation Rads ({settings.rotationSpeed.toFixed(1)}/s)
              </div>
            </>
          )}
        </div>

        {/* Live-updating Code Snippet */}
        <div className="flex-1 flex flex-col bg-black border border-white/10 rounded-xl overflow-hidden relative group">
          <div className="bg-[#0D0D0D] px-4 py-2 border-b border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono font-medium uppercase tracking-wider">
            <span>React Components • Live Generated</span>
            <span className="text-blue-400 font-bold animate-pulse">● Live Synced</span>
          </div>
          
          <div className="flex-1 overflow-auto max-h-[350px] p-4 text-[11px] font-mono leading-relaxed text-white/80 scrollbar-thin">
            <pre className="whitespace-pre">
              {codeSnippets[activeTab]}
            </pre>
          </div>

          {/* Copy prompt button or informative hint */}
          <div className="absolute right-3 bottom-3 bg-black/90 text-[10px] text-white/40 border border-white/10 px-2 py-1 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-bold">
            Adjust sliders to see code update
          </div>
        </div>
      </div>
    </div>
  );
}
