import React, { useState, useMemo } from 'react';
import { Sidebar } from '../editor/Sidebar';
import { Canvas } from '../editor/Canvas';
import { History } from '../editor/History';
import { AdminDashboard } from '../admin/AdminDashboard';
import { useBlobStore } from '@/src/store/useBlobStore';
import { generateBlobPoints, pointsToPath, generateVariations } from '@/src/lib/blob-math';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ProLayout() {
  const [view, setView] = useState<'editor' | 'admin'>('editor');
  const [showVariations, setShowVariations] = useState(false);
  const [exportModal, setExportModal] = useState<'react' | 'css' | 'json' | 'svg' | 'png' | null>(null);
  const { 
    complexity, contrast, color, seed, isAnimated, 
    currentPoints, currentPath,
    saveToHistory, saveDesign, setComplexity, setContrast, randomize,
    accessibility, isDark 
  } = useBlobStore();

  const handleSaveToHistory = () => {
    const shape = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Blob ${Math.floor(Date.now() / 1000)}`,
      complexity,
      contrast,
      color,
      seed,
      path: currentPath,
      points: currentPoints,
      isAnimated,
      isFavorite: false,
      tags: [],
      createdAt: Date.now()
    };
    saveToHistory(shape);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#474bff', '#9f47ff', '#ffffff']
    });
  };

  const handleSaveDesign = () => {
    const name = prompt("Dê um nome ao seu design:", `Design ${new Date().toLocaleDateString()}`);
    if (!name) return;

    saveDesign({
      id: Math.random().toString(36).substr(2, 9),
      name,
      complexity,
      contrast,
      color,
      seed,
      path: currentPath,
      points: currentPoints,
      isAnimated,
      isFavorite: true,
      tags: ['Personalizado'],
      createdAt: Date.now()
    });

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: [color, '#ffffff']
    });
  };

  const exportJSON = () => {
    const data = {
      name: "Blob Config",
      complexity,
      contrast,
      color,
      seed,
      path: currentPath,
      points: currentPoints,
      isAnimated
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blob-config-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    // We use a temporary canvas to render the SVG path and save as PNG
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const path = new Path2D(currentPath);
    // Scale currentPath (400x400) to 800x800
    ctx.scale(2, 2);
    ctx.fillStyle = color;
    ctx.fill(path);

    const link = document.createElement('a');
    link.download = `blob-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    confetti({ particleCount: 50, spread: 60 });
  };

  const cssCode = `
.blob {
  width: 400px;
  height: 400px;
  background-color: ${color};
  clip-path: path('${currentPath}');
}
  `.trim();

  const variations = useMemo(() => generateVariations(complexity, contrast, seed), [complexity, contrast, seed, showVariations]);

  const reactComponentCode = `
import React from 'react';

export const MyBlob = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <path 
      fill="${color}" 
      d="${currentPath}" 
    />
  </svg>
);
  `.trim();

  const handleExport = (type: any) => {
    if (type === 'json') exportJSON();
    else if (type === 'png') exportPNG();
    else if (type === 'svg') {
       const svg = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="${currentPath}" /></svg>`;
       const blob = new Blob([svg], { type: 'image/svg+xml' });
       const url = URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.href = url;
       link.download = `blob-${Date.now()}.svg`;
       link.click();
    }
    else {
      setExportModal(type);
    }
  };

  const getFontSizeClass = () => {
    if (accessibility.fontSize === 'sm') return 'text-[90%]';
    if (accessibility.fontSize === 'lg') return 'text-[110%]';
    return '';
  };

  return (
    <div className={`${isDark ? 'dark' : ''} ${accessibility.highContrast ? 'high-contrast' : ''} ${getFontSizeClass()}`}>
      <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-500 relative">
        {view === 'admin' ? (
          <AdminDashboard onBack={() => setView('editor')} />
        ) : (
          <>
            <Sidebar 
              onSave={handleSaveDesign} 
              onExport={handleExport}
              onOpenAdmin={() => setView('admin')}
            />
            
            <div className="flex-1 flex flex-col min-w-0 relative">
          <Canvas />
          
          {/* Smart AI Suggestions Bar */}
          <div className="absolute top-8 right-32 z-20">
             <button 
               onClick={() => setShowVariations(!showVariations)}
               className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs font-black uppercase tracking-widest text-[#474bff] group"
             >
               <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
               Gerar Variações IA
             </button>
          </div>

          <AnimatePresence>
            {showVariations && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute top-24 right-8 w-64 glass rounded-[2.5rem] p-6 space-y-4 z-40 border border-[#474bff]/10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Variações Inteligentes</h3>
                  <button onClick={() => setShowVariations(false)}><X size={14} className="text-neutral-300 hover:text-red-500" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {variations.map((v, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setComplexity(v.complexity);
                        setContrast(v.contrast);
                        // Using v.seed implicitly triggers randomize logic in a simplified way here
                      }}
                      className="aspect-square bg-white dark:bg-neutral-800 rounded-2xl p-2 border border-neutral-100 dark:border-neutral-700 hover:border-[#474bff] transition-all group overflow-hidden"
                    >
                      <svg viewBox="0 0 400 400" className="w-full h-full group-hover:scale-110 transition-transform">
                        <path fill={color} d={pointsToPath(generateBlobPoints(v.complexity, v.contrast, v.seed))} />
                      </svg>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <History />
        </div>
          </>
        )}

          {/* Modal: Export Code */}
        <AnimatePresence>
           {exportModal && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[3rem] p-10 shadow-2xl relative"
                >
                  <button onClick={() => setExportModal(null)} className="absolute top-8 right-8 text-neutral-400"><X size={24} /></button>
                  <h2 className="text-2xl font-black tracking-tighter italic mb-2 uppercase">EXPORTAR {exportModal}</h2>
                  <p className="text-sm text-neutral-400 mb-8 font-medium">Pronto para integrar no seu projeto.</p>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-3xl p-6 relative group overflow-hidden border border-neutral-100 dark:border-neutral-700">
                    <pre className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 overflow-x-auto">
                      {exportModal === 'react' ? reactComponentCode : cssCode}
                    </pre>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(exportModal === 'react' ? reactComponentCode : cssCode);
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
                      }}
                      className="absolute top-4 right-4 p-3 bg-white dark:bg-neutral-700 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-600 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Copy size={16} className="text-[#474bff]" />
                    </button>
                  </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>

        {/* Floating Decorative Elements */}
        <div className="fixed -top-20 -right-20 w-80 h-80 bg-[#474bff]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-[#9f47ff]/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
}
