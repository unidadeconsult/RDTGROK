'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Layers, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const statusBadge: Record<string, { color: string; bg: string }> = {
  'ideia': { color: 'text-purple', bg: 'bg-purple/10 border-purple/20' },
  'desenvolvimento': { color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
  'pronto-criar': { color: 'text-orange', bg: 'bg-orange/10 border-orange/20' },
  'criando': { color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  'revisao': { color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  'pronto': { color: 'text-green', bg: 'bg-green/10 border-green/20' },
  'planejado': { color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
  'publicado': { color: 'text-green', bg: 'bg-green/10 border-green/20' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ArvorePage() {
  const { pautas } = useStore();
  const [selectedPautaId, setSelectedPautaId] = useState<string>('');

  const selectedPauta = useMemo(
    () => pautas.find((p) => p.id === selectedPautaId) || null,
    [pautas, selectedPautaId]
  );

  const stats = useMemo(() => {
    if (!selectedPauta) return null;
    const totalAngulos = selectedPauta.angulos.length;
    const totalConteudos = selectedPauta.conteudos.length;
    const formatosMap: Record<string, number> = {};
    selectedPauta.conteudos.forEach((c) => {
      formatosMap[c.formato] = (formatosMap[c.formato] || 0) + 1;
    });
    return { totalAngulos, totalConteudos, formatos: formatosMap };
  }, [selectedPauta]);

  // Build tree: group conteudos by anguloId
  const treeData = useMemo(() => {
    if (!selectedPauta) return [];
    return selectedPauta.angulos.map((angulo) => ({
      angulo,
      conteudos: selectedPauta.conteudos.filter((c) => c.anguloId === angulo.id),
    }));
  }, [selectedPauta]);

  const orphanConteudos = useMemo(() => {
    if (!selectedPauta) return [];
    const anguloIds = new Set(selectedPauta.angulos.map((a) => a.id));
    return selectedPauta.conteudos.filter((c) => !c.anguloId || !anguloIds.has(c.anguloId));
  }, [selectedPauta]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">ARVORE DE CONTEUDO</h1>
        <p className="text-text-muted text-sm mt-1">De uma ideia, muitas jogadas</p>
      </motion.div>

      {/* Pauta selector */}
      <motion.div variants={item} className="bg-surface border border-border rounded-lg p-5">
        <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-2 block">
          Selecione uma pauta-mae
        </label>
        <select
          value={selectedPautaId}
          onChange={(e) => setSelectedPautaId(e.target.value)}
          className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all"
        >
          <option value="">Escolha uma pauta...</option>
          {pautas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titulo} (OVR: {p.overall})
            </option>
          ))}
        </select>
      </motion.div>

      {!selectedPauta && (
        <motion.div variants={item} className="text-center py-16">
          <GitBranch size={48} className="mx-auto text-text-muted mb-4 opacity-30" />
          <p className="text-text-muted text-sm">Selecione uma pauta para visualizar a arvore de conteudo</p>
        </motion.div>
      )}

      {selectedPauta && (
        <>
          {/* Tree visualization */}
          <motion.div variants={item} className="bg-surface border border-border rounded-lg p-5 lg:p-6">
            {/* Root node */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                <GitBranch size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary truncate">{selectedPauta.titulo}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-stat text-sm font-bold text-gold">{selectedPauta.overall}</span>
                  <span className="font-ui text-[9px] tracking-wider text-text-muted uppercase">{selectedPauta.status}</span>
                </div>
              </div>
            </div>

            {/* Tree branches */}
            <div className="ml-5 border-l-2 border-purple/30 pl-0">
              {treeData.map((branch, branchIdx) => (
                <motion.div
                  key={branch.angulo.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: branchIdx * 0.08 }}
                  className="relative mb-4 last:mb-0"
                >
                  {/* Horizontal connector */}
                  <div className="absolute -left-[1px] top-5 w-6 h-px bg-purple/30" />

                  {/* Angulo node */}
                  <div className="ml-8 mb-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-primary/80 border border-purple/15 hover:border-purple/30 transition-all">
                      <ChevronRight size={14} className="text-purple shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-text-primary truncate">{branch.angulo.titulo}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-purple/10 text-purple border border-purple/15">
                            {branch.angulo.tipo}
                          </span>
                          {branch.angulo.aprovado && (
                            <span className="font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-green/10 text-green border border-green/15">
                              Aprovado
                            </span>
                          )}
                          {branch.angulo.favorito && (
                            <span className="text-gold text-[10px]">&#9733;</span>
                          )}
                        </div>
                      </div>
                      <span className="font-stat text-xs text-text-muted shrink-0">{branch.conteudos.length} conteudos</span>
                    </div>

                    {/* Leaf nodes (conteudos) */}
                    {branch.conteudos.length > 0 && (
                      <div className="ml-4 mt-1 border-l-2 border-cyan/20 pl-0">
                        {branch.conteudos.map((conteudo, leafIdx) => {
                          const badge = statusBadge[conteudo.status] || { color: 'text-text-muted', bg: 'bg-surface border-border' };
                          return (
                            <motion.div
                              key={conteudo.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: branchIdx * 0.08 + leafIdx * 0.04 + 0.1 }}
                              className="relative ml-6 mb-1.5 last:mb-0"
                            >
                              {/* Connector */}
                              <div className="absolute -left-[25px] top-3.5 w-5 h-px bg-cyan/20" />

                              <div className="flex items-center gap-2 p-2.5 rounded-md bg-surface border border-border hover:border-cyan/20 transition-all group cursor-pointer">
                                <Layers size={12} className="text-cyan shrink-0" />
                                <span className="text-[12px] text-text-secondary group-hover:text-text-primary transition-colors truncate flex-1">
                                  {conteudo.nome}
                                </span>
                                <span className={`font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded border ${badge.bg} ${badge.color} shrink-0`}>
                                  {conteudo.status}
                                </span>
                                <span className="font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-purple/8 text-purple border border-purple/10 shrink-0">
                                  {conteudo.formato}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Orphan conteudos (no angulo) */}
              {orphanConteudos.length > 0 && (
                <div className="relative mb-4">
                  <div className="absolute -left-[1px] top-5 w-6 h-px bg-purple/30" />
                  <div className="ml-8 mb-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-primary/80 border border-border hover:border-purple/30 transition-all">
                      <ChevronRight size={14} className="text-text-muted shrink-0" />
                      <span className="text-sm font-medium text-text-muted">Sem angulo definido</span>
                      <span className="ml-auto font-stat text-xs text-text-muted">{orphanConteudos.length}</span>
                    </div>
                    <div className="ml-4 mt-1 border-l-2 border-border pl-0">
                      {orphanConteudos.map((conteudo) => {
                        const badge = statusBadge[conteudo.status] || { color: 'text-text-muted', bg: 'bg-surface border-border' };
                        return (
                          <div key={conteudo.id} className="relative ml-6 mb-1.5">
                            <div className="absolute -left-[25px] top-3.5 w-5 h-px bg-border" />
                            <div className="flex items-center gap-2 p-2.5 rounded-md bg-surface border border-border hover:border-cyan/20 transition-all">
                              <Layers size={12} className="text-text-muted shrink-0" />
                              <span className="text-[12px] text-text-secondary truncate flex-1">{conteudo.nome}</span>
                              <span className={`font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded border ${badge.bg} ${badge.color} shrink-0`}>
                                {conteudo.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {treeData.length === 0 && orphanConteudos.length === 0 && (
                <div className="ml-8 py-8 text-center">
                  <span className="text-sm text-text-muted">Nenhum angulo ou conteudo nesta pauta</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-surface border border-border rounded-lg p-4 text-center">
                <div className="font-stat text-2xl font-bold text-purple">{stats.totalAngulos}</div>
                <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">Angulos</div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4 text-center">
                <div className="font-stat text-2xl font-bold text-cyan">{stats.totalConteudos}</div>
                <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">Conteudos</div>
              </div>
              {Object.entries(stats.formatos).slice(0, 2).map(([formato, count]) => (
                <div key={formato} className="bg-surface border border-border rounded-lg p-4 text-center">
                  <div className="font-stat text-2xl font-bold text-gold">{count}</div>
                  <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">{formato}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Formatos breakdown full */}
          {stats && Object.keys(stats.formatos).length > 0 && (
            <motion.div variants={item} className="bg-surface border border-border rounded-lg p-5">
              <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-text-primary mb-4">Formatos Gerados</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.formatos).map(([formato, count]) => (
                  <div key={formato} className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-primary border border-border">
                    <span className="text-sm text-text-secondary capitalize">{formato}</span>
                    <span className="font-stat text-sm font-bold text-cyan">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Demo footer */}
      <motion.div variants={item} className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">Dados demonstrativos</span>
      </motion.div>
    </motion.div>
  );
}
