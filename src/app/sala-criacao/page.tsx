'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  ChevronRight,
  Plus,
  X,
  Check,
  Trash2,
  Star,
  Sparkles,
  MessageCircleQuestion,
  Layers,
  Search,
  Brain,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Angulo, AnguloDeTipo } from '@/lib/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PERGUNTAS_EDITORIAIS = [
  'O que torna isso relevante agora?',
  'Qual emocao queremos provocar?',
  'Existe um angulo que ninguem explorou?',
  'Qual formato melhor conta essa historia?',
  'Para qual torcida isso importa mais?',
  'Como desdobrar em mais conteudos?',
]

const TIPO_COLORS: Record<AnguloDeTipo, string> = {
  jornalistico: 'bg-cyan/15 text-cyan border-cyan/20',
  analitico: 'bg-blue/15 text-blue border-blue/20',
  tatico: 'bg-green/15 text-green border-green/20',
  provocador: 'bg-red/15 text-red border-red/20',
  emocional: 'bg-purple/15 text-purple border-purple/20',
  historico: 'bg-gold/15 text-gold border-gold/20',
  humor: 'bg-orange/15 text-orange border-orange/20',
  torcedor: 'bg-green/15 text-green border-green/20',
  contraponto: 'bg-red/15 text-red border-red/20',
  curiosidade: 'bg-cyan/15 text-cyan border-cyan/20',
  personagem: 'bg-purple/15 text-purple border-purple/20',
  dados: 'bg-blue/15 text-blue border-blue/20',
  pergunta: 'bg-gold/15 text-gold border-gold/20',
  comparacao: 'bg-orange/15 text-orange border-orange/20',
  storytelling: 'bg-purple/15 text-purple border-purple/20',
}

const TIPO_OPTIONS: AnguloDeTipo[] = [
  'jornalistico',
  'analitico',
  'tatico',
  'provocador',
  'emocional',
  'historico',
  'humor',
  'torcedor',
  'contraponto',
  'curiosidade',
  'personagem',
  'dados',
  'pergunta',
  'comparacao',
  'storytelling',
]

const EMPTY_ANGULO_FORM = {
  tipo: 'jornalistico' as AnguloDeTipo,
  titulo: '',
  resumo: '',
  porqueFunciona: '',
  formatos: '',
  plataformas: '',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getOverallColor(score: number): string {
  if (score >= 95) return 'text-gold'
  if (score >= 88) return 'text-green'
  if (score >= 78) return 'text-blue'
  if (score >= 68) return 'text-purple'
  if (score >= 55) return 'text-orange'
  return 'text-red'
}

function getOverallLabel(score: number): string {
  if (score >= 95) return 'BOLA DE OURO'
  if (score >= 88) return 'PAUTA TITULAR'
  if (score >= 78) return 'OTIMA OPCAO'
  if (score >= 68) return 'BOA PAUTA'
  if (score >= 55) return 'BANCO'
  if (score >= 40) return 'BASE'
  return 'OBSERVACAO'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SalaCriacaoPage() {
  const { pautas, addAngulo, updateAngulo, deleteAngulo } = useStore()

  const [selectedPautaId, setSelectedPautaId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewAngulo, setShowNewAngulo] = useState(false)
  const [newAngulo, setNewAngulo] = useState(EMPTY_ANGULO_FORM)
  const [showMotivational, setShowMotivational] = useState(false)
  const [suggestingAngulos, setSuggestingAngulos] = useState(false)
  const [suggestError, setSuggestError] = useState('')

  const selectedPauta = useMemo(
    () => pautas.find((p) => p.id === selectedPautaId) ?? null,
    [pautas, selectedPautaId]
  )

  const filteredPautas = useMemo(() => {
    if (!searchQuery.trim()) return pautas
    const q = searchQuery.toLowerCase()
    return pautas.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.clube && p.clube.toLowerCase().includes(q))
    )
  }, [pautas, searchQuery])

  // --- Handlers ---

  function handleAddAngulo() {
    if (!selectedPautaId || !newAngulo.titulo.trim()) return
    addAngulo(selectedPautaId, {
      tipo: newAngulo.tipo,
      titulo: newAngulo.titulo.trim(),
      resumo: newAngulo.resumo.trim(),
      porqueFunciona: newAngulo.porqueFunciona.trim(),
      formatos: newAngulo.formatos
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      plataformas: newAngulo.plataformas
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      favorito: false,
      aprovado: false,
      descartado: false,
    })
    setNewAngulo(EMPTY_ANGULO_FORM)
    setShowNewAngulo(false)
  }

  function handleApproveAngulo(angulo: Angulo) {
    if (!selectedPautaId) return
    updateAngulo(selectedPautaId, angulo.id, {
      aprovado: !angulo.aprovado,
      descartado: false,
    })
  }

  function handleDiscardAngulo(angulo: Angulo) {
    if (!selectedPautaId) return
    updateAngulo(selectedPautaId, angulo.id, {
      descartado: !angulo.descartado,
      aprovado: false,
    })
  }

  function handleDeleteAngulo(anguloId: string) {
    if (!selectedPautaId) return
    deleteAngulo(selectedPautaId, anguloId)
  }

  async function handleSugerirAngulos() {
    if (!selectedPauta || !selectedPautaId) return
    const apiKey = localStorage.getItem('rdt-api-key')
    if (!apiKey) {
      setSuggestError('Configure sua API Key em Configuracoes.')
      return
    }
    setSuggestError('')
    setSuggestingAngulos(true)
    try {
      const apiUrl = localStorage.getItem('rdt-api-url') || 'https://api.openai.com/v1/chat/completions'
      const existingAngulos = selectedPauta.angulos.length > 0
        ? `\nAngulos ja existentes (NAO repita):\n${selectedPauta.angulos.map(a => `- ${a.tipo}: ${a.titulo}`).join('\n')}`
        : ''

      const systemPrompt = `Voce e um editor de conteudo esportivo criativo. Sua funcao e sugerir angulos editoriais unicos para pautas de futebol.

Os tipos de angulo disponiveis sao: jornalistico, analitico, tatico, provocador, emocional, historico, humor, torcedor, contraponto, curiosidade, personagem, dados, pergunta, comparacao, storytelling.

Responda APENAS com um JSON valido no formato:
[{"tipo": "tipo_do_angulo", "titulo": "titulo curto", "resumo": "explicacao em 1-2 frases", "porqueFunciona": "razao curta", "formatos": ["formato1", "formato2"], "plataformas": ["plataforma1"]}]

Gere entre 5 e 8 angulos criativos e variados. Nao repita tipos. Use portugues brasileiro.`

      const userPrompt = `Sugira angulos editoriais para esta pauta:

Titulo: ${selectedPauta.titulo}
Descricao: ${selectedPauta.descricao}
Tags: ${selectedPauta.tags.join(', ')}
${selectedPauta.clube ? `Clube: ${selectedPauta.clube}` : ''}
${selectedPauta.competicao ? `Competicao: ${selectedPauta.competicao}` : ''}${existingAngulos}`

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl,
          apiKey,
          provider: 'openai',
          body: {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.85,
            max_tokens: 3000,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || data.error || 'Erro na API')

      const responseText = data.choices?.[0]?.message?.content || ''
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('Resposta da IA invalida')

      const suggestions: {
        tipo: string
        titulo: string
        resumo: string
        porqueFunciona: string
        formatos: string[]
        plataformas: string[]
      }[] = JSON.parse(jsonMatch[0])

      for (const s of suggestions) {
        const tipo = TIPO_OPTIONS.includes(s.tipo as AnguloDeTipo)
          ? (s.tipo as AnguloDeTipo)
          : 'jornalistico'
        addAngulo(selectedPautaId, {
          tipo,
          titulo: s.titulo,
          resumo: s.resumo,
          porqueFunciona: s.porqueFunciona || '',
          formatos: Array.isArray(s.formatos) ? s.formatos : [],
          plataformas: Array.isArray(s.plataformas) ? s.plataformas : [],
          favorito: false,
          aprovado: false,
          descartado: false,
        })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao sugerir angulos'
      setSuggestError(msg)
    } finally {
      setSuggestingAngulos(false)
    }
  }

  // --- Render ---

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
          SALA DE CRIACAO
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Brainstorming & Desenvolvimento
        </p>
      </div>

      {/* Main layout: left panel + right panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ============================================================ */}
        {/* LEFT PANEL - Pauta list */}
        {/* ============================================================ */}
        <div className="w-full lg:w-[340px] lg:min-w-[300px] shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-ui text-[10px] font-bold tracking-[2px] uppercase text-text-secondary">
              Pautas
            </h2>
            <span className="font-ui text-[9px] tracking-wider text-text-muted">
              {filteredPautas.length} itens
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pautas..."
              className="w-full bg-bg-primary border border-border-strong rounded-md pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
            />
          </div>

          {/* Pauta cards */}
          <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
            {filteredPautas.map((pauta) => (
              <motion.button
                key={pauta.id}
                layout
                onClick={() => {
                  setSelectedPautaId(pauta.id)
                  setShowNewAngulo(false)
                  setShowMotivational(false)
                }}
                className={`w-full text-left bg-surface border rounded-lg p-3.5 transition-all hover:shadow-lg hover:shadow-purple/5 group ${
                  selectedPautaId === pauta.id
                    ? 'border-purple/40 glow-purple'
                    : 'border-border hover:border-purple/25'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className={`font-stat text-lg font-bold leading-none ${getOverallColor(
                          pauta.overall
                        )}`}
                      >
                        {pauta.overall}
                      </span>
                      <span className="font-ui text-[8px] tracking-wider text-text-muted">
                        {getOverallLabel(pauta.overall)}
                      </span>
                      {pauta.favorita && (
                        <Star
                          size={10}
                          className="text-gold"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                      {pauta.titulo}
                    </h3>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {pauta.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                      {pauta.tags.length > 3 && (
                        <span className="text-[8px] text-text-muted">
                          +{pauta.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-text-muted font-ui tracking-wider">
                        {pauta.angulos.length} angulos
                      </span>
                      {pauta.clube && (
                        <span className="text-[9px] text-text-muted">
                          {pauta.clube}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`mt-1 shrink-0 transition-colors ${
                      selectedPautaId === pauta.id
                        ? 'text-purple'
                        : 'text-text-muted group-hover:text-text-secondary'
                    }`}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL - Brainstorming workspace */}
        {/* ============================================================ */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!selectedPauta ? (
              /* ---------- Empty state ---------- */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full gradient-subtle flex items-center justify-center mb-6">
                  <Brain size={36} className="text-purple" />
                </div>
                <h3 className="font-display text-xl tracking-wider text-text-secondary mb-2">
                  Selecione uma pauta para comecar o brainstorming
                </h3>
                <p className="text-text-muted text-sm max-w-md">
                  Escolha uma pauta no painel ao lado para explorar angulos,
                  responder perguntas editoriais e desenvolver ideias.
                </p>
              </motion.div>
            ) : (
              /* ---------- Workspace ---------- */
              <motion.div
                key={selectedPauta.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* --- Pauta Details --- */}
                <div className="bg-surface border border-border rounded-lg p-5 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`font-stat text-2xl font-bold leading-none ${getOverallColor(
                            selectedPauta.overall
                          )}`}
                        >
                          {selectedPauta.overall}
                        </span>
                        <span
                          className={`font-ui text-[9px] tracking-wider font-bold ${getOverallColor(
                            selectedPauta.overall
                          )}`}
                        >
                          {getOverallLabel(selectedPauta.overall)}
                        </span>
                        {selectedPauta.favorita && (
                          <Star
                            size={14}
                            className="text-gold"
                            fill="currentColor"
                          />
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-text-primary leading-snug mb-1.5">
                        {selectedPauta.titulo}
                      </h2>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {selectedPauta.descricao}
                      </p>
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {selectedPauta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-ui tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Perguntas Editoriais --- */}
                <div className="bg-surface border border-border rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircleQuestion size={16} className="text-cyan" />
                    <h3 className="font-ui text-[10px] font-bold tracking-[2px] uppercase text-cyan">
                      Perguntas Editoriais
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PERGUNTAS_EDITORIAIS.map((pergunta, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-bg-primary border border-border-strong rounded-md p-3 hover:border-cyan/25 transition-all"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-stat text-sm font-bold text-cyan/60 mt-0.5 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-sm text-text-secondary leading-snug">
                            {pergunta}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* --- Angulos Gerados --- */}
                <div className="bg-surface border border-border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-purple" />
                      <h3 className="font-ui text-[10px] font-bold tracking-[2px] uppercase text-purple">
                        Angulos Gerados
                      </h3>
                      <span className="font-ui text-[9px] tracking-wider text-text-muted">
                        ({selectedPauta.angulos.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSugerirAngulos}
                        disabled={suggestingAngulos}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-[9px] font-semibold tracking-wider uppercase transition-all ${
                          suggestingAngulos
                            ? 'bg-surface border border-border text-text-muted cursor-wait'
                            : 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
                        }`}
                      >
                        {suggestingAngulos ? (
                          <><Loader2 size={12} className="animate-spin" /> Gerando...</>
                        ) : (
                          <><Zap size={12} /> Sugerir com IA</>
                        )}
                      </button>
                      <button
                        onClick={() => setShowNewAngulo(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-strong text-text-secondary font-ui text-[9px] font-semibold tracking-wider uppercase hover:border-purple hover:text-purple transition-all"
                      >
                        <Plus size={12} /> Manual
                      </button>
                    </div>
                  </div>

                  {/* Suggest error */}
                  <AnimatePresence>
                    {suggestError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-red/10 border border-red/20 rounded-md p-3 flex items-start gap-2 mb-4"
                      >
                        <AlertCircle size={14} className="text-red mt-0.5 shrink-0" />
                        <p className="text-xs text-red">{suggestError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* New angulo form */}
                  <AnimatePresence>
                    {showNewAngulo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="bg-bg-primary border border-purple/20 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-ui text-[9px] font-bold tracking-[1.5px] uppercase text-purple">
                              Adicionar Angulo
                            </h4>
                            <button
                              onClick={() => setShowNewAngulo(false)}
                              className="text-text-muted hover:text-text-primary"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <select
                              value={newAngulo.tipo}
                              onChange={(e) =>
                                setNewAngulo((p) => ({
                                  ...p,
                                  tipo: e.target.value as AnguloDeTipo,
                                }))
                              }
                              className="bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all"
                            >
                              {TIPO_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                  {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                              ))}
                            </select>
                            <input
                              value={newAngulo.titulo}
                              onChange={(e) =>
                                setNewAngulo((p) => ({
                                  ...p,
                                  titulo: e.target.value,
                                }))
                              }
                              placeholder="Titulo do angulo *"
                              className="bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                            />
                          </div>
                          <textarea
                            value={newAngulo.resumo}
                            onChange={(e) =>
                              setNewAngulo((p) => ({
                                ...p,
                                resumo: e.target.value,
                              }))
                            }
                            placeholder="Resumo do angulo"
                            rows={2}
                            className="w-full bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all resize-none placeholder:text-text-muted"
                          />
                          <input
                            value={newAngulo.porqueFunciona}
                            onChange={(e) =>
                              setNewAngulo((p) => ({
                                ...p,
                                porqueFunciona: e.target.value,
                              }))
                            }
                            placeholder="Por que funciona?"
                            className="w-full bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              value={newAngulo.formatos}
                              onChange={(e) =>
                                setNewAngulo((p) => ({
                                  ...p,
                                  formatos: e.target.value,
                                }))
                              }
                              placeholder="Formatos (separar por virgula)"
                              className="bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                            />
                            <input
                              value={newAngulo.plataformas}
                              onChange={(e) =>
                                setNewAngulo((p) => ({
                                  ...p,
                                  plataformas: e.target.value,
                                }))
                              }
                              placeholder="Plataformas (separar por virgula)"
                              className="bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                            />
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button
                              onClick={handleAddAngulo}
                              className="flex-1 py-2 rounded-md gradient-bg text-white font-ui text-[9px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
                            >
                              Salvar Angulo
                            </button>
                            <button
                              onClick={() => {
                                setShowNewAngulo(false)
                                setNewAngulo(EMPTY_ANGULO_FORM)
                              }}
                              className="px-5 py-2 rounded-md bg-surface border border-border-strong text-text-secondary font-ui text-[9px] font-semibold tracking-wider uppercase hover:border-purple transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Angulo cards */}
                  {selectedPauta.angulos.length === 0 && !showNewAngulo ? (
                    <p className="text-sm text-text-muted text-center py-6">
                      Nenhum angulo gerado ainda. Clique em &quot;Novo
                      Angulo&quot; para comecar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {selectedPauta.angulos.map((angulo, i) => (
                          <motion.div
                            key={angulo.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ delay: i * 0.04 }}
                            className={`bg-bg-primary border rounded-lg p-4 transition-all ${
                              angulo.descartado
                                ? 'border-red/15 opacity-50'
                                : angulo.aprovado
                                  ? 'border-green/25'
                                  : 'border-border-strong hover:border-purple/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                {/* Tipo badge + title */}
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <span
                                    className={`font-ui text-[8px] tracking-wider px-2 py-0.5 rounded border ${
                                      TIPO_COLORS[angulo.tipo]
                                    }`}
                                  >
                                    {angulo.tipo}
                                  </span>
                                  {angulo.aprovado && (
                                    <span className="font-ui text-[8px] tracking-wider px-2 py-0.5 rounded bg-green/10 text-green border border-green/15">
                                      Aprovado
                                    </span>
                                  )}
                                  {angulo.descartado && (
                                    <span className="font-ui text-[8px] tracking-wider px-2 py-0.5 rounded bg-red/10 text-red border border-red/15">
                                      Descartado
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-semibold text-text-primary mb-1">
                                  {angulo.titulo}
                                </h4>
                                {angulo.resumo && (
                                  <p className="text-[13px] text-text-secondary leading-relaxed mb-2">
                                    {angulo.resumo}
                                  </p>
                                )}

                                {/* Formatos chips */}
                                {angulo.formatos.length > 0 && (
                                  <div className="flex gap-1.5 flex-wrap">
                                    {angulo.formatos.map((f) => (
                                      <span
                                        key={f}
                                        className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-surface text-text-muted border border-border"
                                      >
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleApproveAngulo(angulo)}
                                  title={
                                    angulo.aprovado
                                      ? 'Remover aprovacao'
                                      : 'Aprovar'
                                  }
                                  className={`p-1.5 rounded border transition-all ${
                                    angulo.aprovado
                                      ? 'border-green/30 text-green bg-green/10'
                                      : 'border-border text-text-muted hover:border-green hover:text-green'
                                  }`}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => handleDiscardAngulo(angulo)}
                                  title={
                                    angulo.descartado
                                      ? 'Restaurar'
                                      : 'Descartar'
                                  }
                                  className={`p-1.5 rounded border transition-all ${
                                    angulo.descartado
                                      ? 'border-red/30 text-red bg-red/10'
                                      : 'border-border text-text-muted hover:border-red hover:text-red'
                                  }`}
                                >
                                  <X size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteAngulo(angulo.id)
                                  }
                                  title="Excluir"
                                  className="p-1.5 rounded border border-border text-text-muted hover:border-red hover:text-red transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* --- Pensar Comigo button --- */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMotivational((v) => !v)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-subtle border border-purple/20 text-text-primary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple/40 hover:shadow-lg hover:shadow-purple/10 transition-all"
                  >
                    <Sparkles size={14} className="text-purple" /> Pensar Comigo
                  </button>
                </div>

                <AnimatePresence>
                  {showMotivational && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-surface border border-purple/20 rounded-lg p-5 relative"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full gradient-subtle flex items-center justify-center shrink-0">
                          <Lightbulb size={20} className="text-gold" />
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-medium italic leading-relaxed">
                            &quot;A melhor pauta nasce da pergunta certa.&quot;
                          </p>
                          <p className="text-text-muted text-xs mt-2">
                            Explore as perguntas editoriais acima, considere
                            diferentes angulos e pense em como cada formato pode
                            amplificar a historia que voce quer contar.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
