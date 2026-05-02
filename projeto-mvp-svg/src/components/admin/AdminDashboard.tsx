import React, { useEffect, useState } from 'react';
import { useAdminStore, useAuthStore } from '@/src/store/useAdminStore';
import { 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  LayoutDashboard,
  Trophy,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { user, login, logout, initAuth, isLoggingIn } = useAuthStore();
  const { competitions, loading, subscribeCompetitions, createCompetition, deleteCompetition } = useAdminStore();
  
  const [newCompName, setNewCompName] = useState('');
  const [newCompDesc, setNewCompDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeView, setActiveView] = useState<'competitions' | 'judging'>('competitions');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeCompetitions();
      return () => unsubscribe();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
          <Settings size={40} />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2">Painel de Administração</h2>
        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed">
          Faça login com sua conta Google para gerenciar competições e configurações do sistema.
        </p>
        <button 
          id="admin-login-button"
          onClick={login}
          disabled={isLoggingIn}
          className={`flex items-center gap-3 px-8 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          ) : (
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          )}
          {isLoggingIn ? 'Autenticando...' : 'Entrar com Google'}
        </button>
        <button 
          onClick={onBack}
          className="mt-6 text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Voltar para o Editor
        </button>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName) return;
    await createCompetition(newCompName, newCompDesc);
    setNewCompName('');
    setNewCompDesc('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50/50 dark:bg-[#050505] overflow-hidden">
      {/* Header */}
      <header className="px-8 py-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between bg-white dark:bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">Admin Maker</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Sistema de Julgamento Ativo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mr-4">
            <button 
              onClick={() => setActiveView('competitions')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'competitions' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-neutral-400'}`}
            >
              Competições
            </button>
            <button 
              onClick={() => setActiveView('judging')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'judging' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-neutral-400'}`}
            >
              Julgamento
            </button>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold">{user.displayName || 'Usuário'}</span>
            <span className="text-[10px] text-neutral-400">{user.email}</span>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeView === 'competitions' ? (
            <motion.div 
              key="competitions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Stats Summary */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Competições', val: competitions.length, icon: Trophy, color: 'text-yellow-500' },
                  { label: 'Participantes', val: '0', icon: Users, color: 'text-blue-500' },
                  { label: 'Julgamentos', val: '0', icon: CheckCircle2, color: 'text-green-500' }
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-3xl flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</div>
                      <div className="text-2xl font-black">{stat.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Competitions List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black tracking-tight">Competições Recentes</h2>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={16} />
                    Nova Competição
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {isAdding && (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onSubmit={handleAdd}
                      className="glass p-8 rounded-3xl border-2 border-primary/20 space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Nome do Concurso</label>
                        <input 
                          autoFocus
                          type="text"
                          value={newCompName}
                          onChange={e => setNewCompName(e.target.value)}
                          placeholder="Ex: Melhor Blob Orgânico 2026"
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Descrição / Regras</label>
                        <textarea 
                          value={newCompDesc}
                          onChange={e => setNewCompDesc(e.target.value)}
                          placeholder="Descreva os critérios de avaliação..."
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px]"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button 
                          type="button"
                          onClick={() => setIsAdding(false)}
                          className="px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          Criar Agora
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {loading ? (
                  <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : competitions.length === 0 ? (
                  <div className="glass p-20 rounded-[3rem] text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <Filter size={32} />
                    </div>
                    <h3 className="font-bold mb-2">Nenhuma competição ativa</h3>
                    <p className="text-neutral-500 text-sm">Crie seu primeiro concurso clicando no botão acima.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {competitions.map((comp) => (
                      <motion.div 
                        layout
                        key={comp.id}
                        className="glass p-6 rounded-3xl hover:border-primary/20 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-600">
                              <Trophy size={20} />
                            </div>
                            <div>
                              <h3 className="font-black text-lg">{comp.name}</h3>
                              <p className="text-sm text-neutral-500 line-clamp-1">{comp.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                  <Calendar size={12} />
                                  {new Date(comp.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500">
                                  <CheckCircle2 size={12} />
                                  {comp.status === 'active' ? 'Ativa' : 'Encerrada'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteCompetition(comp.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Config */}
              <div className="space-y-6">
                <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-[#474bff] to-[#6d28d9] text-white">
                  <h3 className="text-xl font-black tracking-tight mb-2">Configurações Rápidas</h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">Defina os parâmetros globais do sistema de julgamento.</p>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Voto Público', checked: true },
                      { label: 'Comentários', checked: false },
                      { label: 'Limite de Envio', checked: true },
                      { label: 'Auto-Aprovação', checked: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${item.checked ? 'bg-white' : 'bg-white/20'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-transform ${item.checked ? 'translate-x-5 bg-[#474bff]' : 'translate-x-1 bg-white'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Atividade Recente</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                        <div className="text-xs">
                          <span className="font-bold">Admin</span> criou <span className="font-bold">Concurso #{i}</span>
                          <div className="text-[10px] text-neutral-400">há {i * 10} minutos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="judging"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="glass p-8 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Fila de Julgamento</h2>
                    <p className="text-neutral-500 text-sm">Avalie os blobs submetidos para as competições ativas.</p>
                  </div>
                </div>

                <div className="p-20 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem]">
                   <Users size={48} className="mx-auto text-neutral-200 mb-4" />
                   <h3 className="text-lg font-bold mb-2">Nenhuma submissão pendente</h3>
                   <p className="text-neutral-500 max-w-xs mx-auto text-sm">As submissões dos usuários aparecerão aqui assim que as competições começarem.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
