'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Clock, Tag, Filter } from 'lucide-react';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function OverallBadge({ score }: { score: number }) {
  let color = 'text-text-muted border-border';
  if (score >= 95) color = 'text-gold border-gold/30 bg-gold/8';
  else if (score >= 88) color = 'text-cyan border-cyan/30 bg-cyan/8';
  else if (score >= 78) color = 'text-green border-green/30 bg-green/8';
  else if (score >= 68) color = 'text-blue border-blue/30 bg-blue/8';
  else if (score >= 55) color = 'text-orange border-orange/30 bg-orange/8';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-semibold font-stat ${color}`}>
      {score}
    </span>
  );
}

export default function ArquivoPage() {
  const { pautas, ideias } = useStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'pautas' | 'ideias'>('pautas');

  const allPautas = pautas.filter(
    (p) => p.status === 'arquivada' || p.status === 'dispensada'
  );
  const allIdeias = ideias.filter((i) => i.promovida);

  const q = search.toLowerCase().trim();
  const filteredPautas = q
    ? allPautas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    : allPautas;
  const filteredIdeias = q
    ? allIdeias.filter(
        (i) =>
          (i.titulo || '').toLowerCase().includes(q) ||
          i.texto.toLowerCase().includes(q)
      )
    : allIdeias;

  const tabs = [
    { key: 'pautas' as const, label: 'Pautas Arquivadas', count: filteredPautas.length },
    { key: 'ideias' as const, label: 'Ideias Promovidas', count: filteredIdeias.length },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      <motion.div variants={item} className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Archive size={20} className="text-purple" />
          <h1 className="font-display text-4xl lg:text-5xl tracking-wider gradient-text">ARQUIVO</h1>
        </div>
        <p className="text-text-muted text-sm font-ui tracking-wider uppercase">Historico & Registros</p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar no arquivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary outline-none focus:border-purple transition-colors placeholder:text-text-muted"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg font-ui text-[10px] tracking-wider uppercase transition-all ${
              tab === t.key
                ? 'gradient-bg text-white'
                : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:border-purple/30'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </motion.div>

      {tab === 'pautas' && (
        <motion.div variants={item} className="space-y-3">
          {filteredPautas.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <Archive size={40} className="text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted text-sm">
                {q ? 'Nenhuma pauta encontrada.' : 'Nenhuma pauta arquivada. Pautas dispensadas ou arquivadas aparecerao aqui.'}
              </p>
            </div>
          ) : (
            filteredPautas.map((p) => (
              <div key={p.id} className="bg-surface border border-border rounded-lg p-4 hover:border-purple/20 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {p.titulo}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{p.descricao}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {p.clube && (
                        <span className="text-[10px] font-ui tracking-wider text-text-muted">{p.clube}</span>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock size={10} /> {timeAgo(p.atualizadaEm)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Tag size={10} /> {p.status}
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-purple/8 text-purple/60 border border-purple/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <OverallBadge score={p.overall} />
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {tab === 'ideias' && (
        <motion.div variants={item} className="space-y-3">
          {filteredIdeias.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <Filter size={40} className="text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted text-sm">
                {q ? 'Nenhuma ideia encontrada.' : 'Ideias promovidas a pautas aparecerao aqui como registro.'}
              </p>
            </div>
          ) : (
            filteredIdeias.map((i) => (
              <div key={i.id} className="bg-surface border border-border rounded-lg p-4 hover:border-green/20 transition-all group">
                <h3 className="text-sm font-medium text-text-secondary group-hover:text-green transition-colors">
                  {i.titulo || i.texto}
                </h3>
                {i.titulo && <p className="text-xs text-text-muted mt-1">{i.texto}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Clock size={10} /> {timeAgo(i.criadaEm)}
                  </div>
                  <span className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-green/10 text-green border border-green/20">
                    Promovida
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {i.tags.map((t) => (
                    <span key={t} className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-green/8 text-green/70 border border-green/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      <motion.div variants={item} className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
        </span>
      </motion.div>
    </motion.div>
  );
}
