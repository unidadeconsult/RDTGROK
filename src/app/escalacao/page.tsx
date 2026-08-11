'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Shield } from 'lucide-react';
import { useStore } from '@/lib/store';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

interface PositionSlot {
  label: string;
  row: number;
  col: number;
  formato: string;
}

// 4-3-3 formation positions mapped to content types
const formationSlots: PositionSlot[] = [
  // Forwards (row 0)
  { label: 'PE', row: 0, col: 0, formato: 'reels' },
  { label: 'CA', row: 0, col: 1, formato: 'video' },
  { label: 'PD', row: 0, col: 2, formato: 'post' },
  // Midfielders (row 1)
  { label: 'ME', row: 1, col: 0, formato: 'carrossel' },
  { label: 'VOL', row: 1, col: 1, formato: 'materia' },
  { label: 'MD', row: 1, col: 2, formato: 'thread' },
  // Defenders (row 2)
  { label: 'LE', row: 2, col: 0, formato: 'infografico' },
  { label: 'ZAG', row: 2, col: 1, formato: 'enquete' },
  { label: 'ZAG', row: 2, col: 2, formato: 'materia' },
  { label: 'LD', row: 2, col: 3, formato: 'carrossel' },
  // Goalkeeper (row 3)
  { label: 'GOL', row: 3, col: 0, formato: 'video' },
];

function getOverallColor(score: number): string {
  if (score >= 95) return 'text-gold';
  if (score >= 88) return 'text-green';
  if (score >= 78) return 'text-cyan';
  if (score >= 68) return 'text-purple';
  return 'text-orange';
}

function getOverallGlow(score: number): string {
  if (score >= 95) return 'shadow-gold/30';
  if (score >= 88) return 'shadow-green/20';
  if (score >= 78) return 'shadow-cyan/20';
  return 'shadow-purple/10';
}

export default function EscalacaoPage() {
  const { pautas } = useStore();

  // Sort pautas by overall, take top ones for the formation
  const sortedPautas = useMemo(
    () => [...pautas].sort((a, b) => b.overall - a.overall),
    [pautas]
  );

  const titulares = sortedPautas.slice(0, 11);
  const banco = sortedPautas.slice(11, 18);
  const avgOverall = titulares.length > 0
    ? Math.round(titulares.reduce((s, p) => s + p.overall, 0) / titulares.length)
    : 0;

  // Build rows for the formation display
  const rows = useMemo(() => {
    const rowMap: Record<number, { slot: PositionSlot; pauta: typeof titulares[number] | null }[]> = {};
    formationSlots.forEach((slot, idx) => {
      if (!rowMap[slot.row]) rowMap[slot.row] = [];
      rowMap[slot.row].push({
        slot,
        pauta: titulares[idx] || null,
      });
    });
    return Object.entries(rowMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, items]) => items);
  }, [titulares]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">ESCALACAO</h1>
          <p className="text-text-muted text-sm mt-1">Posicione seus conteudos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-gold/20">
            <Trophy size={16} className="text-gold" />
            <span className="font-ui text-[10px] tracking-wider uppercase text-text-muted">OVR Time</span>
            <span className="font-stat text-xl font-bold text-gold">{avgOverall}</span>
          </div>
        </div>
      </motion.div>

      {/* Formation stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-green/10 flex items-center justify-center">
            <Shield size={18} className="text-green" />
          </div>
          <div>
            <div className="font-stat text-xl font-bold text-text-primary">{titulares.length}</div>
            <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">Titulares</div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-orange/10 flex items-center justify-center">
            <Users size={18} className="text-orange" />
          </div>
          <div>
            <div className="font-stat text-xl font-bold text-text-primary">{banco.length}</div>
            <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">No Banco</div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-purple/10 flex items-center justify-center">
            <Trophy size={18} className="text-purple" />
          </div>
          <div>
            <div className="font-stat text-xl font-bold text-text-primary">4-3-3</div>
            <div className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">Formacao</div>
          </div>
        </div>
      </motion.div>

      {/* Football pitch */}
      <motion.div variants={item} className="relative rounded-xl overflow-hidden border-2 border-green/30">
        {/* Field background */}
        <div
          className="relative py-8 px-4 lg:px-8"
          style={{
            background: 'linear-gradient(180deg, #0d3b1c 0%, #0f4a22 25%, #0d3b1c 50%, #0f4a22 75%, #0d3b1c 100%)',
          }}
        >
          {/* Field markings */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Center line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-white/10" />
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/10" />
            {/* Top penalty area */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[50%] h-[18%] border-b border-l border-r border-white/8 rounded-b-sm" />
            {/* Bottom penalty area */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[50%] h-[18%] border-t border-l border-r border-white/8 rounded-t-sm" />
            {/* Field border */}
            <div className="absolute inset-[3%] border border-white/8 rounded-sm" />
          </div>

          {/* Formation rows */}
          <div className="relative z-10 space-y-6 lg:space-y-10">
            {rows.map((row, rowIdx) => (
              <motion.div
                key={rowIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIdx * 0.12 }}
                className="flex justify-center gap-3 lg:gap-6"
              >
                {row.map(({ slot, pauta }, slotIdx) => (
                  <motion.div
                    key={`${rowIdx}-${slotIdx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIdx * 0.12 + slotIdx * 0.06 }}
                    className={`w-[85px] lg:w-[120px] bg-bg-primary/90 backdrop-blur-sm border border-border rounded-lg p-2.5 lg:p-3 text-center hover:border-gold/40 hover:shadow-lg ${pauta ? getOverallGlow(pauta.overall) : ''} transition-all cursor-pointer group`}
                  >
                    {/* Position badge */}
                    <div className="font-ui text-[8px] tracking-[2px] uppercase text-gold mb-1.5">{slot.label}</div>

                    {pauta ? (
                      <>
                        {/* Overall */}
                        <div className={`font-stat text-xl lg:text-2xl font-bold ${getOverallColor(pauta.overall)} mb-1`}>
                          {pauta.overall}
                        </div>
                        {/* Pauta title truncated */}
                        <div className="text-[9px] lg:text-[10px] text-text-secondary group-hover:text-text-primary transition-colors leading-tight mb-1.5 line-clamp-2 min-h-[24px]">
                          {pauta.titulo.length > 35 ? pauta.titulo.substring(0, 35) + '...' : pauta.titulo}
                        </div>
                        {/* Format badge */}
                        <div className="font-ui text-[7px] lg:text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-purple/15 text-purple border border-purple/10 inline-block">
                          {slot.formato}
                        </div>
                      </>
                    ) : (
                      <div className="py-3">
                        <div className="text-[10px] text-text-muted">Vazio</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bench */}
      <motion.div variants={item} className="bg-surface border border-border rounded-lg p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-orange" />
          <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-text-primary">Banco de Reservas</h3>
          <div className="flex-1 h-px bg-border ml-2" />
          <span className="font-stat text-sm font-bold text-text-muted">{banco.length}</span>
        </div>

        {banco.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {banco.map((pauta, idx) => (
              <motion.div
                key={pauta.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-bg-primary border border-border rounded-lg p-3 hover:border-purple/25 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ui text-[8px] tracking-[1.5px] uppercase text-text-muted">Reserva</span>
                  <span className={`font-stat text-lg font-bold ${getOverallColor(pauta.overall)}`}>{pauta.overall}</span>
                </div>
                <h4 className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors leading-snug line-clamp-2">
                  {pauta.titulo}
                </h4>
                {pauta.clube && (
                  <div className="mt-2">
                    <span className="font-ui text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-cyan/8 text-cyan border border-cyan/10">
                      {pauta.clube}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-dashed border-border text-center">
            <span className="text-[10px] text-text-muted font-ui tracking-wider uppercase">
              Nenhuma pauta no banco
            </span>
          </div>
        )}
      </motion.div>

      {/* Quick legend */}
      <motion.div variants={item} className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="text-[10px] text-text-muted">95+ Bola de Ouro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green" />
            <span className="text-[10px] text-text-muted">88+ Titular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan" />
            <span className="text-[10px] text-text-muted">78+ Otima</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple" />
            <span className="text-[10px] text-text-muted">68+ Boa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange" />
            <span className="text-[10px] text-text-muted">&lt;68 Banco</span>
          </div>
        </div>
      </motion.div>

      {/* Demo footer */}
      <motion.div variants={item} className="text-center py-4">
      </motion.div>
    </motion.div>
  );
}
