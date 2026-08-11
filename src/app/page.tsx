'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb, Flame, Zap, Clock,
  ArrowRight, Sparkles, Target
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

function OverallBadge({ score }: { score: number }) {
  let color = 'text-text-muted border-border';
  let label = 'Observacao';
  if (score >= 95) { color = 'text-gold border-gold/30 bg-gold/8'; label = 'Bola de Ouro'; }
  else if (score >= 88) { color = 'text-cyan border-cyan/30 bg-cyan/8'; label = 'Titular'; }
  else if (score >= 78) { color = 'text-green border-green/30 bg-green/8'; label = 'Otima'; }
  else if (score >= 68) { color = 'text-blue border-blue/30 bg-blue/8'; label = 'Boa'; }
  else if (score >= 55) { color = 'text-orange border-orange/30 bg-orange/8'; label = 'Banco'; }
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-semibold font-stat ${color}`}>
      <span className="text-base font-bold">{score}</span>
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CentralPage() {
  const { pautas, ideias } = useStore();

  const titulares = pautas.filter(p => p.status === 'titular');
  const emBrainstorming = pautas.filter(p => p.status === 'vestiario' || p.status === 'ideia');
  const prontas = pautas.filter(p => p.conteudos.some(c => c.status === 'pronto-criar' || c.status === 'pronto'));
  const topPautas = [...pautas].sort((a, b) => b.overall - a.overall).slice(0, 4);
  const topPauta = topPautas[0];

  const stats = [
    { label: 'Ideias no Vestiario', value: String(ideias.length), icon: Lightbulb, color: 'text-cyan', bg: 'bg-cyan/10', href: '/vestiario' },
    { label: 'Pautas Titulares', value: String(titulares.length), icon: Flame, color: 'text-gold', bg: 'bg-gold/10', href: '/draft' },
    { label: 'Em Brainstorming', value: String(emBrainstorming.length), icon: Zap, color: 'text-purple', bg: 'bg-purple/10', href: '/sala-criacao' },
    { label: 'Prontas para Criacao', value: String(prontas.length), icon: Sparkles, color: 'text-green', bg: 'bg-green/10', href: '/prancheta' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8">
      <motion.div variants={item} className="text-center py-6 lg:py-10">
        <h1 className="font-display text-5xl lg:text-7xl tracking-wider gradient-text">RDT</h1>
        <h2 className="font-display text-2xl lg:text-3xl tracking-wider text-text-primary mt-1">CENTRAL DE CRIACAO</h2>
        <p className="text-text-muted text-sm mt-3 italic">&ldquo;Nao comece pelo post. Comece pela ideia.&rdquo;</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <div className="bg-surface border border-border rounded-lg p-4 lg:p-5 hover:border-purple/30 hover:shadow-lg hover:shadow-purple/5 transition-all group cursor-pointer">
                <div className={`w-9 h-9 rounded-md ${s.bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div className="font-stat text-2xl lg:text-3xl font-bold text-text-primary">{s.value}</div>
                <div className="text-[11px] text-text-muted mt-1 font-ui tracking-wider uppercase">{s.label}</div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div variants={item} className="lg:col-span-2 bg-surface border border-border rounded-lg p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">☀️</span>
            <h3 className="font-ui text-sm font-bold tracking-wider uppercase text-text-primary">Resumo</h3>
          </div>
          {pautas.length === 0 && ideias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm mb-4">Sua central esta vazia. Comece capturando sua primeira ideia!</p>
              <Link
                href="/vestiario"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
              >
                <Lightbulb size={14} /> Capturar Primeira Ideia
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {ideias.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
                  <span className="text-base mt-0.5">💡</span>
                  <span className="text-sm text-text-secondary">{ideias.length} {ideias.length === 1 ? 'ideia salva' : 'ideias salvas'} no vestiario</span>
                </div>
              )}
              {titulares.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
                  <span className="text-base mt-0.5">🔥</span>
                  <span className="text-sm text-text-secondary">{titulares.length} {titulares.length === 1 ? 'pauta titular' : 'pautas titulares'}</span>
                </div>
              )}
              {emBrainstorming.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
                  <span className="text-base mt-0.5">🧠</span>
                  <span className="text-sm text-text-secondary">{emBrainstorming.length} em brainstorming</span>
                </div>
              )}
              {prontas.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
                  <span className="text-base mt-0.5">✅</span>
                  <span className="text-sm text-text-secondary">{prontas.length} {prontas.length === 1 ? 'pronta' : 'prontas'} para criacao</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="bg-surface border border-purple/20 rounded-lg p-5 lg:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-cyan" />
            <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-cyan">Proxima Jogada</h3>
          </div>
          {topPauta ? (
            <>
              <h4 className="font-display text-xl tracking-wide text-text-primary mb-3">{topPauta.titulo}</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">Potencial Editorial</span>
                <span className="font-stat text-lg font-bold text-gold">{topPauta.overall}</span>
              </div>
              <div className="w-full h-2 bg-bg-primary rounded-full mb-4 overflow-hidden">
                <div className="h-full gradient-bg rounded-full" style={{ width: `${topPauta.overall}%` }} />
              </div>
              <p className="text-sm text-text-secondary mb-3">{topPauta.descricao.substring(0, 120)}...</p>
              <div className="text-xs text-text-muted mb-4">
                Angulos: <span className="text-cyan font-bold">{topPauta.angulos.length}</span> |
                Conteudos: <span className="text-cyan font-bold">{topPauta.conteudos.length}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-text-muted mb-4">Nenhuma pauta disponivel ainda. Capture ideias e promova para pautas.</p>
          )}
          <Link
            href={topPauta ? "/sala-criacao" : "/vestiario"}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
          >
            {topPauta ? 'Abrir Pauta' : 'Comecar'} <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {topPautas.length > 0 && (
        <motion.div variants={item} className="bg-surface border border-border rounded-lg p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-orange" />
              <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-text-primary">Pautas Quentes</h3>
            </div>
            <Link href="/draft" className="font-ui text-[9px] tracking-wider uppercase text-purple hover:text-cyan transition-colors">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {topPautas.map((p) => (
              <div key={p.id} className="p-3 rounded-md bg-bg-primary/50 border border-border hover:border-purple/20 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors truncate">{p.titulo}</h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {p.clube && <span className="text-[10px] font-ui tracking-wider text-text-muted">{p.clube}</span>}
                      {p.clube && <span className="text-text-muted">·</span>}
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock size={10} /> {p.vidaUtil}
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {p.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-purple/8 text-purple border border-purple/15">{t}</span>
                      ))}
                    </div>
                  </div>
                  <OverallBadge score={p.overall} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '💡', label: 'Capturar Ideia', href: '/vestiario', desc: 'Registre rapidamente' },
          { icon: '🧠', label: 'Brainstorming', href: '/sala-criacao', desc: 'Pense antes de criar' },
          { icon: '⚽', label: 'Mesa Redonda', href: '/mesa-redonda', desc: 'Multiplos angulos' },
          { icon: '🌳', label: 'Arvore de Conteudo', href: '/arvore', desc: 'Multiplique ideias' },
        ].map((a) => (
          <Link key={a.label} href={a.href}>
            <div className="bg-surface border border-border rounded-lg p-4 hover:border-purple/30 hover:shadow-lg hover:shadow-purple/5 transition-all cursor-pointer text-center group">
              <span className="text-2xl block mb-2">{a.icon}</span>
              <div className="font-ui text-[10px] font-semibold tracking-wider uppercase text-text-primary group-hover:text-cyan transition-colors">{a.label}</div>
              <div className="text-[10px] text-text-muted mt-1">{a.desc}</div>
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
