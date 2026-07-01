import React, { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

interface ModelUploaderProps {
  onUploadSuccess: (url: string, name: string) => void;
  active: boolean;
}

export default function ModelUploader({ onUploadSuccess, active }: ModelUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      setError('Unsupported format! Please upload a valid .glb or .gltf binary model.');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setFileName(file.name);
      onUploadSuccess(url, file.name);
    } catch (err) {
      console.error(err);
      setError('Failed to process file. Try another model.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-2.5">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".glb,.gltf"
        onChange={handleChange}
      />
      
      <div
        id="drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : active 
              ? 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10' 
              : 'border-white/10 bg-black/40 hover:bg-white/5'
        }`}
      >
        <div className={`p-2.5 rounded-lg mb-2 ${
          fileName ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/40'
        }`}>
          {fileName ? (
            <FileCheck className="w-5 h-5 animate-pulse" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <p className="text-xs font-semibold text-white/80">
          {fileName ? 'Model Pipeline Ready' : 'Import Custom 3D Asset'}
        </p>
        
        <p className="text-[10px] text-white/40 mt-1 max-w-[200px] leading-relaxed">
          {fileName 
            ? `Source: ${fileName}`
            : 'Drag & drop a standard GLB or GLTF file here, or click to browse.'
          }
        </p>

        {error && (
          <div className="mt-2.5 flex items-start gap-1 bg-rose-500/15 border border-rose-500/30 p-2 rounded-lg text-[9px] text-rose-300 leading-normal animate-fade-in text-left">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
