'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, FolderOpen, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

interface DemoPackage {
  id: string;
  nome: string;
  descricao: string;
  pautaIds: string[];
  tags: string[];
  cor: string;
}

const demoPackages: DemoPackage[] = [
  {
    id: 'pkg-1',
    nome: 'Semana do Classico',
    descricao: 'Cobertura completa dos classicos da rodada',
    pautaIds: ['p2', 'p24', 'p11'],
    tags: ['classico', 'rivalidade', 'brasileirao'],
    cor: '#FF3D4D',
  },
  {
    id: 'pkg-2',
    nome: 'Especial Libertadores',
    descricao: 'Tudo sobre as semifinais da Libertadores 2026',
    pautaIds: ['p3', 'p18'],
    tags: ['libertadores', 'semifinal', 'conmebol'],
    cor: '#FFD700',
  },
  {
    id: 'pkg-3',
    nome: 'Mercado de Transferencias',
    descricao: 'Balanco e destaques da janela de transferencias',
    pautaIds: ['p1', 'p12'],
    tags: ['mercado', 'transferencia', 'janela'],
    cor: '#25D366',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PacotesPage() {
  const { pautas } = useStore();
  const [showMessage, setShowMessage] = useState(false);

  function getPautasForPackage(pautaIds: string[]) {
    return pautas.filter((p) => pautaIds.includes(p.id));
  }

  function getAverageOverall(pautaIds: string[]): number {
    const matched = getPautasForPackage(pautaIds);
    if (matched.length === 0) return 0;
    const sum = matched.reduce((acc, p) => acc + p.overall, 0);
    return Math.round(sum / matched.length);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
            PACOTES
          </h1>
          <p className="text-text-muted text-sm mt-1">Agrupe suas pautas</p>
        </div>
        <button
          onClick={() => setShowMessage(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
        >
          <Plus size={14} /> Criar Pacote
        </button>
      </div>

      {/* Motivational message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-purple/20 rounded-lg p-5 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                    <Package size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Monte pacotes incriveis!
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Agrupe pautas relacionadas para criar coberturas completas e impactantes. Cada pacote e uma jogada de mestre!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessage(false)}
                  className="text-text-muted hover:text-text-primary text-xs px-3 py-1 border border-border-strong rounded hover:border-purple transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-cyan">
            {demoPackages.length}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Pacotes ativos
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-gold">
            {demoPackages.reduce((acc, pkg) => acc + pkg.pautaIds.length, 0)}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Pautas agrupadas
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-purple">
            {Math.round(
              demoPackages.reduce(
                (acc, pkg) => acc + getAverageOverall(pkg.pautaIds),
                0,
              ) / demoPackages.length,
            )}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Overall medio
          </p>
        </div>
      </motion.div>

      {/* Package cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {demoPackages.map((pkg) => {
          const pkgPautas = getPautasForPackage(pkg.pautaIds);
          const avgOverall = getAverageOverall(pkg.pautaIds);

          return (
            <motion.div
              key={pkg.id}
              variants={item}
              className="relative bg-surface rounded-lg border border-border hover:border-purple/25 transition-all hover:shadow-lg hover:shadow-purple/5 group overflow-hidden"
            >
              {/* Gradient top border */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, ${pkg.cor} 0%, var(--color-purple) 50%, var(--color-cyan) 100%)`,
                }}
              />

              <div className="p-5 lg:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${pkg.cor}15`,
                        border: `1px solid ${pkg.cor}30`,
                      }}
                    >
                      <FolderOpen size={22} style={{ color: pkg.cor }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {pkg.nome}
                      </h3>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {pkg.descricao}
                      </p>

                      {/* Tags */}
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {pkg.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overall badge */}
                  <div className="text-center shrink-0">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center border"
                      style={{
                        backgroundColor: `${pkg.cor}10`,
                        borderColor: `${pkg.cor}30`,
                      }}
                    >
                      <span
                        className="font-stat text-2xl font-bold"
                        style={{ color: pkg.cor }}
                      >
                        {avgOverall}
                      </span>
                    </div>
                    <span className="font-ui text-[8px] tracking-wider text-text-muted mt-1 block">
                      OVERALL
                    </span>
                  </div>
                </div>

                {/* Pautas inside the package */}
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mb-2 block">
                    {pkgPautas.length} pautas neste pacote
                  </span>
                  <div className="space-y-2">
                    {pkgPautas.map((pauta) => (
                      <div
                        key={pauta.id}
                        className="flex items-center gap-3 py-2 px-3 rounded bg-bg-primary border border-border"
                      >
                        <span
                          className="font-stat text-sm font-bold w-8 text-center"
                          style={{ color: pkg.cor }}
                        >
                          {pauta.overall}
                        </span>
                        <span className="text-sm text-text-primary truncate flex-1">
                          {pauta.titulo}
                        </span>
                        <span className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-surface text-text-muted border border-border">
                          {pauta.vidaUtil}
                        </span>
                      </div>
                    ))}
                    {pkgPautas.length === 0 && (
                      <p className="text-xs text-text-muted italic py-2">
                        Pautas de demonstracao nao encontradas no store atual
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
        </span>
      </div>
    </div>
  );
}
