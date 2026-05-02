import React, { useState } from 'react';
import { useBlobStore, BlobShape } from '@/src/store/useBlobStore';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, History as HistoryIcon, Heart, Sparkles, Loader2 } from 'lucide-react';
import { brainstormBlobName } from '@/src/services/geminiService';

export function History() {
  const { history, removeFromHistory, toggleFavorite, favorites, updateName, setCurrentShape } = useBlobStore();
  const [namingId, setNamingId] = useState<string | null>(null);

  const handleRenameAI = async (shape: BlobShape) => {
    setNamingId(shape.id);
    const newName = await brainstormBlobName(shape.color, shape.complexity);
    updateName(shape.id, newName);
    setNamingId(null);
  };

  if (history.length === 0 && favorites.length === 0) return null;

  return (
    <div className="w-full bg-white/50 dark:bg-black/20 backdrop-blur-3xl border-t border-neutral-100 dark:border-neutral-800 p-6 z-40">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <HistoryIcon size={14} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Sua Galeria (Local)</h2>
          </div>
          <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-600 uppercase tracking-widest">
            {history.length} Projetos
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          <AnimatePresence mode="popLayout">
            {history.map((shape) => {
              const isFav = favorites.some(f => f.id === shape.id);
              return (
                <motion.div
                  key={shape.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group shrink-0"
                >
                  <div 
                    onClick={() => setCurrentShape(shape)}
                    className="w-28 h-28 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 p-3 flex flex-col items-center justify-center hover:border-[#474bff] hover:shadow-xl hover:shadow-[#474bff]/5 transition-all cursor-pointer overflow-hidden"
                  >
                    <svg viewBox="0 0 400 400" className="w-full h-full mb-1">
                      <path fill={shape.color} d={shape.path} />
                    </svg>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-neutral-400 truncate w-full text-center">
                      {shape.name || 'Untitled'}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeFromHistory(shape.id)}
                      className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      <Trash2 size={10} />
                    </button>
                    <button 
                      onClick={() => toggleFavorite(shape.id)}
                      className={`p-1.5 rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-white dark:bg-neutral-700 text-neutral-400'
                      }`}
                    >
                      <Heart size={10} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => handleRenameAI(shape)}
                      disabled={namingId === shape.id}
                      className="p-1.5 bg-indigo-500 text-white rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {namingId === shape.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
