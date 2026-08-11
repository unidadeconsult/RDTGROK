'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Star, Brain, ArrowUpRight, Archive, X,
  Link as LinkIcon, Clock, Search
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

const categoriasOpcoes = ['Noticia', 'Tatica', 'Mercado', 'Debate', 'Curiosidade', 'Historia', 'Opiniao', 'Polemica', 'Entrevista', 'Estatistica'];
const demoCategorias = ['Todas', 'Noticia', 'Tatica', 'Mercado', 'Debate', 'Historia', 'Opiniao'];

export default function VestiarioPage() {
  const { ideias, addIdeia, updateIdeia, deleteIdeia, toggleFavorite, promoverIdeia } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Todas');
  const [newIdeia, setNewIdeia] = useState({ texto: '', titulo: '', notas: '', link: '', fonte: '', categoria: '', tags: '', clube: '' });

  const filtered = ideias.filter(i => {
    const q = search.toLowerCase();
    if (q && !(i.texto.toLowerCase().includes(q) || (i.titulo || '').toLowerCase().includes(q))) return false;
    if (filterCat !== 'Todas' && i.categoria !== filterCat) return false;
    return true;
  });

  function handleAdd() {
    if (!newIdeia.texto.trim()) return;
    addIdeia({
      texto: newIdeia.texto,
      titulo: newIdeia.titulo || undefined,
      notas: newIdeia.notas || undefined,
      link: newIdeia.link || undefined,
      fonte: newIdeia.fonte || undefined,
      categoria: newIdeia.categoria || 'Noticia',
      tags: newIdeia.tags ? newIdeia.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      clube: newIdeia.clube || undefined,
    });
    setNewIdeia({ texto: '', titulo: '', notas: '', link: '', fonte: '', categoria: '', tags: '', clube: '' });
    setShowNew(false);
  }

  function handlePromover(id: string) {
    promoverIdeia(id);
  }

  function handleArchive(id: string) {
    deleteIdeia(id);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">VESTIARIO DE IDEIAS</h1>
          <p className="text-text-muted text-sm mt-1">Salve primeiro. Organize depois.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
        >
          <Plus size={14} /> Nova Ideia
        </button>
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-purple/20 rounded-lg p-5 lg:p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-cyan">Salvar em 5 Segundos</h3>
                <button onClick={() => setShowNew(false)} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                    O que chamou sua atencao? *
                  </label>
                  <textarea
                    value={newIdeia.texto}
                    onChange={e => setNewIdeia(p => ({ ...p, texto: e.target.value }))}
                    placeholder="Uma noticia, frase, estatistica, ideia..."
                    className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all resize-none placeholder:text-text-muted"
                    rows={3}
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    value={newIdeia.titulo}
                    onChange={e => setNewIdeia(p => ({ ...p, titulo: e.target.value }))}
                    placeholder="Titulo (opcional)"
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                  <input
                    value={newIdeia.link}
                    onChange={e => setNewIdeia(p => ({ ...p, link: e.target.value }))}
                    placeholder="Link (opcional)"
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                  <input
                    value={newIdeia.fonte}
                    onChange={e => setNewIdeia(p => ({ ...p, fonte: e.target.value }))}
                    placeholder="Fonte (opcional)"
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                  <select
                    value={newIdeia.categoria}
                    onChange={e => setNewIdeia(p => ({ ...p, categoria: e.target.value }))}
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all"
                  >
                    <option value="">Categoria</option>
                    {categoriasOpcoes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    value={newIdeia.tags}
                    onChange={e => setNewIdeia(p => ({ ...p, tags: e.target.value }))}
                    placeholder="Tags (separar por virgula)"
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                  <input
                    value={newIdeia.clube}
                    onChange={e => setNewIdeia(p => ({ ...p, clube: e.target.value }))}
                    placeholder="Clube (opcional)"
                    className="bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
                  >
                    Salvar Ideia
                  </button>
                  <button
                    onClick={() => setShowNew(false)}
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ideias..."
            className="w-full bg-bg-primary border border-border-strong rounded-md pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {demoCategorias.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded font-ui text-[9px] font-semibold tracking-wider uppercase whitespace-nowrap border transition-all ${
                filterCat === c
                  ? 'gradient-bg text-white border-transparent'
                  : 'border-border-strong text-text-muted hover:border-purple hover:text-text-primary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="font-ui text-[9px] tracking-[2px] uppercase text-text-muted">
        {filtered.length} ideias encontradas
      </div>

      <motion.div layout className="space-y-3">
        <AnimatePresence>
          {filtered.map((ideia) => (
            <motion.div
              key={ideia.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-surface border rounded-lg p-4 lg:p-5 transition-all hover:shadow-lg hover:shadow-purple/5 group ${
                ideia.promovida ? 'border-green/20' : ideia.favorita ? 'border-gold/20' : 'border-border hover:border-purple/25'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {ideia.categoria && (
                      <span className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-purple/10 text-purple border border-purple/15">
                        {ideia.categoria}
                      </span>
                    )}
                    {ideia.promovida && (
                      <span className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-green/10 text-green border border-green/15">
                        Promovida
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <Clock size={10} /> {timeAgo(ideia.criadaEm)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">{ideia.titulo || ideia.texto.substring(0, 60)}</h3>
                  <p className="text-sm text-text-secondary">{ideia.texto}</p>
                  {ideia.fonte && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
                      <LinkIcon size={10} /> {ideia.fonte}
                    </div>
                  )}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {ideia.tags.map(t => (
                      <span key={t} className="text-[9px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-bg-primary text-text-muted border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite('ideia', ideia.id)}
                    className={`p-2 rounded border transition-all ${
                      ideia.favorita
                        ? 'border-gold/30 text-gold bg-gold/8'
                        : 'border-border text-text-muted hover:border-gold hover:text-gold'
                    }`}
                    title="Favoritar"
                  >
                    <Star size={14} fill={ideia.favorita ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handlePromover(ideia.id)}
                    className="p-2 rounded border border-border text-text-muted hover:border-green hover:text-green transition-all"
                    title="Promover a Pauta"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    className="p-2 rounded border border-border text-text-muted hover:border-purple hover:text-purple transition-all"
                    title="Brainstorming"
                  >
                    <Brain size={14} />
                  </button>
                  <button
                    onClick={() => handleArchive(ideia.id)}
                    className="p-2 rounded border border-border text-text-muted hover:border-red hover:text-red transition-all"
                    title="Arquivar"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="text-center py-4">
      </div>
    </div>
  );
}
