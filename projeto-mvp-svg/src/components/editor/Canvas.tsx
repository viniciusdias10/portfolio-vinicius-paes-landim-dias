import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateBlobPoints, pointsToPath, Point } from '@/src/lib/blob-math';
import { useBlobStore } from '@/src/store/useBlobStore';
import { Copy, Download, Check, Plus, Minus, Move } from 'lucide-react';

export function Canvas() {
  const { 
    complexity, contrast, color, seed, isAnimated, editMode,
    currentPoints, currentPath, setCurrentPoints, setCurrentPath,
    keyframes, isPlaying, playbackSpeed, accessibility, isDark
  } = useBlobStore();

  const animationPaths = useMemo(() => {
    // Normalization Factor: 128 segments provide absolute fidelity to the original curves
    const segments = 128; 
    if (keyframes.length < 2) return [pointsToPath(currentPoints, segments)];
    
    const normalized = keyframes.map(k => pointsToPath(k.shape.points, segments));
    return [...normalized, normalized[0]]; // Close loop
  }, [keyframes, currentPoints]);

  const totalDuration = useMemo(() => {
    const base = keyframes.reduce((acc, k) => acc + k.duration, 0) / 1000;
    return (base || 2) * (1 / playbackSpeed);
  }, [keyframes, playbackSpeed]);

  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  // Sync manual points when in auto mode or when params change
  useEffect(() => {
    if (editMode === 'auto') {
      setCurrentPoints(generateBlobPoints(complexity, contrast, seed));
    }
  }, [complexity, contrast, seed, editMode, setCurrentPoints]);

  useEffect(() => {
    // Synchronize to 128 segments for ultra-high-definition blobs
    setCurrentPath(pointsToPath(currentPoints, 128));
  }, [currentPoints, setCurrentPath]);

  const handlePointDrag = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (isDragging !== index) return;
    
    const svg = (e.currentTarget as any).closest('svg');
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Convert client coordinates to SVG coordinates
    const x = ((clientX - rect.left) / rect.width) * 400;
    const y = ((clientY - rect.top) / rect.height) * 400;

    const newPoints = [...currentPoints];
    newPoints[index] = { ...newPoints[index], x, y };
    setCurrentPoints(newPoints);
  };

  const addPoint = () => {
    if (currentPoints.length >= 30) return;
    const newPoints = [...currentPoints];
    const last = newPoints[newPoints.length - 1];
    const first = newPoints[0];
    newPoints.push({ x: (last.x + first.x) / 2, y: (last.y + first.y) / 2 });
    setCurrentPoints(newPoints);
  };

  const removePoint = (index: number) => {
    if (currentPoints.length <= 3) return;
    setCurrentPoints(currentPoints.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = e.shiftKey ? 10 : 2;
    const newPoints = [...currentPoints];
    const p = newPoints[index];

    switch(e.key) {
      case 'ArrowUp': p.y -= step; break;
      case 'ArrowDown': p.y += step; break;
      case 'ArrowLeft': p.x -= step; break;
      case 'ArrowRight': p.x += step; break;
      case 'Delete': 
      case 'Backspace': removePoint(index); break;
      default: return;
    }
    
    e.preventDefault();
    setCurrentPoints(newPoints);
  };

  const svgCode = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="${currentPath}" />
</svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blob-ultra-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-12 overflow-hidden">
      {/* Canvas Container */}
      <div className="w-full h-full max-w-5xl max-h-[800px] glass rounded-[3rem] relative flex items-center justify-center animate-in fade-in zoom-in duration-700 overflow-hidden shadow-2xl">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#474bff 2.5px, transparent 2.5px)', backgroundSize: '40px 40px' }} />

        {/* Edit Toolbar Overlay */}
        <AnimatePresence>
          {editMode === 'manual' && !isPlaying && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xl z-30"
            >
              <button 
                onClick={addPoint}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-[#474bff]"
              >
                <Plus size={14} />
                Add Ponto
              </button>
              <div className="w-px h-6 bg-neutral-100 dark:bg-neutral-800 mt-1" />
              <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Esculpir Ativo
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          viewBox="0 0 400 400"
          className="w-[85%] h-[85%] drop-shadow-[0_45px_100px_rgba(0,0,0,0.12)] relative z-10 transition-all select-none"
          onMouseMove={(e) => isDragging !== null && handlePointDrag(e, isDragging)}
          onTouchMove={(e) => isDragging !== null && handlePointDrag(e, isDragging)}
          onMouseUp={() => setIsDragging(null)}
          onMouseLeave={() => setIsDragging(null)}
          onTouchEnd={() => setIsDragging(null)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              d: isPlaying && keyframes.length >= 2 ? animationPaths : currentPath
            }}
            transition={{
              d: isPlaying ? {
                duration: accessibility.reducedMotion ? 0 : totalDuration,
                repeat: Infinity,
                ease: "easeInOut",
                times: keyframes.length > 1 ? undefined : [0, 1]
              } : { 
                duration: accessibility.reducedMotion ? 0 : 1.2,
                ease: [0.22, 1, 0.36, 1]
              },
              opacity: { duration: accessibility.reducedMotion ? 0 : 0.8 }
            }}
            fill={color}
            className={`${isAnimated && !isPlaying && !accessibility.reducedMotion ? 'animate-blob-float' : ''} transition-[fill] duration-700`}
            style={{ transformOrigin: 'center' }}
          />

          {/* Point Handles (Interactive Anchors) - Only show when NOT playing */}
          <AnimatePresence>
            {editMode === 'manual' && !isPlaying && currentPoints.map((p, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: accessibility.reducedMotion ? 0 : i * 0.05 }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={15}
                  fill="transparent"
                  className="cursor-move outline-none"
                  tabIndex={0}
                  onMouseDown={() => setIsDragging(i)}
                  onTouchStart={() => setIsDragging(i)}
                  onDoubleClick={() => removePoint(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  aria-label={`Ponto de controle ${i + 1}`}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4.5}
                  fill="white"
                  stroke={accessibility.highContrast ? (isDark ? 'white' : 'black') : color}
                  strokeWidth={2.5}
                  pointerEvents="none"
                  className={`transition-all shadow-lg ${isDragging === i ? 'scale-150' : ''}`}
                />
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>

        {/* Global Action Floating Box */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
           <button 
             onClick={handleCopy}
             className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 shadow-2xl hover:scale-105 active:scale-95 transition-all text-neutral-500 hover:text-[#474bff] group"
           >
             {copied ? <Check className="text-green-500" size={24} /> : <Copy className="group-hover:rotate-12 transition-transform" size={24} />}
           </button>
           <button 
             onClick={handleDownload}
             className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#474bff] text-white shadow-2xl shadow-[#474bff]/40 hover:scale-105 active:scale-95 transition-all group"
           >
             <Download className="group-hover:translate-y-0.5 transition-transform" size={24} />
           </button>
        </div>
      </div>
    </div>
  );
}
