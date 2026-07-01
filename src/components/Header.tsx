import React from 'react';
import { Cpu, HelpCircle, GraduationCap } from 'lucide-react';
import { SceneSettings, PRESET_MODELS } from '../types';

interface HeaderProps {
  settings: SceneSettings;
}

export default function Header({ settings }: HeaderProps) {
  const activePreset = PRESET_MODELS.find(m => m.id === settings.modelId);
  const modelLabel = settings.modelId === 'custom' 
    ? (settings.customModelName || 'Custom Local GLB') 
    : (activePreset?.name || 'Rubber Duck');

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0D0D0D] shrink-0">
      <div className="flex items-center gap-4">
        {/* Blue 3D square badge from Design HTML */}
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-sm tracking-tighter text-white">
          3D
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] text-white/90 uppercase">
            3D LAB // INTERACTIVE VIEWPORT
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            Module 04
          </span>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6 items-center text-xs text-white/50 uppercase tracking-[0.15em]">
        {/* Dynamic status badges in premium dark layout */}
        <div className="hidden lg:flex items-center gap-2 bg-black border border-white/5 px-2.5 py-1 rounded text-[10px] text-white/60">
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          <span>RENDERER: WEBGL_2.0</span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-black border border-white/5 px-2.5 py-1 rounded text-[10px] text-white/60">
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          <span>ACTIVE: <strong className="text-white/80">{modelLabel}</strong></span>
        </div>

        {/* Quick Tutorial Help Overlay */}
        <div className="relative group">
          <button className="p-1.5 bg-black hover:bg-white/5 text-white/60 hover:text-white rounded border border-white/10 cursor-pointer transition-colors flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {/* Tooltip on hover */}
          <div className="absolute right-0 top-10 w-64 bg-[#0D0D0D] text-white/80 border border-white/15 rounded p-4 shadow-2xl z-50 text-[11px] leading-relaxed opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-right">
            <p className="font-bold text-white mb-2 tracking-wider flex items-center gap-1 uppercase text-[10px] text-blue-400">
              ⚡ Lab Controls Tutorial
            </p>
            <ul className="space-y-1.5 text-white/60 list-disc list-inside">
              <li>Drag <strong>left click</strong> to orbit.</li>
              <li>Hover individual parts to read component structure.</li>
              <li>Toggle <strong>Paint on Click</strong> to dynamically color component surfaces.</li>
              <li>Upload individual <strong>.glb</strong> or <strong>.gltf</strong> files to test rendering pipelines.</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
