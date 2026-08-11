'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Eye, AlertTriangle, Plus, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import type { CategoriaRadar } from '@/lib/types';

const categoriaConfig: Record<CategoriaRadar, { label: string; emoji: string; color: string; borderColor: string; bgColor: string; icon: React.ReactNode }> = {
  explodindo: { label: 'Explodindo', emoji: '🔥', color: 'text-red', borderColor: 'border-red/30', bgColor: 'bg-red/10', icon: <AlertTriangle size={16} /> },
  crescendo: { label: 'Crescendo', emoji: '📈', color: 'text-orange', borderColor: 'border-orange/30', bgColor: 'bg-orange/10', icon: <TrendingUp size={16} /> },
  monitorar: { label: 'Monitorar', emoji: '👁️', color: 'text-cyan', borderColor: 'border-cyan/30', bgColor: 'bg-cyan/10', icon: <Eye size={16} /> },
  estavel: { label: 'Estavel', emoji: '✅', color: 'text-green', borderColor: 'border-green/30', bgColor: 'bg-green/10', icon: <TrendingUp size={16} /> },
  esfriando: { label: 'Esfriando', emoji: '❄️', color: 'text-text-muted', borderColor: 'border-border', bgColor: 'bg-surface', icon: <Eye size={16} /> },
};

const categoriaOrder: CategoriaRadar[] = ['explodindo', 'crescendo', 'monitorar', 'estavel', 'esfriando'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function RadarPage() {
  const { radarItems, addRadarItem } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newAssunto, setNewAssunto] = useState('');
  const [newCategoria, setNewCategoria] = useState<CategoriaRadar>('monitorar');
  const [newTags, setNewTags] = useState('');

  function handleAdd() {
    if (!newAssunto.trim()) return;
    addRadarItem({
      assunto: newAssunto.trim(),
      categoria: newCategoria,
      tags: newTags ? newTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    setNewAssunto('');
    setNewCategoria('monitorar');
    setNewTags('');
    setShowForm(false);
  }

  const grouped = categoriaOrder.map((cat) => ({
    categoria: cat,
    config: categoriaConfig[cat],
    items: radarItems.filter((r) => r.categoria === cat),
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">RADAR DE PAUTAS</h1>
          <p className="text-text-muted text-sm mt-1">Monitoramento de Tendencias</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
        >
          <Plus size={14} /> Adicionar ao Radar
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-5 gap-2 lg:gap-3">
        {grouped.map((g) => (
          <div key={g.categoria} className={`bg-surface border ${g.config.borderColor} rounded-lg p-3 text-center`}>
            <div className="text-lg mb-1">{g.config.emoji}</div>
            <div className={`font-stat text-xl font-bold ${g.config.color}`}>{g.items.length}</div>
            <div className="font-ui text-[8px] tracking-[1px] uppercase text-text-muted mt-0.5">{g.config.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-purple/20 rounded-lg p-5 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-cyan">Adicionar ao Radar</h3>
                <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                    Assunto *
                  </label>
                  <input
                    value={newAssunto}
                    onChange={(e) => setNewAssunto(e.target.value)}
                    placeholder="Qual o assunto em alta?"
                    className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                      Categoria
                    </label>
                    <select
                      value={newCategoria}
                      onChange={(e) => setNewCategoria(e.target.value as CategoriaRadar)}
                      className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple transition-all"
                    >
                      {categoriaOrder.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoriaConfig[cat].emoji} {categoriaConfig[cat].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                      Tags (separar por virgula)
                    </label>
                    <input
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="futebol, brasileirao..."
                      className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
                  >
                    Salvar no Radar
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-md bg-surface border border-border-strong text-text-secondary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {grouped.map((g) => (
        <motion.div key={g.categoria} variants={item}>
          {/* Category header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-md ${g.config.bgColor} flex items-center justify-center`}>
              <span className="text-base">{g.config.emoji}</span>
            </div>
            <h2 className={`font-ui text-[12px] font-bold tracking-wider uppercase ${g.config.color}`}>
              {g.config.label}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className={`font-stat text-sm font-bold ${g.config.color}`}>{g.items.length}</span>
          </div>

          {/* Items */}
          {g.items.length > 0 ? (
            <div className="space-y-2 mb-6">
              {g.items.map((radarItem, idx) => (
                <motion.div
                  key={radarItem.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`bg-surface border ${g.config.borderColor} rounded-lg p-4 hover:shadow-lg hover:shadow-purple/5 transition-all group cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors">
                        {radarItem.assunto}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {radarItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-purple/8 text-purple border border-purple/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0">
                      {timeAgo(radarItem.criadoEm)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-border text-center mb-6">
              <span className="text-[10px] text-text-muted font-ui tracking-wider uppercase">
                Nenhum assunto nesta categoria
              </span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Total */}
      <motion.div variants={item} className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
        <span className="font-ui text-[10px] tracking-wider uppercase text-text-muted">Total no radar</span>
        <span className="font-stat text-xl font-bold text-cyan">{radarItems.length}</span>
      </motion.div>

      {/* Demo footer */}
      <motion.div variants={item} className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">Dados demonstrativos</span>
      </motion.div>
    </motion.div>
  );
}
