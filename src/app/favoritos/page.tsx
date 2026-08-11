'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Bookmark } from 'lucide-react';
import { useStore } from '@/lib/store';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function getOverallColor(score: number): string {
  if (score >= 95) return '#FFD700';
  if (score >= 88) return '#22C55E';
  if (score >= 78) return '#3B82F6';
  if (score >= 68) return '#8B5CF6';
  if (score >= 55) return '#F59E0B';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

function getVidaUtilLabel(vu: string): string {
  const map: Record<string, string> = {
    minutos: 'Minutos',
    horas: 'Horas',
    hoje: 'Hoje',
    dias: 'Dias',
    longo: 'Longo prazo',
    evergreen: 'Evergreen',
  };
  return map[vu] || vu;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useStore();

  const favPautas = favorites.pautas;
  const favIdeias = favorites.ideias;
  const totalFavs = favPautas.length + favIdeias.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
            FAVORITOS
          </h1>
          <p className="text-text-muted text-sm mt-1">Suas melhores jogadas</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg">
          <Bookmark size={14} className="text-gold" />
          <span className="font-stat text-sm text-gold font-bold">
            {totalFavs}
          </span>
          <span className="font-ui text-[9px] tracking-wider text-text-muted uppercase">
            favoritos
          </span>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple/10 border border-purple/20 flex items-center justify-center">
            <Star size={18} className="text-purple" />
          </div>
          <div>
            <span className="font-stat text-2xl font-bold text-purple">
              {favPautas.length}
            </span>
            <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">
              Pautas favoritas
            </p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
            <Heart size={18} className="text-cyan" />
          </div>
          <div>
            <span className="font-stat text-2xl font-bold text-cyan">
              {favIdeias.length}
            </span>
            <p className="font-ui text-[9px] tracking-[1.5px] uppercase text-text-muted">
              Ideias favoritas
            </p>
          </div>
        </div>
      </motion.div>

      {/* Empty state */}
      {totalFavs === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-border-strong border-dashed rounded-lg p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <Star size={28} className="text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Marque pautas e ideias com estrela para encontra-las aqui.
          </p>
        </motion.div>
      )}

      {/* Pautas Favoritas */}
      {favPautas.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-gold" />
            <h2 className="font-display text-xl tracking-wider text-text-primary">
              PAUTAS FAVORITAS
            </h2>
            <span className="font-stat text-sm text-text-muted ml-1">
              ({favPautas.length})
            </span>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence>
              {favPautas.map((pauta) => {
                const overallColor = getOverallColor(pauta.overall);
                return (
                  <motion.div
                    key={pauta.id}
                    variants={item}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-surface border border-gold/15 rounded-lg p-4 lg:p-5 hover:border-gold/30 transition-all hover:shadow-lg hover:shadow-gold/5 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Overall badge */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${overallColor}15`,
                          borderColor: `${overallColor}30`,
                        }}
                      >
                        <span
                          className="font-stat text-xl font-bold"
                          style={{ color: overallColor }}
                        >
                          {pauta.overall}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-primary">
                          {pauta.titulo}
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {pauta.clube && (
                            <span className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/15">
                              {pauta.clube}
                            </span>
                          )}
                          <span className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border">
                            {getVidaUtilLabel(pauta.vidaUtil)}
                          </span>
                        </div>

                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {pauta.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                            >
                              {t}
                            </span>
                          ))}
                          {pauta.tags.length > 4 && (
                            <span className="text-[9px] text-text-muted">
                              +{pauta.tags.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unfavorite button */}
                      <button
                        onClick={() => toggleFavorite('pauta', pauta.id)}
                        className="p-2 rounded border border-gold/30 text-gold bg-gold/8 hover:bg-gold/15 transition-all shrink-0"
                        title="Remover dos favoritos"
                      >
                        <Heart size={14} fill="currentColor" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Ideias Favoritas */}
      {favIdeias.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-cyan" />
            <h2 className="font-display text-xl tracking-wider text-text-primary">
              IDEIAS FAVORITAS
            </h2>
            <span className="font-stat text-sm text-text-muted ml-1">
              ({favIdeias.length})
            </span>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence>
              {favIdeias.map((ideia) => (
                <motion.div
                  key={ideia.id}
                  variants={item}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-surface border border-cyan/15 rounded-lg p-4 lg:p-5 hover:border-cyan/30 transition-all hover:shadow-lg hover:shadow-cyan/5 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                      <Star size={16} className="text-cyan" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {ideia.titulo || ideia.texto.substring(0, 60)}
                      </h3>
                      {ideia.titulo && (
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                          {ideia.texto}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] text-text-muted">
                          {timeAgo(ideia.criadaEm)}
                        </span>
                        {ideia.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Unfavorite button */}
                    <button
                      onClick={() => toggleFavorite('ideia', ideia.id)}
                      className="p-2 rounded border border-cyan/30 text-cyan bg-cyan/8 hover:bg-cyan/15 transition-all shrink-0"
                      title="Remover dos favoritos"
                    >
                      <Heart size={14} fill="currentColor" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
          Mostrando itens marcados como favoritos
        </span>
      </div>
    </div>
  );
}
