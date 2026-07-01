import React, { useState } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ThreeCanvas from './components/ThreeCanvas';
import LearningPanel from './components/LearningPanel';
import { SceneSettings } from './types';

const INITIAL_SETTINGS: SceneSettings = {
  modelId: 'duck',
  customModelUrl: null,
  customModelName: null,
  autoRotate: true,
  rotationSpeed: 0.5,
  ambientIntensity: 0.7,
  directionalIntensity: 1.5,
  lightColor: '#ffffff',
  backgroundColor: '#0a0a0a', // Sophisticated Dark absolute background
  showGrid: true,
  showAxes: false,
  modelScale: 1.5,
  colorOverride: '#2563eb', // Sophisticated blue override
  useColorOverride: false,
  selectedPartName: null
};

export default function App() {
  const [settings, setSettings] = useState<SceneSettings>(INITIAL_SETTINGS);
  const [canvasKey, setCanvasKey] = useState(0);

  const handleUpdateSettings = (newSettings: Partial<SceneSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const handleResetCamera = () => {
    // Increment the key to force Canvas unmount and fresh mounting with default camera positions
    setCanvasKey((prev) => prev + 1);
  };

  const handleSelectPart = (partName: string | null) => {
    setSettings((prev) => ({
      ...prev,
      selectedPartName: partName,
    }));
  };

  const handleClearSelectedPart = () => {
    setSettings((prev) => ({
      ...prev,
      selectedPartName: null,
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] font-sans text-white flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Dynamic Header */}
      <Header settings={settings} />

      {/* Main Workspace Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Side: Control Panel (Customizer Options) */}
        <ControlPanel
          settings={settings}
          onChangeSettings={handleUpdateSettings}
          onResetCamera={handleResetCamera}
          onClearSelectedPart={handleClearSelectedPart}
        />

        {/* Right Side: Interactive Scene Viewport & Learning Documentation */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 3D Canvas Viewport Container */}
          <div className="w-full h-[320px] sm:h-[420px] md:h-[480px] shrink-0">
            <ThreeCanvas
              settings={settings}
              onSelectPart={handleSelectPart}
              canvasKey={canvasKey}
            />
          </div>

          {/* Interactive Educational Documentation Panel */}
          <LearningPanel settings={settings} />
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="w-full bg-[#0D0D0D] border-t border-white/10 py-3.5 text-center text-[11px] text-white/50 font-mono tracking-wide shrink-0">
        WebGL Rendering powered by <span className="text-white">Three.js</span> • React wrapper courtesy of <span className="text-white">React Three Fiber</span> & <span className="text-white">Drei</span>
      </footer>
    </div>
  );
}
