'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface ScheduledItem {
  titulo: string;
  formato: string;
  cor: string;
}

interface DiaData {
  nome: string;
  abrev: string;
  items: ScheduledItem[];
}

const semanaAtual: DiaData[] = [
  {
    nome: 'Segunda-feira',
    abrev: 'SEG',
    items: [
      {
        titulo: 'Post Instagram - Memphis no Corinthians',
        formato: 'Instagram',
        cor: '#E1306C',
      },
    ],
  },
  {
    nome: 'Terca-feira',
    abrev: 'TER',
    items: [
      {
        titulo: 'Thread Twitter - Analise tatica Flamengo',
        formato: 'Twitter/X',
        cor: '#1DA1F2',
      },
    ],
  },
  {
    nome: 'Quarta-feira',
    abrev: 'QUA',
    items: [
      {
        titulo: 'Video YouTube - Classico preview',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Quinta-feira',
    abrev: 'QUI',
    items: [
      {
        titulo: 'Carrossel - Ranking da rodada',
        formato: 'Instagram',
        cor: '#E1306C',
      },
    ],
  },
  {
    nome: 'Sexta-feira',
    abrev: 'SEX',
    items: [
      {
        titulo: 'Mesa Redonda - Debate da semana',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Sabado',
    abrev: 'SAB',
    items: [],
  },
  {
    nome: 'Domingo',
    abrev: 'DOM',
    items: [],
  },
];

const semanaAnterior: DiaData[] = [
  {
    nome: 'Segunda-feira',
    abrev: 'SEG',
    items: [
      {
        titulo: 'Materia - Balanco do mercado',
        formato: 'Site',
        cor: '#8B00FF',
      },
    ],
  },
  {
    nome: 'Terca-feira',
    abrev: 'TER',
    items: [
      {
        titulo: 'Reels - Top 5 gols da rodada',
        formato: 'Instagram',
        cor: '#E1306C',
      },
    ],
  },
  {
    nome: 'Quarta-feira',
    abrev: 'QUA',
    items: [
      {
        titulo: 'Video - Analise tatica semifinal',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Quinta-feira',
    abrev: 'QUI',
    items: [
      {
        titulo: 'Thread - Bastidores do vestiario',
        formato: 'Twitter/X',
        cor: '#1DA1F2',
      },
    ],
  },
  {
    nome: 'Sexta-feira',
    abrev: 'SEX',
    items: [
      {
        titulo: 'Enquete - Craque da semana',
        formato: 'Twitter/X',
        cor: '#1DA1F2',
      },
    ],
  },
  {
    nome: 'Sabado',
    abrev: 'SAB',
    items: [
      {
        titulo: 'Ao Vivo - Pre-jogo Brasileirao',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Domingo',
    abrev: 'DOM',
    items: [
      {
        titulo: 'Compilado - Gols do dia',
        formato: 'Instagram',
        cor: '#E1306C',
      },
    ],
  },
];

const proximaSemana: DiaData[] = [
  {
    nome: 'Segunda-feira',
    abrev: 'SEG',
    items: [
      {
        titulo: 'Infografico - Numeros da rodada',
        formato: 'Instagram',
        cor: '#E1306C',
      },
    ],
  },
  {
    nome: 'Terca-feira',
    abrev: 'TER',
    items: [
      {
        titulo: 'Video - Reforcos que podem chegar',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Quarta-feira',
    abrev: 'QUA',
    items: [],
  },
  {
    nome: 'Quinta-feira',
    abrev: 'QUI',
    items: [
      {
        titulo: 'Materia - Revelacoes da base 2026',
        formato: 'Site',
        cor: '#8B00FF',
      },
    ],
  },
  {
    nome: 'Sexta-feira',
    abrev: 'SEX',
    items: [
      {
        titulo: 'Mesa Redonda - Prognosticos',
        formato: 'YouTube',
        cor: '#FF0000',
      },
    ],
  },
  {
    nome: 'Sabado',
    abrev: 'SAB',
    items: [],
  },
  {
    nome: 'Domingo',
    abrev: 'DOM',
    items: [],
  },
];

const semanas = [
  { label: 'Semana Anterior', data: semanaAnterior, dateRange: '04/08 - 10/08' },
  { label: 'Semana Atual', data: semanaAtual, dateRange: '11/08 - 17/08' },
  { label: 'Proxima Semana', data: proximaSemana, dateRange: '18/08 - 24/08' },
];

function getDateForDay(weekIndex: number, dayIndex: number): string {
  const baseDate = 4 + weekIndex * 7 + dayIndex;
  return `${baseDate}/08`;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function PlanejamentoPage() {
  const [weekIndex, setWeekIndex] = useState(1);
  const currentWeek = semanas[weekIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
            PLANEJAMENTO
          </h1>
          <p className="text-text-muted text-sm mt-1">Calendario Editorial</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-cyan" />
          <span className="font-ui text-[10px] tracking-wider text-text-secondary uppercase">
            Agosto 2026
          </span>
        </div>
      </div>

      {/* Week navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-surface border border-border rounded-lg p-4"
      >
        <button
          onClick={() => setWeekIndex((prev) => Math.max(0, prev - 1))}
          disabled={weekIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded border border-border-strong text-text-secondary font-ui text-[10px] tracking-wider uppercase hover:border-purple hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Semana Anterior
        </button>

        <div className="text-center">
          <h2 className="font-display text-xl tracking-wider text-text-primary">
            {currentWeek.label}
          </h2>
          <span className="font-stat text-sm text-cyan">
            {currentWeek.dateRange}
          </span>
        </div>

        <button
          onClick={() =>
            setWeekIndex((prev) => Math.min(semanas.length - 1, prev + 1))
          }
          disabled={weekIndex === semanas.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded border border-border-strong text-text-secondary font-ui text-[10px] tracking-wider uppercase hover:border-purple hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Proxima Semana <ChevronRight size={14} />
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-cyan">
            {currentWeek.data.reduce((acc, d) => acc + d.items.length, 0)}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Conteudos planejados
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-gold">
            {currentWeek.data.filter((d) => d.items.length > 0).length}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Dias com conteudo
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <span className="font-stat text-2xl font-bold text-green">
            {currentWeek.data.filter((d) => d.items.length === 0).length}
          </span>
          <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1">
            Slots livres
          </p>
        </div>
      </motion.div>

      {/* Day cards */}
      <motion.div
        key={weekIndex}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        {currentWeek.data.map((dia, idx) => {
          const isToday =
            weekIndex === 1 && idx === 0;
          const hasContent = dia.items.length > 0;

          return (
            <motion.div
              key={`${weekIndex}-${idx}`}
              variants={item}
              className={`bg-surface rounded-lg border overflow-hidden transition-all hover:shadow-lg hover:shadow-purple/5 ${
                isToday
                  ? 'border-cyan/30 ring-1 ring-cyan/10'
                  : hasContent
                    ? 'border-border hover:border-purple/25'
                    : 'border-border/50 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Day header */}
              <div
                className={`px-4 py-3 border-b ${
                  isToday
                    ? 'border-cyan/20 bg-cyan/5'
                    : 'border-border bg-surface-elevated'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-ui text-[11px] font-bold tracking-wider ${
                      isToday ? 'text-cyan' : 'text-text-secondary'
                    }`}
                  >
                    {dia.abrev}
                  </span>
                  <span className="font-stat text-sm text-text-muted">
                    {getDateForDay(weekIndex, idx)}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{dia.nome}</p>
                {isToday && (
                  <span className="inline-block mt-1 text-[8px] font-ui tracking-widest uppercase px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">
                    Hoje
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3 min-h-[100px]">
                {dia.items.length > 0 ? (
                  <div className="space-y-2">
                    {dia.items.map((content, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 rounded bg-bg-primary border border-border group/item hover:border-purple/20 transition-all"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: content.cor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-text-primary leading-relaxed">
                              {content.titulo}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span
                                className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${content.cor}15`,
                                  color: content.cor,
                                  border: `1px solid ${content.cor}25`,
                                }}
                              >
                                {content.formato}
                              </span>
                              <span className="text-[9px] text-text-muted flex items-center gap-0.5">
                                <Clock size={8} /> Agendado
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                    <div className="w-8 h-8 rounded-full border border-border-strong border-dashed flex items-center justify-center mb-2">
                      <Calendar size={14} className="text-text-muted" />
                    </div>
                    <span className="text-[9px] text-text-muted font-ui tracking-wider">
                      SEM CONTEUDO
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
          Dados demonstrativos
        </span>
      </div>
    </div>
  );
}
