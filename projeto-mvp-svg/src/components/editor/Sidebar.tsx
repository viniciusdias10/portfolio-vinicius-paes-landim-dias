import React, { useState } from 'react';
import { useBlobStore } from '@/src/store/useBlobStore';
import { useAuthStore } from '@/src/store/useAdminStore';
import { auth } from '@/src/lib/firebase';
import { 
  Settings2, 
  Settings,
  Palette, 
  Layers, 
  Activity, 
  Dices, 
  Save,
  Moon,
  Sun,
  Video,
  Library as LibraryIcon,
  Download,
  Code,
  MousePointer2,
  Sparkles,
  Search,
  Heart,
  Play,
  Square,
  Trash2,
  ChevronRight,
  Clock,
  Wand2,
  Database,
  Type,
  Eye,
  Glasses,
  LogIn,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import confetti from 'canvas-confetti';

const Slider = ({ label, value, min, max, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
        {label}
      </label>
      <span className="text-xs font-mono font-bold text-[#474bff]">
        {value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-[#474bff] transition-all"
    />
  </div>
);

export function Sidebar({ onSave, onExport, onOpenAdmin }: any) {
  const { user, login, logout, isLoggingIn } = useAuthStore();
  const { 
    complexity, contrast, color, seed, isAnimated, editMode,
    currentPoints, currentPath,
    setComplexity, setContrast, setColor, setAnimated, randomize, setEditMode,
    history, favorites, keyframes, addKeyframe, removeKeyframe, clearKeyframes,
    isPlaying, playbackSpeed, setPlaying, setPlaybackSpeed,
    savedDesigns, saveDesign, removeSavedDesign, generateAutoDesign,
    accessibility, setAccessibility, setCurrentShape, isDark, setDark
  } = useBlobStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'animation' | 'library' | 'export' | 'settings'>('editor');
  const [search, setSearch] = useState('');

  const handleAutoDesign = () => {
    generateAutoDesign();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: [color, '#ffffff', '#9f47ff']
    });
  };

  const handleAddKeyframe = () => {
    addKeyframe({
      id: Math.random().toString(36).substr(2, 9),
      name: `Frame ${keyframes.length + 1}`,
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
    });
    
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { x: 0.15, y: 0.5 },
      colors: [color, '#ffffff']
    });
  };

  const handleTogglePlayback = () => {
    if (keyframes.length < 2) return;
    setPlaying(!isPlaying);
  };

  const tabs = [
    { id: 'editor', icon: Settings2, label: 'Editor' },
    { id: 'animation', icon: Video, label: 'Animar' },
    { id: 'library', icon: LibraryIcon, label: 'Projetos' },
    { id: 'export', icon: Code, label: 'Exportar' },
    { id: 'settings', icon: Glasses, label: 'Acesso' },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-full lg:w-[400px] glass h-full flex flex-col z-50 backdrop-blur-3xl overflow-hidden border-r border-white/10"
    >
      {/* Sidebar Header */}
      <div className="p-8 pb-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#474bff] to-[#9f47ff] flex items-center justify-center text-white shadow-lg shadow-[#474bff]/20">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none italic">MAKER ULTRA</h1>
              <span className="text-[10px] font-bold text-[#474bff] uppercase tracking-widest">Plataforma de Design</span>
            </div>
          </div>
          <button 
            onClick={() => setDark(!isDark)}
            className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-100 dark:border-neutral-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Auth Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#474bff] flex items-center justify-center text-white text-[10px] font-black uppercase">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-tight truncate max-w-[120px]">{user.displayName || 'Usuário'}</span>
                    <span className="text-[8px] text-neutral-400 truncate max-w-[120px]">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    console.log("Logout clicado");
                    logout();
                  }}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
            <button 
              id="sidebar-google-login-button"
              onClick={() => {
                console.log("Botão de login clicado!");
                login();
              }}
              disabled={isLoggingIn}
              className={`flex items-center justify-center gap-3 w-full py-2 bg-[#474bff] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#474bff]/20 hover:scale-[1.02] active:scale-[0.98] transition-all ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoggingIn ? (
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? 'Entrando...' : 'Entrar com Google'}
            </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-8 py-4 flex gap-2 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-[#474bff] text-white shadow-lg shadow-[#474bff]/20' 
                : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Magic Generator */}
              {!accessibility.cleanInterface && (
                <section className="space-y-4">
                  <button 
                    onClick={handleAutoDesign}
                    className="w-full relative group overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#474bff] to-[#9f47ff] text-white shadow-xl shadow-[#474bff]/20 hover:scale-[1.02] transition-all"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Sparkles size={60} /></div>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center"><Wand2 size={24} /></div>
                      <div className="text-left">
                        <h3 className="text-sm font-black uppercase tracking-widest">Gerador Mágico</h3>
                        <p className="text-[10px] font-bold text-white/70">Criação inteligente de design</p>
                      </div>
                    </div>
                  </button>
                </section>
              )}

              {/* Mode Switcher */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MousePointer2 size={14} />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Modo de Edição</h2>
                </div>
                <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <button 
                    onClick={() => setEditMode('auto')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${editMode === 'auto' ? 'bg-white dark:bg-neutral-700 shadow-sm text-[#474bff]' : 'text-neutral-400'}`}
                  >
                    Automático
                  </button>
                  <button 
                    onClick={() => setEditMode('manual')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${editMode === 'manual' ? 'bg-white dark:bg-neutral-700 shadow-sm text-[#474bff]' : 'text-neutral-400'}`}
                  >
                    Manual
                  </button>
                </div>
              </section>

              {editMode === 'auto' ? (
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  <Slider label="Complexidade" value={complexity} min={3} max={20} onChange={setComplexity} />
                  <Slider label="Contraste" value={contrast} min={0} max={10} onChange={setContrast} />
                </section>
              ) : (
                <div className="p-6 bg-[#474bff]/5 rounded-3xl border border-[#474bff]/20 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-xs font-bold text-[#474bff]">Modo de Edição Ativo</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Arraste os pontos diretamente no canvas para esculpir sua forma. Use <kbd className="bg-white px-1 rounded border">Ctrl</kbd> para suavizar curvas.
                  </p>
                </div>
              )}

              <section className="space-y-6">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Palette size={14} />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Estética & Cores</h2>
                </div>
                <div className="space-y-5">
                   <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Hex Code</span>
                        <span className="text-sm font-mono font-bold text-neutral-600 dark:text-neutral-300 uppercase">{color}</span>
                      </div>
                   </div>
                   
                   <label className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 cursor-pointer hover:border-[#474bff]/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Flutuação Natural</span>
                        <span className="text-[10px] text-neutral-400 font-medium tracking-tight">Efeito de flutuação orgânica constante</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isAnimated} 
                        onChange={(e) => setAnimated(e.target.checked)}
                        className="w-10 h-5 bg-neutral-200 rounded-full appearance-none relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:bg-[#474bff] checked:before:left-5 before:transition-all cursor-pointer"
                      />
                   </label>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'animation' && (
            <motion.div 
              key="animation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="p-6 bg-[#474bff]/5 rounded-3xl border border-[#474bff]/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#474bff] text-white rounded-lg"><Sparkles size={16} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#474bff]">Sistema Morphing</h3>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Adicione frames para criar transições fluidas entre diferentes blobs. É necessário pelo menos 2 frames.
                </p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddKeyframe}
                    disabled={isPlaying}
                    className="flex-1 py-3 bg-[#474bff] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#474bff]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Add Frame
                  </button>
                  <button 
                    onClick={handleTogglePlayback}
                    disabled={keyframes.length < 2}
                    className={`px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center ${
                      isPlaying 
                        ? 'bg-red-500 text-white shadow-red-500/20' 
                        : 'bg-green-500 text-white shadow-green-500/20 hover:scale-105'
                    } disabled:opacity-50`}
                  >
                    {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>
                </div>
              </div>

              {keyframes.length > 0 && (
                <div className="space-y-6">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Timeline</h4>
                       <button onClick={clearKeyframes} className="text-[9px] font-bold text-red-500 uppercase">Limpar Tudo</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                      {keyframes.map((kf, i) => (
                        <motion.div 
                          key={kf.id} 
                          layout
                          className="w-20 shrink-0 group space-y-2"
                        >
                          <div className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-transparent hover:border-[#474bff] p-2 flex items-center justify-center relative transition-all">
                            <svg viewBox="0 0 400 400" className="w-full h-full">
                              <path fill={color} d={kf.shape.path}/>
                            </svg>
                            <button 
                              onClick={() => removeKeyframe(kf.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                            >
                              <Trash2 size={10} />
                            </button>
                            <span className="absolute bottom-1 right-1 text-[8px] font-bold text-neutral-400">{i+1}</span>
                          </div>
                          <div className="flex items-center gap-1 justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Clock size={8} />
                            <span className="text-[8px] font-mono">1.0s</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Activity size={14} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Controle de Velocidade</h4>
                    </div>
                    <div className="flex gap-2">
                      {[0.5, 1, 2, 4].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                            playbackSpeed === speed 
                              ? 'bg-[#474bff] text-white border-[#474bff]' 
                              : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div 
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl ${accessibility.fontSize === 'lg' ? 'text-sm' : 'text-[11px]'} border border-neutral-100 dark:border-neutral-700 focus:border-[#474bff] outline-none transition-all`}
                />
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Designs Salvos</h4>
                    <span className="text-[10px] text-[#474bff] font-bold">{savedDesigns.length} itens</span>
                  </div>
                  {savedDesigns.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2rem] text-center">
                      <Database size={24} className="mx-auto text-neutral-200 mb-2" />
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Nenhum design salvo</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {savedDesigns.map(design => (
                        <div key={design.id} className="group relative p-4 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 hover:border-[#474bff] transition-all">
                          <div 
                            onClick={() => setCurrentShape(design)}
                            className="aspect-square mb-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center p-4 cursor-pointer"
                          >
                            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
                              <path fill={design.color} d={design.path} />
                            </svg>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black truncate">{design.name}</span>
                            <button onClick={() => removeSavedDesign(design.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Recentes</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {history.slice(0, 8).map(shape => (
                      <div 
                        key={shape.id} 
                        onClick={() => setCurrentShape(shape)}
                        className="aspect-square rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-2 flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-100 dark:border-neutral-800"
                      >
                        <svg viewBox="0 0 400 400"><path fill={shape.color} d={shape.path}/></svg>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div 
              key="export"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Integrações de Código</h4>
                <div className="grid gap-3">
                  <button 
                    onClick={() => onExport('react')}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-[#474bff] group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg group-hover:scale-110 transition-transform"><Code size={16} /></div>
                      <span className="text-xs font-bold">React Component</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#474bff]">Copiar</span>
                  </button>

                  <button 
                    onClick={() => onExport('css')}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-[#474bff] group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-lg group-hover:scale-110 transition-transform"><Palette size={16} /></div>
                      <span className="text-xs font-bold">Tailwind & CSS</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#474bff]">Copiar</span>
                  </button>

                  <button 
                    onClick={() => onExport('json')}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-[#474bff] group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg group-hover:scale-110 transition-transform"><Database size={16} /></div>
                      <span className="text-xs font-bold">Configuração JSON</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#474bff]">Baixar</span>
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Arquivos</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onExport('svg')} className="p-6 bg-[#474bff] text-white rounded-3xl flex flex-col items-center gap-3 shadow-xl shadow-[#474bff]/20 hover:scale-[1.02] transition-all">
                    <Download size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">SVG</span>
                  </button>
                  <button onClick={() => onExport('png')} className="p-6 bg-neutral-900 dark:bg-neutral-700 text-white rounded-3xl flex flex-col items-center gap-3 shadow-xl transition-all">
                    <Eye size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">PNG</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Glasses size={14} />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Acessibilidade</h2>
                </div>
                
                <div className="space-y-4">
                  {/* High Contrast */}
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-bold">Alto Contraste</span>
                    <input 
                      type="checkbox" 
                      checked={accessibility.highContrast} 
                      onChange={(e) => setAccessibility({ highContrast: e.target.checked })}
                      className="w-10 h-5 bg-neutral-200 rounded-full appearance-none relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:bg-[#474bff] checked:before:left-5 before:transition-all cursor-pointer"
                    />
                  </div>

                  {/* Font Size */}
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-4">
                    <div className="flex items-center gap-2"><Type size={14} /><span className="text-xs font-bold">Tamanho da Fonte</span></div>
                    <div className="flex gap-2">
                       {['sm', 'base', 'lg'].map(size => (
                         <button 
                           key={size}
                           onClick={() => setAccessibility({ fontSize: size as any })}
                           className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${accessibility.fontSize === size ? 'bg-[#474bff] text-white border-[#474bff]' : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700'}`}
                         >
                           {size.toUpperCase()}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Clean UI */}
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <div>
                      <span className="text-xs font-bold block">Interface Limpa</span>
                      <span className="text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Sem distrações</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={accessibility.cleanInterface} 
                      onChange={(e) => setAccessibility({ cleanInterface: e.target.checked })}
                      className="w-10 h-5 bg-neutral-200 rounded-full appearance-none relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:bg-[#474bff] checked:before:left-5 before:transition-all cursor-pointer"
                    />
                  </div>

                   {/* Reduced Motion */}
                   <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-bold font-sans">Reduzir Movimento</span>
                    <input 
                      type="checkbox" 
                      checked={accessibility.reducedMotion} 
                      onChange={(e) => setAccessibility({ reducedMotion: e.target.checked })}
                      className="w-10 h-5 bg-neutral-200 rounded-full appearance-none relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:bg-[#474bff] checked:before:left-5 before:transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-4">
        <button 
          onClick={randomize}
          className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
        >
          <Dices size={16} />
          {editMode === 'auto' ? 'Gerar Aleatório' : 'Resetar Manual'}
        </button>
        <button 
          onClick={onSave}
          className="w-full flex items-center justify-center gap-3 p-4 bg-[#474bff]/5 text-[#474bff] border border-[#474bff]/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#474bff]/10 transition-all"
        >
          <Save size={16} />
          Salvar Design
        </button>
        <button 
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          <Settings size={14} />
          Painel Administrador
        </button>
      </div>
    </motion.aside>
  );
}
