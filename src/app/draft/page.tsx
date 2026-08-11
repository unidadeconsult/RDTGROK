'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Star, Shield, Users, Eye, ChevronDown,
  ArrowUpDown, Filter, TrendingUp, Zap, X,
  Heart, Sparkles, Target, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import type { Pauta, PautaAttributes } from '@/lib/types';

// ============================================================
// Constants
// ============================================================

type FilterCategory = 'todos' | 'titulares' | 'banco' | 'base';
type SortKey = 'overall' | 'atualidade' | 'vidaUtil';

const SEMAFORO_COLORS: Record<string, string> = {
  verde: '#25D366',
  amarelo: '#FFD700',
  vermelho: '#FF3D4D',
  azul: '#3B82F6',
};

const VIDA_UTIL_LABELS: Record<string, string> = {
  minutos: 'Min',
  horas: 'Horas',
  hoje: 'Hoje',
  dias: 'Dias',
  longo: 'Longo',
  evergreen: 'Evergreen',
};

const VIDA_UTIL_URGENCY: Record<string, number> = {
  minutos: 5,
  horas: 4,
  hoje: 3,
  dias: 2,
  longo: 1,
  evergreen: 0,
};

const ATTRIBUTE_LABELS: Record<keyof PautaAttributes, string> = {
  atualidade: 'ATU',
  debate: 'DEB',
  originalidade: 'ORI',
  emocao: 'EMO',
  versatilidade: 'VER',
  vidaUtil: 'VID',
  potencialVisual: 'VIS',
  profundidade: 'PRO',
};

const ATTRIBUTE_FULL_LABELS: Record<keyof PautaAttributes, string> = {
  atualidade: 'Atualidade',
  debate: 'Debate',
  originalidade: 'Originalidade',
  emocao: 'Emocao',
  versatilidade: 'Versatilidade',
  vidaUtil: 'Vida Util',
  potencialVisual: 'Potencial Visual',
  profundidade: 'Profundidade',
};

// ============================================================
// Helpers
// ============================================================

function getOverallTier(score: number): { label: string; color: string; bg: string; border: string; glow: string } {
  if (score >= 95) return { label: 'Bola de Ouro', color: '#FFD700', bg: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.3)', glow: '0 0 20px rgba(255,215,0,0.25)' };
  if (score >= 88) return { label: 'Titular', color: '#00F0FF', bg: 'rgba(0,240,255,0.1)', border: 'rgba(0,240,255,0.3)', glow: '0 0 15px rgba(0,240,255,0.2)' };
  if (score >= 78) return { label: 'Otima', color: '#25D366', bg: 'rgba(37,211,102,0.1)', border: 'rgba(37,211,102,0.25)', glow: 'none' };
  if (score >= 68) return { label: 'Boa', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', glow: 'none' };
  if (score >= 55) return { label: 'Banco', color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', glow: 'none' };
  return { label: 'Base', color: '#697386', bg: 'rgba(105,115,134,0.1)', border: 'rgba(105,115,134,0.25)', glow: 'none' };
}

function getBarColor(value: number): string {
  if (value > 75) return '#25D366';
  if (value >= 50) return '#FFD700';
  return '#FF3D4D';
}

function getPautaCategory(pauta: Pauta): 'titulares' | 'banco' | 'base' {
  if (pauta.status === 'titular') return 'titulares';
  if (pauta.status === 'banco') return 'banco';
  return 'base';
}

// ============================================================
// Animation variants
// ============================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' as const } },
};

// ============================================================
// Sub-components
// ============================================================

function OverallBadge({ score, size = 'normal' }: { score: number; size?: 'normal' | 'large' }) {
  const tier = getOverallTier(score);
  const isLarge = size === 'large';

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: isLarge ? 72 : 56,
        height: isLarge ? 72 : 56,
        background: tier.bg,
        border: `2px solid ${tier.border}`,
        borderRadius: 4,
        boxShadow: tier.glow,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: tier.color }}
      />
      <span
        className="font-stat font-bold leading-none"
        style={{
          fontSize: isLarge ? 32 : 24,
          color: tier.color,
        }}
      >
        {score}
      </span>
      <span
        className="font-ui uppercase tracking-widest leading-none mt-0.5"
        style={{
          fontSize: 7,
          color: tier.color,
          opacity: 0.8,
        }}
      >
        {tier.label}
      </span>
    </div>
  );
}

function AttributeBar({ label, fullLabel, value }: { label: string; fullLabel: string; value: number }) {
  const color = getBarColor(value);
  return (
    <div className="flex items-center gap-1.5 group/attr" title={`${fullLabel}: ${value}`}>
      <span className="font-ui text-[8px] tracking-wider text-text-muted w-6 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[5px] bg-bg-primary/80 rounded-sm overflow-hidden">
        <motion.div
          className="h-full rounded-sm"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      <span
        className="font-stat text-[10px] font-bold w-6 text-right shrink-0"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

function SemaforoDot({ semaforo }: { semaforo: string }) {
  const color = SEMAFORO_COLORS[semaforo] || SEMAFORO_COLORS.azul;
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}80`,
          animation: semaforo === 'vermelho' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}

function VidaUtilBadge({ vidaUtil }: { vidaUtil: string }) {
  const label = VIDA_UTIL_LABELS[vidaUtil] || vidaUtil;
  const urgency = VIDA_UTIL_URGENCY[vidaUtil] ?? 1;
  let color = 'text-text-muted';
  if (urgency >= 4) color = 'text-red';
  else if (urgency === 3) color = 'text-orange';
  else if (urgency === 2) color = 'text-gold';

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Clock size={10} />
      <span className="font-ui text-[9px] tracking-wider uppercase">{label}</span>
    </div>
  );
}

function PlayerCard({
  pauta,
  isSelected,
  onSelect,
  onToggleFavorite,
}: {
  pauta: Pauta;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const tier = getOverallTier(pauta.overall);
  const attrKeys = Object.keys(ATTRIBUTE_LABELS) as (keyof PautaAttributes)[];

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div
        className="clip-card relative bg-surface overflow-hidden transition-all duration-300"
        style={{
          border: `1px solid ${isSelected ? tier.border : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isSelected ? tier.glow : 'none',
        }}
      >
        {/* Card top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, ${tier.color}, transparent)`,
            opacity: isSelected ? 1 : 0.4,
          }}
        />

        {/* Card header with overall */}
        <div className="p-4 pb-3">
          <div className="flex items-start gap-3">
            <OverallBadge score={pauta.overall} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <SemaforoDot semaforo={pauta.semaforo} />
                <VidaUtilBadge vidaUtil={pauta.vidaUtil} />
                {pauta.favorita && (
                  <Star size={12} className="text-gold fill-gold" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-text-primary leading-tight line-clamp-2 group-hover:text-cyan transition-colors">
                {pauta.titulo}
              </h3>
              {pauta.clube && (
                <span className="font-ui text-[9px] tracking-wider text-text-muted mt-1 block">
                  {pauta.clube}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Attribute bars */}
        <div className="px-4 pb-2 space-y-1">
          {attrKeys.map((key) => (
            <AttributeBar
              key={key}
              label={ATTRIBUTE_LABELS[key]}
              fullLabel={ATTRIBUTE_FULL_LABELS[key]}
              value={pauta.atributos[key]}
            />
          ))}
        </div>

        {/* Tags */}
        <div className="px-4 pb-3 pt-1">
          <div className="flex gap-1 flex-wrap">
            {pauta.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-purple/8 text-purple border border-purple/15"
              >
                {tag}
              </span>
            ))}
            {pauta.tags.length > 3 && (
              <span className="text-[8px] font-ui tracking-wider text-text-muted">
                +{pauta.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Hover gradient bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(transparent, ${tier.color}08)`,
          }}
        />
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="bg-surface-elevated border border-border-strong rounded-b-lg p-4 -mt-1 space-y-4">
              {/* Description */}
              {pauta.descricao && (
                <div>
                  <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted block mb-1">
                    Descricao
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pauta.descricao}
                  </p>
                </div>
              )}

              {/* Full attributes grid */}
              <div>
                <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted block mb-2">
                  Atributos Completos
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {attrKeys.map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="font-ui text-[9px] tracking-wider text-text-muted w-20 shrink-0">
                        {ATTRIBUTE_FULL_LABELS[key]}
                      </span>
                      <div className="flex-1 h-[6px] bg-bg-primary rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-500"
                          style={{
                            width: `${pauta.atributos[key]}%`,
                            background: getBarColor(pauta.atributos[key]),
                          }}
                        />
                      </div>
                      <span
                        className="font-stat text-xs font-bold w-7 text-right"
                        style={{ color: getBarColor(pauta.atributos[key]) }}
                      >
                        {pauta.atributos[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <span className="text-[10px] text-text-muted">
                  Status: <span className="text-text-secondary capitalize">{pauta.status}</span>
                </span>
                <span className="text-[10px] text-text-muted">
                  Origem: <span className="text-text-secondary">{pauta.origem}</span>
                </span>
                {pauta.angulos.length > 0 && (
                  <span className="text-[10px] text-text-muted">
                    Angulos: <span className="text-cyan">{pauta.angulos.length}</span>
                  </span>
                )}
                {pauta.conteudos.length > 0 && (
                  <span className="text-[10px] text-text-muted">
                    Conteudos: <span className="text-green">{pauta.conteudos.length}</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-ui tracking-wider uppercase border transition-all ${
                    pauta.favorita
                      ? 'border-gold/30 text-gold bg-gold/8'
                      : 'border-border text-text-muted hover:border-gold hover:text-gold'
                  }`}
                >
                  <Star size={12} fill={pauta.favorita ? 'currentColor' : 'none'} />
                  {pauta.favorita ? 'Favoritada' : 'Favoritar'}
                </button>
                <Link
                  href={`/sala-criacao?pauta=${pauta.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-ui tracking-wider uppercase border border-border text-text-muted hover:border-purple hover:text-purple transition-all"
                >
                  <Sparkles size={12} />
                  Brainstorming
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
  color,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  color: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl tracking-wider text-text-primary">
            {title}
          </h2>
          <span
            className="font-stat text-sm font-bold px-2 py-0.5 rounded"
            style={{ color, background: `${color}15` }}
          >
            {count}
          </span>
        </div>
        <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function DraftPage() {
  const { pautas, toggleFavorite } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterCategory>('todos');
  const [sortBy, setSortBy] = useState<SortKey>('overall');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Computed data
  const sortedPautas = useMemo(() => {
    let list = [...pautas];

    // Filter
    if (filter !== 'todos') {
      list = list.filter((p) => getPautaCategory(p) === filter);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'overall':
          return b.overall - a.overall;
        case 'atualidade':
          return b.atributos.atualidade - a.atributos.atualidade;
        case 'vidaUtil':
          return (VIDA_UTIL_URGENCY[a.vidaUtil] ?? 0) - (VIDA_UTIL_URGENCY[b.vidaUtil] ?? 0);
        default:
          return b.overall - a.overall;
      }
    });

    return list;
  }, [pautas, filter, sortBy]);

  const titulares = useMemo(
    () => sortedPautas.filter((p) => getPautaCategory(p) === 'titulares'),
    [sortedPautas]
  );
  const banco = useMemo(
    () => sortedPautas.filter((p) => getPautaCategory(p) === 'banco'),
    [sortedPautas]
  );
  const base = useMemo(
    () => sortedPautas.filter((p) => getPautaCategory(p) === 'base'),
    [sortedPautas]
  );

  // Stats
  const avgOverall = pautas.length
    ? Math.round(pautas.reduce((sum, p) => sum + p.overall, 0) / pautas.length)
    : 0;
  const topScore = pautas.length ? Math.max(...pautas.map((p) => p.overall)) : 0;
  const hotCount = pautas.filter((p) => p.semaforo === 'verde' || p.semaforo === 'azul').length;

  const filterOptions: { key: FilterCategory; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: pautas.length },
    { key: 'titulares', label: 'Titulares', count: pautas.filter((p) => p.status === 'titular').length },
    { key: 'banco', label: 'Banco', count: pautas.filter((p) => p.status === 'banco').length },
    {
      key: 'base',
      label: 'Base',
      count: pautas.filter((p) => p.status !== 'titular' && p.status !== 'banco').length,
    },
  ];

  const sortOptions: { key: SortKey; label: string; icon: React.ElementType }[] = [
    { key: 'overall', label: 'Overall', icon: BarChart3 },
    { key: 'atualidade', label: 'Atualidade', icon: TrendingUp },
    { key: 'vidaUtil', label: 'Vida Util', icon: Clock },
  ];

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleToggleFavorite(id: string) {
    toggleFavorite('pauta', id);
  }

  // Decide which sections to show based on filter
  const showTitulares = filter === 'todos' || filter === 'titulares';
  const showBanco = filter === 'todos' || filter === 'banco';
  const showBase = filter === 'todos' || filter === 'base';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 lg:py-8 relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 ambient-glow pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-[1px] w-12 gradient-bg opacity-50" />
            <Shield size={20} className="text-cyan" />
            <div className="h-[1px] w-12 gradient-bg opacity-50" />
          </div>
          <h1 className="font-display text-5xl lg:text-6xl tracking-wider gradient-text">
            DRAFT RDT
          </h1>
          <p className="font-ui text-[11px] tracking-[4px] uppercase text-text-muted mt-2">
            Elenco Editorial
          </p>
        </div>

        {/* Quick stats strip */}
        <div className="flex items-center justify-center gap-6 mt-5">
          <div className="flex items-center gap-2">
            <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">Elenco</span>
            <span className="font-stat text-lg font-bold text-text-primary">{pautas.length}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">Overall Medio</span>
            <span className="font-stat text-lg font-bold text-cyan">{avgOverall}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">Top</span>
            <span className="font-stat text-lg font-bold text-gold">{topScore}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">Prontas</span>
            <span className="font-stat text-lg font-bold text-green">{hotCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Controls: Filter + Sort */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        {/* Filter chips */}
        <div className="flex gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-ui text-[9px] font-semibold tracking-wider uppercase border transition-all ${
                filter === opt.key
                  ? 'gradient-bg text-white border-transparent glow-purple'
                  : 'border-border-strong text-text-muted hover:border-purple hover:text-text-primary'
              }`}
            >
              {opt.label}
              <span
                className={`font-stat text-[10px] ${
                  filter === opt.key ? 'text-white/80' : 'text-text-muted'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-border-strong text-text-muted font-ui text-[9px] tracking-wider uppercase hover:border-purple hover:text-text-primary transition-all"
          >
            <ArrowUpDown size={12} />
            Ordenar: {sortOptions.find((s) => s.key === sortBy)?.label}
            <ChevronDown size={10} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 z-20 bg-surface-elevated border border-border-strong rounded-lg overflow-hidden shadow-xl"
              >
                {sortOptions.map((opt) => {
                  const SortIcon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortBy(opt.key);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 font-ui text-[9px] tracking-wider uppercase transition-colors ${
                        sortBy === opt.key
                          ? 'text-cyan bg-purple/10'
                          : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                      }`}
                    >
                      <SortIcon size={12} />
                      {opt.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-8">
        {/* TITULARES */}
        {showTitulares && titulares.length > 0 && (
          <section>
            <SectionHeader
              icon={Zap}
              title="TITULARES"
              count={titulares.length}
              color="#00F0FF"
              subtitle="Pautas escaladas - prioridade maxima"
            />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {titulares.map((pauta) => (
                <PlayerCard
                  key={pauta.id}
                  pauta={pauta}
                  isSelected={selectedId === pauta.id}
                  onSelect={() => handleSelect(pauta.id)}
                  onToggleFavorite={() => handleToggleFavorite(pauta.id)}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* BANCO */}
        {showBanco && banco.length > 0 && (
          <section>
            <SectionHeader
              icon={Users}
              title="BANCO"
              count={banco.length}
              color="#F97316"
              subtitle="Reservas prontas para entrar"
            />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            >
              {banco.map((pauta) => (
                <PlayerCard
                  key={pauta.id}
                  pauta={pauta}
                  isSelected={selectedId === pauta.id}
                  onSelect={() => handleSelect(pauta.id)}
                  onToggleFavorite={() => handleToggleFavorite(pauta.id)}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* BASE / OBSERVACAO */}
        {showBase && base.length > 0 && (
          <section>
            <SectionHeader
              icon={Eye}
              title="BASE / OBSERVACAO"
              count={base.length}
              color="#697386"
              subtitle="Em desenvolvimento ou monitoramento"
            />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            >
              {base.map((pauta) => (
                <PlayerCard
                  key={pauta.id}
                  pauta={pauta}
                  isSelected={selectedId === pauta.id}
                  onSelect={() => handleSelect(pauta.id)}
                  onToggleFavorite={() => handleToggleFavorite(pauta.id)}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* Empty state */}
        {sortedPautas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Shield size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="font-display text-2xl tracking-wider text-text-muted mb-2">
              ELENCO VAZIO
            </h3>
            <p className="text-sm text-text-muted mb-6">
              Nenhuma pauta encontrada nesta categoria.
            </p>
            <Link
              href="/vestiario"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
            >
              <Sparkles size={14} />
              Criar nova pauta
            </Link>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 space-y-2"
      >
        <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#25D366' }} /> Verde = Pronto
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#FFD700' }} /> Amarelo = Atencao
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#FF3D4D' }} /> Vermelho = Urgente
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} /> Azul = Agendado
          </span>
        </div>
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted block">
          Draft RDT - Elenco Editorial
        </span>
      </motion.div>
    </div>
  );
}
