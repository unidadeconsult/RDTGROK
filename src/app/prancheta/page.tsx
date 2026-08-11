'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, FileText, CheckCircle, Send } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { ConteudoDerivado, ContentStatus } from '@/lib/types';

interface ConteudoComPauta extends ConteudoDerivado {
  pautaTitulo: string;
}

const statusColumns: { key: ContentStatus; label: string; icon: React.ReactNode; color: string; borderColor: string; bgColor: string }[] = [
  { key: 'ideia', label: 'Ideia', icon: <Clipboard size={14} />, color: 'text-purple', borderColor: 'border-purple/30', bgColor: 'bg-purple/10' },
  { key: 'desenvolvimento', label: 'Desenvolvimento', icon: <FileText size={14} />, color: 'text-cyan', borderColor: 'border-cyan/30', bgColor: 'bg-cyan/10' },
  { key: 'pronto-criar', label: 'Pronto p/ Criar', icon: <FileText size={14} />, color: 'text-orange', borderColor: 'border-orange/30', bgColor: 'bg-orange/10' },
  { key: 'revisao', label: 'Revisao', icon: <CheckCircle size={14} />, color: 'text-gold', borderColor: 'border-gold/30', bgColor: 'bg-gold/10' },
  { key: 'pronto', label: 'Pronto', icon: <CheckCircle size={14} />, color: 'text-green', borderColor: 'border-green/30', bgColor: 'bg-green/10' },
  { key: 'publicado', label: 'Publicado', icon: <Send size={14} />, color: 'text-cyan', borderColor: 'border-cyan/30', bgColor: 'bg-cyan/10' },
];

const prioridadeStyles: Record<string, { label: string; color: string; bg: string }> = {
  alta: { label: 'ALTA', color: 'text-red', bg: 'bg-red/10 border-red/20' },
  media: { label: 'MEDIA', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  baixa: { label: 'BAIXA', color: 'text-text-muted', bg: 'bg-surface border-border' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function PranchetaPage() {
  const { pautas } = useStore();

  const allConteudos = useMemo<ConteudoComPauta[]>(() => {
    const result: ConteudoComPauta[] = [];
    pautas.forEach((pauta) => {
      pauta.conteudos.forEach((c) => {
        result.push({ ...c, pautaTitulo: pauta.titulo });
      });
    });
    return result;
  }, [pautas]);

  const columnData = useMemo(() => {
    return statusColumns.map((col) => ({
      ...col,
      items: allConteudos.filter((c) => c.status === col.key),
    }));
  }, [allConteudos]);

  const totalConteudos = allConteudos.length;
  const publicados = allConteudos.filter((c) => c.status === 'publicado').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">PRANCHETA EDITORIAL</h1>
          <p className="text-text-muted text-sm mt-1">Producao de Conteudo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-stat text-2xl font-bold text-text-primary">{totalConteudos}</div>
            <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">conteudos</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="font-stat text-2xl font-bold text-green">{publicados}</div>
            <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">publicados</div>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={item} className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">Progresso de Producao</span>
          <span className="font-stat text-sm font-bold text-cyan">
            {totalConteudos > 0 ? Math.round((publicados / totalConteudos) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-bg rounded-full"
            initial={{ width: 0 }}
            animate={{ width: totalConteudos > 0 ? `${(publicados / totalConteudos) * 100}%` : '0%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Kanban columns */}
      <motion.div variants={item} className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-4 min-w-[1200px]">
          {columnData.map((col, colIdx) => (
            <motion.div
              key={col.key}
              variants={item}
              className="flex-1 min-w-[200px]"
            >
              {/* Column header */}
              <div className={`flex items-center gap-2 mb-3 pb-3 border-b-2 ${col.borderColor}`}>
                <div className={`p-1.5 rounded ${col.bgColor} ${col.color}`}>
                  {col.icon}
                </div>
                <span className={`font-ui text-[10px] font-bold tracking-wider uppercase ${col.color}`}>
                  {col.label}
                </span>
                <span className="ml-auto font-stat text-sm font-bold text-text-muted">
                  {col.items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2.5">
                {col.items.map((conteudo, i) => {
                  const prio = prioridadeStyles[conteudo.prioridade] || prioridadeStyles.baixa;
                  return (
                    <motion.div
                      key={conteudo.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: colIdx * 0.05 + i * 0.03 }}
                      className="bg-surface border border-border rounded-lg p-3.5 hover:border-purple/25 hover:shadow-lg hover:shadow-purple/5 transition-all group cursor-pointer"
                    >
                      {/* Content name */}
                      <h4 className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors mb-2 leading-snug">
                        {conteudo.nome}
                      </h4>

                      {/* Format badge + destino */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-purple/10 text-purple border border-purple/15">
                          {conteudo.formato}
                        </span>
                        <span className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/15">
                          {conteudo.destino}
                        </span>
                      </div>

                      {/* Priority */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-ui text-[8px] tracking-[1.5px] px-1.5 py-0.5 rounded border ${prio.bg} ${prio.color}`}>
                          {prio.label}
                        </span>
                      </div>

                      {/* Parent pauta */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-border">
                        <FileText size={10} className="text-text-muted shrink-0" />
                        <span className="text-[10px] text-text-muted truncate" title={conteudo.pautaTitulo}>
                          {conteudo.pautaTitulo}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {col.items.length === 0 && (
                  <div className="p-6 rounded-lg border border-dashed border-border text-center">
                    <span className="text-[10px] text-text-muted font-ui tracking-wider uppercase">
                      Nenhum conteudo
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demo footer */}
      <motion.div variants={item} className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">Dados demonstrativos</span>
      </motion.div>
    </motion.div>
  );
}
