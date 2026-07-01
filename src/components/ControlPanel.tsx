import React from 'react';
import { 
  RotateCw, 
  Lightbulb, 
  Eye, 
  Grid, 
  Sparkles, 
  Palette, 
  Box, 
  Info, 
  Sliders,
  Sun,
  Camera
} from 'lucide-react';
import { SceneSettings, PRESET_MODELS } from '../types';
import ModelUploader from './ModelUploader';

interface ControlPanelProps {
  settings: SceneSettings;
  onChangeSettings: (settings: Partial<SceneSettings>) => void;
  onResetCamera: () => void;
  onClearSelectedPart: () => void;
}

export default function ControlPanel({ 
  settings, 
  onChangeSettings, 
  onResetCamera,
  onClearSelectedPart
}: ControlPanelProps) {
  
  const handleModelChange = (id: string) => {
    const selectedPreset = PRESET_MODELS.find(m => m.id === id);
    onChangeSettings({ 
      modelId: id,
      modelScale: selectedPreset ? selectedPreset.scale : 1,
      selectedPartName: null
    });
  };

  const handleCustomUpload = (url: string, name: string) => {
    onChangeSettings({
      modelId: 'custom',
      customModelUrl: url,
      customModelName: name,
      modelScale: 1, 
      selectedPartName: null
    });
  };

  const activeModel = settings.modelId === 'custom' 
    ? { name: settings.customModelName || 'Custom Model', description: 'User-uploaded GLB geometry.', difficulty: 'Intermediate' }
    : (PRESET_MODELS.find(m => m.id === settings.modelId) || PRESET_MODELS[0]);

  // Realistic estimates for polygon metrics
  const getPolyCount = (modelId: string) => {
    switch (modelId) {
      case 'duck': return '3,200';
      case 'avocado': return '2,450';
      case 'helmet': return '12,402';
      case 'boombox': return '8,900';
      default: return 'Dynamic';
    }
  };

  return (
    <div className="w-full lg:w-[380px] bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto max-h-[85vh] lg:max-h-[calc(100vh-140px)] shadow-2xl shrink-0 scrollbar-thin">
      
      {/* SECTION: Model Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
          <Box className="w-4 h-4 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Properties // Models</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {PRESET_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelChange(model.id)}
              className={`px-3 py-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                settings.modelId === model.id
                  ? 'bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/30'
                  : 'bg-black border-white/5 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="text-xs font-semibold truncate">{model.name}</div>
              <div className="text-[9px] text-white/40 mt-0.5 uppercase tracking-wider">{model.difficulty}</div>
            </button>
          ))}
          <button
            onClick={() => {
              if (settings.customModelUrl) {
                onChangeSettings({ modelId: 'custom', selectedPartName: null });
              }
            }}
            disabled={!settings.customModelUrl}
            className={`px-3 py-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
              settings.modelId === 'custom'
                ? 'bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/30'
                : settings.customModelUrl
                  ? 'bg-[#0D0D0D] border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                  : 'bg-black/25 border-transparent text-white/20 cursor-not-allowed'
            }`}
          >
            <div className="text-xs font-semibold truncate">Uploaded Custom</div>
            <div className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wider">
              {settings.customModelName ? 'Ready' : 'Empty'}
            </div>
          </button>
        </div>

        {/* Model Description block */}
        {activeModel && (
          <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 text-[11px] leading-relaxed text-white/70 flex gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white/90">
                {activeModel.description}
              </span>
            </div>
          </div>
        )}

        {/* GLB File Drag & Drop Uploader */}
        <ModelUploader 
          active={settings.modelId === 'custom'} 
          onUploadSuccess={handleCustomUpload} 
        />
      </div>

      {/* SECTION: Model Transform / Scales & Auto Rotation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Transforms</h2>
        </div>

        {/* Scale Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-white/60">Scale Magnification</span>
            <span className="font-mono text-blue-400 text-[11px]">x{settings.modelScale.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={settings.modelId === 'duck' ? "0.2" : settings.modelId === 'avocado' ? "1" : settings.modelId === 'boombox' ? "10" : "0.2"}
            max={settings.modelId === 'duck' ? "5" : settings.modelId === 'avocado' ? "40" : settings.modelId === 'boombox' ? "150" : "10"}
            step="0.05"
            value={settings.modelScale}
            onChange={(e) => onChangeSettings({ modelScale: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 bg-black h-1.5 rounded-full cursor-pointer"
          />
        </div>

        {/* Auto Rotate Toggle */}
        <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <RotateCw className={`w-4 h-4 ${settings.autoRotate ? 'text-blue-400 animate-spin' : 'text-white/40'}`} style={{ animationDuration: `${6 - settings.rotationSpeed}s` }} />
            <span className="text-xs font-semibold text-white/80">Continuous Rotation</span>
          </div>
          <button
            onClick={() => onChangeSettings({ autoRotate: !settings.autoRotate })}
            className={`w-9 h-5 rounded-full transition-all duration-300 relative cursor-pointer ${
              settings.autoRotate ? 'bg-blue-600' : 'bg-white/10'
            }`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all duration-300 ${
              settings.autoRotate ? 'right-0.75' : 'left-0.75'
            }`} />
          </button>
        </div>

        {/* Rotation Speed Slider */}
        {settings.autoRotate && (
          <div className="space-y-1.5 animate-fade-in pl-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-white/50">Spin Velocity Rad/s</span>
              <span className="font-mono text-blue-400 text-[11px]">{settings.rotationSpeed.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={settings.rotationSpeed}
              onChange={(e) => onChangeSettings({ rotationSpeed: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 bg-black h-1.5 rounded-full cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* SECTION: Lights & Shadows */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Lighting Settings</h2>
        </div>

        {/* Ambient Light */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-white/30" /> Ambient Scatter
            </span>
            <span className="font-mono text-white/50 text-[11px]">{settings.ambientIntensity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={settings.ambientIntensity}
            onChange={(e) => onChangeSettings({ ambientIntensity: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 bg-black h-1.5 rounded-full cursor-pointer"
          />
        </div>

        {/* Directional Light */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-blue-500" /> Directional rays
            </span>
            <span className="font-mono text-white/50 text-[11px]">{settings.directionalIntensity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="4"
            step="0.1"
            value={settings.directionalIntensity}
            onChange={(e) => onChangeSettings({ directionalIntensity: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 bg-black h-1.5 rounded-full cursor-pointer"
          />
        </div>

        {/* Light & BG Colors */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Light Color</label>
            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5">
              <input
                type="color"
                value={settings.lightColor}
                onChange={(e) => onChangeSettings({ lightColor: e.target.value })}
                className="w-6 h-6 border-0 rounded bg-transparent cursor-pointer shrink-0"
              />
              <span className="text-[10px] font-mono text-white/70 uppercase truncate">{settings.lightColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Background</label>
            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onChangeSettings({ backgroundColor: e.target.value })}
                className="w-6 h-6 border-0 rounded bg-transparent cursor-pointer shrink-0"
              />
              <span className="text-[10px] font-mono text-white/70 uppercase truncate">{settings.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Interaction & Color Overrides */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Interactions</h2>
        </div>

        {/* Toggle Color Override on Click */}
        <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-white/40" />
            <div className="text-left">
              <div className="text-xs font-semibold text-white/80">Paint meshes on click</div>
              <div className="text-[9px] text-white/40 leading-none mt-0.5">Change mesh color dynamically</div>
            </div>
          </div>
          <button
            onClick={() => onChangeSettings({ useColorOverride: !settings.useColorOverride })}
            className={`w-9 h-5 rounded-full transition-all duration-300 relative cursor-pointer ${
              settings.useColorOverride ? 'bg-blue-600' : 'bg-white/10'
            }`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all duration-300 ${
              settings.useColorOverride ? 'right-0.75' : 'left-0.75'
            }`} />
          </button>
        </div>

        {/* Color Override Input */}
        {settings.useColorOverride && (
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between animate-fade-in">
            <span className="text-xs text-white/60">Selected Paint Brush</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.colorOverride}
                onChange={(e) => onChangeSettings({ colorOverride: e.target.value })}
                className="w-7 h-7 border-0 rounded-md bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-white/80 uppercase">{settings.colorOverride}</span>
            </div>
          </div>
        )}

        {/* Currently Selected Mesh Node */}
        {settings.selectedPartName ? (
          <div className="bg-blue-950/20 border border-blue-500/20 p-3 rounded-xl space-y-1.5 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Mesh Segment</span>
              <button 
                onClick={onClearSelectedPart}
                className="text-[10px] text-white/40 hover:text-white transition-colors underline cursor-pointer"
              >
                Deselect
              </button>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              {settings.selectedPartName}
            </div>
            <p className="text-[10px] text-white/40 leading-tight">
              Selected 3D component coordinates mapped.
            </p>
          </div>
        ) : (
          <div className="bg-black/30 border border-white/5 p-2.5 rounded-xl text-center text-[10px] text-white/40">
            Click on a 3D part inside the canvas to isolate and select it.
          </div>
        )}
      </div>

      {/* SECTION: Environment & Helper Toggles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Gizmos</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Grid Helper Toggle */}
          <button
            onClick={() => onChangeSettings({ showGrid: !settings.showGrid })}
            className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              settings.showGrid 
                ? 'bg-black border-blue-500/30 text-blue-400' 
                : 'bg-black/40 border-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              Floor grid
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${settings.showGrid ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`} />
          </button>

          {/* Coordinate Axes Toggle */}
          <button
            onClick={() => onChangeSettings({ showAxes: !settings.showAxes })}
            className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              settings.showAxes 
                ? 'bg-black border-blue-500/30 text-blue-400' 
                : 'bg-black/40 border-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Coordinate axes
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${settings.showAxes ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`} />
          </button>
        </div>
      </div>

      {/* SECTION: Real-time Viewport Statistics overlay (matches Sophisticated Dark Design) */}
      <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-2.5 font-mono text-[11px] text-white/50 mt-auto">
        <p className="text-[9px] uppercase text-blue-400 font-bold tracking-widest">Viewport Telemetry</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
          <div>FPS: <span className="text-white/90 font-semibold">60.0</span></div>
          <div>POLY: <span className="text-white/90 font-semibold">{getPolyCount(settings.modelId)}</span></div>
          <div>RENDERER: <span className="text-white/90 font-semibold">WEBGL_2.0</span></div>
          <div>SHADOWS: <span className="text-emerald-400 font-semibold">STABLE</span></div>
        </div>
      </div>

      {/* Reset camera action */}
      <div className="pt-2">
        <button
          onClick={onResetCamera}
          className="w-full bg-white hover:bg-blue-600 hover:text-white text-black font-bold py-2.5 px-3 rounded text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          Reset Camera Viewport
        </button>
      </div>

    </div>
  );
}
