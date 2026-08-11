'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  ChevronDown,
  Play,
  Sparkles,
  Users,
} from 'lucide-react'
import { useStore } from '@/lib/store'

// ============================================================
// Editorial Voices
// ============================================================

interface EditorialVoice {
  id: string
  icon: string
  name: string
  description: string
  color: string
  tailwindColor: string
  generateTake: (pautaTitulo: string) => string
}

const VOICES: EditorialVoice[] = [
  {
    id: 'narrador',
    icon: '🎙️',
    name: 'O Narrador',
    description: 'Tom epico e emocional',
    color: '#00E5FF',
    tailwindColor: 'cyan',
    generateTake: (t) =>
      `"E naquele momento, senhoras e senhores, ${t} se tornou mais do que uma noticia... se tornou um capitulo na historia do futebol brasileiro. A emocao toma conta!"`,
  },
  {
    id: 'analista',
    icon: '📊',
    name: 'O Analista',
    description: 'Foco em dados e estatisticas',
    color: '#3B82F6',
    tailwindColor: 'blue',
    generateTake: (t) =>
      `"Os numeros nao mentem. Quando analisamos ${t} pelos dados, vemos um padrao claro: as metricas apontam para uma tendencia que poucos estao percebendo. Vamos aos graficos."`,
  },
  {
    id: 'provocador',
    icon: '🔥',
    name: 'O Provocador',
    description: 'Opinioes fortes e debates',
    color: '#EF4444',
    tailwindColor: 'red',
    generateTake: (t) =>
      `"Vou falar o que ninguem tem coragem: ${t} e a prova de que o futebol brasileiro esta vivendo de ilusao. Podem me criticar, mas alguem precisa dizer a verdade!"`,
  },
  {
    id: 'humorista',
    icon: '😂',
    name: 'O Humorista',
    description: 'Abordagem com humor e memes',
    color: '#EAB308',
    tailwindColor: 'gold',
    generateTake: (t) =>
      `"Gente, ${t} e tipo aquele amigo que promete que vai pagar a conta e some. O meme praticamente se escreve sozinho! A internet ja esta fazendo hora extra com essa."`,
  },
  {
    id: 'historiador',
    icon: '📚',
    name: 'O Historiador',
    description: 'Contexto historico e comparacoes',
    color: '#A855F7',
    tailwindColor: 'purple',
    generateTake: (t) =>
      `"Para entender ${t}, precisamos voltar no tempo. Em 1970, algo semelhante aconteceu e mudou os rumos do futebol. A historia se repete, mas poucos conhecem o contexto completo."`,
  },
  {
    id: 'estrategista',
    icon: '🎯',
    name: 'O Estrategista',
    description: 'Tatica e visao de jogo',
    color: '#22C55E',
    tailwindColor: 'green',
    generateTake: (t) =>
      `"Taticamente, ${t} revela uma mudanca no padrao de jogo. O posicionamento, as linhas de marcacao, a transicao... tudo aponta para uma evolucao tatica que merece analise profunda."`,
  },
  {
    id: 'torcedor',
    icon: '💬',
    name: 'O Torcedor',
    description: 'Perspectiva apaixonada da arquibancada',
    color: '#F97316',
    tailwindColor: 'orange',
    generateTake: (t) =>
      `"Cara, ${t} e o tipo de coisa que faz a gente levantar do sofa gritando! Na arquibancada, o sentimento e unanime: isso mexe com o coracao de todo torcedor de verdade!"`,
  },
  {
    id: 'correspondente',
    icon: '🌍',
    name: 'O Correspondente',
    description: 'Visao internacional e mercado',
    color: '#94A3B8',
    tailwindColor: 'slate',
    generateTake: (t) =>
      `"Do ponto de vista internacional, ${t} esta repercutindo nos principais veiculos europeus. O mercado esta de olho, e as implicacoes vao alem do que se discute no Brasil."`,
  },
]

// ============================================================
// Component
// ============================================================

export default function MesaRedondaPage() {
  const { pautas } = useStore()
  const [selectedPautaId, setSelectedPautaId] = useState<string>('')
  const [activeVoices, setActiveVoices] = useState<Set<string>>(new Set())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [debateStarted, setDebateStarted] = useState(false)

  const selectedPauta = pautas.find((p) => p.id === selectedPautaId)

  function toggleVoice(voiceId: string) {
    setActiveVoices((prev) => {
      const next = new Set(prev)
      if (next.has(voiceId)) {
        next.delete(voiceId)
      } else {
        next.add(voiceId)
      }
      return next
    })
  }

  function iniciarDebate() {
    setDebateStarted(true)
    setActiveVoices(new Set(VOICES.map((v) => v.id)))
  }

  function resetDebate() {
    setDebateStarted(false)
    setActiveVoices(new Set())
  }

  const allActive = activeVoices.size === VOICES.length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
          MESA REDONDA
        </h1>
        <p className="text-text-muted text-sm mt-1">Debate Editorial</p>
      </div>

      {/* Pauta Selector */}
      <div className="bg-surface border border-border rounded-lg p-5 lg:p-6">
        <div className="absolute-wrapper relative">
          <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-2 block">
            Selecionar Pauta para Debate
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-bg-primary border border-border-strong rounded-md px-4 py-3 text-left text-sm text-text-primary hover:border-purple/50 transition-all"
            >
              <span className={selectedPauta ? 'text-text-primary' : 'text-text-muted'}>
                {selectedPauta ? selectedPauta.titulo : 'Escolha uma pauta...'}
              </span>
              <ChevronDown
                size={16}
                className={`text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 w-full mt-1 bg-surface border border-border-strong rounded-md shadow-xl max-h-60 overflow-y-auto"
                >
                  {pautas.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-text-muted">
                      Nenhuma pauta disponivel
                    </div>
                  ) : (
                    pautas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPautaId(p.id)
                          setDropdownOpen(false)
                          resetDebate()
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple/10 transition-colors border-b border-border/30 last:border-b-0 ${
                          p.id === selectedPautaId
                            ? 'text-purple bg-purple/5'
                            : 'text-text-primary'
                        }`}
                      >
                        <div className="font-medium">{p.titulo}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-2">
                          <span className="uppercase">{p.status}</span>
                          {p.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-text-muted">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedPauta && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-bg-primary rounded-md border border-border"
            >
              <p className="text-sm text-text-secondary">{selectedPauta.descricao}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {selectedPauta.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-purple/10 text-purple border border-purple/15"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={iniciarDebate}
          disabled={!selectedPauta}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-ui text-[10px] font-semibold tracking-wider uppercase transition-all ${
            selectedPauta
              ? 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
              : 'bg-surface border border-border text-text-muted cursor-not-allowed'
          }`}
        >
          <Play size={14} />
          Iniciar Debate
        </button>
        {activeVoices.size > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={resetDebate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface border border-border-strong text-text-secondary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-red/50 hover:text-red transition-all"
          >
            Resetar Mesa
          </motion.button>
        )}
        <div className="ml-auto font-ui text-[9px] tracking-[2px] uppercase text-text-muted flex items-center gap-1.5">
          <Users size={12} />
          {activeVoices.size}/{VOICES.length} vozes ativas
        </div>
      </div>

      {/* Voices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VOICES.map((voice, index) => {
          const isActive = activeVoices.has(voice.id)

          return (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => selectedPauta && toggleVoice(voice.id)}
              className={`relative rounded-lg border p-4 transition-all ${
                selectedPauta ? 'cursor-pointer' : 'cursor-default opacity-60'
              } ${
                isActive
                  ? 'border-transparent bg-surface'
                  : 'border-border bg-surface hover:border-border-strong'
              }`}
              style={
                isActive
                  ? {
                      borderColor: voice.color,
                      boxShadow: `0 0 20px ${voice.color}20, 0 0 40px ${voice.color}10`,
                    }
                  : undefined
              }
            >
              {/* Glow overlay when active */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${voice.color}08 0%, transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10">
                {/* Voice Header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{voice.icon}</span>
                  <div>
                    <h3
                      className="font-ui text-[11px] font-bold tracking-wider uppercase"
                      style={isActive ? { color: voice.color } : undefined}
                    >
                      {voice.name}
                    </h3>
                    <p className="text-[10px] text-text-muted">{voice.description}</p>
                  </div>
                </div>

                {/* Active Indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: isActive ? voice.color : '#2A3040',
                      boxShadow: isActive ? `0 0 6px ${voice.color}` : 'none',
                    }}
                  />
                  <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">
                    {isActive ? 'No ar' : 'Aguardando'}
                  </span>
                </div>

                {/* Editorial Take */}
                <AnimatePresence>
                  {isActive && selectedPauta && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 pt-3 border-t text-[11px] leading-relaxed text-text-secondary italic"
                        style={{ borderColor: `${voice.color}30` }}
                      >
                        <MessageCircle
                          size={10}
                          className="inline mr-1 opacity-50"
                          style={{ color: voice.color }}
                        />
                        {voice.generateTake(selectedPauta.titulo)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Conclusao da Mesa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-border rounded-lg p-5 lg:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-purple" />
          <h2 className="font-ui text-[11px] font-bold tracking-wider uppercase text-purple">
            Conclusao da Mesa
          </h2>
        </div>

        {allActive && selectedPauta ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-text-secondary leading-relaxed">
              Apos ouvir todas as {VOICES.length} vozes editoriais sobre{' '}
              <span className="text-text-primary font-semibold">
                &ldquo;{selectedPauta.titulo}&rdquo;
              </span>
              , a mesa chegou a um consenso: esta pauta oferece multiplas camadas de
              exploracao editorial. O tom epico do Narrador, a precisao do Analista, a
              paixao do Torcedor e a visao global do Correspondente convergem para uma
              cobertura rica e diversificada.
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="flex -space-x-1">
                {VOICES.map((v) => (
                  <span
                    key={v.id}
                    className="text-xs"
                    title={v.name}
                  >
                    {v.icon}
                  </span>
                ))}
              </div>
              <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">
                Todas as vozes participaram
              </span>
            </div>
          </motion.div>
        ) : activeVoices.size > 0 && selectedPauta ? (
          <p className="text-sm text-text-muted">
            Ative todas as {VOICES.length} vozes para gerar a conclusao da mesa.
            Faltam {VOICES.length - activeVoices.size} vozes.
          </p>
        ) : (
          <p className="text-sm text-text-muted">
            Selecione uma pauta e ative as vozes editoriais para iniciar o debate.
            A conclusao sera gerada quando todas as vozes participarem.
          </p>
        )}
      </motion.div>

      {/* Footer */}
      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
          Simulacao editorial
        </span>
      </div>
    </div>
  )
}
