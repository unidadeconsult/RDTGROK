'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link as LinkIcon,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronDown,
  Users,
  Zap,
} from 'lucide-react'
import { useStore } from '@/lib/store'

// ============================================================
// Persona Definitions
// ============================================================

interface Persona {
  id: string
  emoji: string
  name: string
  description: string
  style: string
  accentClass: string
}

const PERSONAS: Persona[] = [
  {
    id: 'andre-henning',
    emoji: '🎙️',
    name: 'Andre Henning',
    description: 'Energia alta, narrativa de impacto',
    style: 'Energia alta, narrativa de impacto, emocao, entusiasmo, ritmo acelerado, valorizacao do grande momento',
    accentClass: 'text-cyan',
  },
  {
    id: 'ricardinho',
    emoji: '🤙',
    name: 'Ricardinho Martins',
    description: 'Conversa leve, resenha espontanea',
    style: 'Conversa leve, proximidade, opiniao espontanea, humor pontual, jeito de resenha',
    accentClass: 'text-green',
  },
  {
    id: 'vsr',
    emoji: '🧐',
    name: 'Vitor Sergio Rodrigues',
    description: 'Analitico, ironico, critico',
    style: 'Analitico, ironico, critico, contextual, inteligente, independente',
    accentClass: 'text-purple',
  },
  {
    id: 'leifert',
    emoji: '🎯',
    name: 'Tiago Leifert',
    description: 'Claro, rapido, didatico',
    style: 'Claro, rapido, didatico, espirituoso, objetivo, curioso',
    accentClass: 'text-gold',
  },
  {
    id: 'fred-caldeira',
    emoji: '📰',
    name: 'Fred Caldeira',
    description: 'Jornalistico, internacional',
    style: 'Jornalistico, informativo, internacional, contextual, equilibrado',
    accentClass: 'text-cyan',
  },
  {
    id: 'rafael-oliveira',
    emoji: '📐',
    name: 'Rafael Oliveira',
    description: 'Tecnico, didatico, profundo',
    style: 'Tecnico, didatico, profundo, calmo, preciso',
    accentClass: 'text-purple',
  },
  {
    id: 'fred-desimpedidos',
    emoji: '😂',
    name: 'Fred Desimpedidos',
    description: 'Extrovertido, irreverente, popular',
    style: 'Extrovertido, popular, irreverente, rapido, divertido, provocador leve',
    accentClass: 'text-gold',
  },
  {
    id: 'lineker',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    name: 'Gary Lineker',
    description: 'Elegante, ironico, sobrio',
    style: 'Elegante, inteligente, sobrio, ironico, experiente',
    accentClass: 'text-cyan',
  },
  {
    id: 'micah',
    emoji: '😄',
    name: 'Micah Richards',
    description: 'Entusiasmado, carismatico',
    style: 'Entusiasmado, espontaneo, carismatico, divertido, emocional',
    accentClass: 'text-green',
  },
  {
    id: 'zlatan',
    emoji: '🦁',
    name: 'Zlatan Ibrahimovic',
    description: 'Autoconfiante, provocador, teatral',
    style: 'Autoconfiante, provocador, dominante, teatral, direto, grandioso',
    accentClass: 'text-red',
  },
  {
    id: 'kevin-hart',
    emoji: '🤣',
    name: 'Kevin Hart',
    description: 'Hiperativo, comico, exagerado',
    style: 'Hiperativo, autodepreciativo, exagerado, observador, comico',
    accentClass: 'text-gold',
  },
  {
    id: 'carragher',
    emoji: '💪',
    name: 'Jamie Carragher',
    description: 'Combativo, direto, opinativo',
    style: 'Combativo, analitico, direto, opinativo, competitivo',
    accentClass: 'text-orange',
  },
  {
    id: 'mourinho',
    emoji: '🧠',
    name: 'Jose Mourinho',
    description: 'Estrategico, acido, calculista',
    style: 'Estrategico, acido, psicologico, provocador, calculista, confiante',
    accentClass: 'text-purple',
  },
  {
    id: 'klopp',
    emoji: '❤️',
    name: 'Jurgen Klopp',
    description: 'Apaixonado, intenso, otimista',
    style: 'Apaixonado, intenso, humano, coletivo, otimista, emocional',
    accentClass: 'text-red',
  },
  {
    id: 'de-bruyne',
    emoji: '⚡',
    name: 'Kevin De Bruyne',
    description: 'Pragmatico, focado, objetivo',
    style: 'Pragmatico, focado, tecnico, objetivo, pouca conversa, deixa o futebol falar',
    accentClass: 'text-cyan',
  },
]

// ============================================================
// Types
// ============================================================

type InputMode = 'url' | 'pauta'

interface PersonaResult {
  name: string
  text: string
}

// ============================================================
// Component
// ============================================================

export default function MesaRedondaPage() {
  const { pautas } = useStore()

  // Input state
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [url, setUrl] = useState('')
  const [selectedPautaId, setSelectedPautaId] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Processing state
  const [extracting, setExtracting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  // Results
  const [results, setResults] = useState<Map<string, string>>(new Map())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const selectedPauta = pautas.find((p) => p.id === selectedPautaId)
  const hasResults = results.size > 0
  const isProcessing = extracting || generating

  // ----------------------------------------------------------
  // Content source resolution
  // ----------------------------------------------------------

  const getContentForGeneration = useCallback(async (): Promise<string | null> => {
    if (inputMode === 'url') {
      if (!url.trim()) {
        setError('Cole uma URL para comecar.')
        return null
      }
      setExtracting(true)
      try {
        const extractRes = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() }),
        })
        const extractData = await extractRes.json()
        if (!extractRes.ok) {
          throw new Error(extractData.error || 'Falha ao extrair conteudo da URL')
        }
        return extractData.content as string
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao extrair URL'
        setError(msg)
        return null
      } finally {
        setExtracting(false)
      }
    }

    // Pauta mode
    if (!selectedPauta) {
      setError('Selecione uma pauta para continuar.')
      return null
    }
    return `Titulo: ${selectedPauta.titulo}\nDescricao: ${selectedPauta.descricao}\nTags: ${selectedPauta.tags.join(', ')}`
  }, [inputMode, url, selectedPauta])

  // ----------------------------------------------------------
  // Generation
  // ----------------------------------------------------------

  const handleGenerate = useCallback(async () => {
    const apiKey = localStorage.getItem('rdt-api-key')
    if (!apiKey) {
      setError('Configure sua API Key da OpenAI em Configuracoes antes de usar.')
      return
    }

    setError('')
    setResults(new Map())

    const content = await getContentForGeneration()
    if (!content) return

    setGenerating(true)
    try {
      const personaList = PERSONAS.map(
        (p) => `- ${p.name}: Estilo ${p.style}`
      ).join('\n')

      const systemPrompt = `Voce e um gerador de conteudo para redes sociais esportivas.
Voce recebera um conteudo (noticia, pauta ou assunto de futebol) e deve gerar uma postagem unica para CADA um dos 15 comentaristas/personalidades listados abaixo, cada um com seu estilo proprio.

PERSONALIDADES:
${personaList}

REGRAS OBRIGATORIAS:
- Cada postagem DEVE ter no MAXIMO 300 caracteres (contando espacos e emojis)
- Use portugues brasileiro (exceto para personalidades estrangeiras que podem misturar expressoes em ingles)
- Cada postagem deve refletir fielmente o estilo descrito da personalidade
- Inclua emojis quando apropriado ao estilo do personagem
- O texto deve funcionar como post pronto para redes sociais
- Personagens estrangeiros (Lineker, Micah, Zlatan, Kevin Hart, Carragher, Mourinho, Klopp, De Bruyne) devem escrever em portugues mas podem incluir expressoes tipicas de seus idiomas

Responda APENAS com um JSON valido no formato:
[{"name": "Nome Completo", "text": "texto do post"}]

Gere EXATAMENTE 15 itens, um para cada personalidade, na mesma ordem listada.
Nao inclua explicacoes, apenas o JSON.`

      const userPrompt = `Gere postagens para redes sociais sobre o seguinte conteudo:

${content.slice(0, 4000)}`

      const apiUrl =
        localStorage.getItem('rdt-api-url') ||
        'https://api.openai.com/v1/chat/completions'

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
            temperature: 0.9,
            max_tokens: 4000,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error?.message || data.error || 'Erro na API da OpenAI'
        )
      }

      const responseText = data.choices?.[0]?.message?.content || ''
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Resposta da IA nao contem resultados validos')
      }

      const generated: PersonaResult[] = JSON.parse(jsonMatch[0])
      const newResults = new Map<string, string>()

      generated.forEach((item) => {
        const persona = PERSONAS.find(
          (p) =>
            p.name.toLowerCase() === item.name.toLowerCase() ||
            item.name.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
        )
        if (persona) {
          newResults.set(persona.id, item.text)
        }
      })

      // Fallback: if matching by name failed for some, assign by order
      if (newResults.size < generated.length) {
        generated.forEach((item, index) => {
          if (index < PERSONAS.length) {
            const persona = PERSONAS[index]
            if (!newResults.has(persona.id)) {
              newResults.set(persona.id, item.text)
            }
          }
        })
      }

      setResults(newResults)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar conteudo'
      setError(msg)
    } finally {
      setGenerating(false)
    }
  }, [getContentForGeneration])

  // ----------------------------------------------------------
  // Copy handler
  // ----------------------------------------------------------

  const handleCopy = useCallback(async (text: string, personaId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(personaId)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  // ----------------------------------------------------------
  // Character count color
  // ----------------------------------------------------------

  function getCharColor(count: number): string {
    if (count > 300) return 'text-red'
    if (count > 270) return 'text-orange'
    return 'text-green'
  }

  // ----------------------------------------------------------
  // Can generate?
  // ----------------------------------------------------------

  const canGenerate =
    (inputMode === 'url' && url.trim().length > 0) ||
    (inputMode === 'pauta' && !!selectedPauta)

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
          MESA DE ABORDAGEM
        </h1>
        <p className="text-text-muted text-sm mt-1">
          15 personalidades analisam seu conteudo e geram posts prontos
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-surface border border-purple/20 rounded-lg p-5 lg:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-1 bg-bg-primary rounded-md p-1 w-fit">
            <button
              onClick={() => {
                setInputMode('url')
                setError('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-ui text-[10px] font-semibold tracking-wider uppercase transition-all ${
                inputMode === 'url'
                  ? 'gradient-bg text-white'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <LinkIcon size={12} />
              URL
            </button>
            <button
              onClick={() => {
                setInputMode('pauta')
                setError('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-ui text-[10px] font-semibold tracking-wider uppercase transition-all ${
                inputMode === 'pauta'
                  ? 'gradient-bg text-white'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Sparkles size={12} />
              Pauta
            </button>
          </div>

          {/* URL Input */}
          <AnimatePresence mode="wait">
            {inputMode === 'url' ? (
              <motion.div
                key="url-input"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                  URL da Noticia ou Conteudo
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canGenerate && handleGenerate()}
                      placeholder="https://..."
                      className="w-full bg-bg-primary border border-border-strong rounded-md pl-9 pr-3 py-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pauta-input"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                  Selecionar Pauta
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between bg-bg-primary border border-border-strong rounded-md px-4 py-3 text-left text-sm text-text-primary hover:border-purple/50 transition-all"
                  >
                    <span
                      className={
                        selectedPauta ? 'text-text-primary' : 'text-text-muted'
                      }
                    >
                      {selectedPauta
                        ? selectedPauta.titulo
                        : 'Escolha uma pauta...'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
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
                    <p className="text-sm text-text-secondary">
                      {selectedPauta.descricao}
                    </p>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isProcessing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-ui text-[10px] font-semibold tracking-wider uppercase transition-all ${
                canGenerate && !isProcessing
                  ? 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
                  : 'bg-surface border border-border text-text-muted cursor-not-allowed'
              }`}
            >
              {extracting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Extraindo...
                </>
              ) : generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Gerando
                  Abordagens...
                </>
              ) : (
                <>
                  <Zap size={14} /> Gerar Abordagens
                </>
              )}
            </button>

            {hasResults && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleGenerate}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-subtle border border-purple/20 text-text-primary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple/40 transition-all"
              >
                <RotateCcw size={14} className="text-purple" /> Gerar Novamente
              </motion.button>
            )}

            <div className="ml-auto font-ui text-[9px] tracking-[2px] uppercase text-text-muted flex items-center gap-1.5">
              <Users size={12} />
              {results.size}/{PERSONAS.length} abordagens
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-red/10 border border-red/20 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle size={16} className="text-red mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-red">{error}</p>
              {error.includes('API Key') && (
                <a
                  href="/configuracoes"
                  className="text-xs text-purple hover:text-cyan mt-1 inline-block"
                >
                  Ir para Configuracoes
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PERSONAS.map((persona, index) => {
          const resultText = results.get(persona.id)
          const hasResult = !!resultText
          const isCopied = copiedId === persona.id
          const charCount = resultText?.length || 0

          return (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`relative rounded-lg border p-4 transition-all ${
                hasResult
                  ? 'border-purple/30 bg-surface'
                  : 'border-border bg-surface hover:border-border-strong'
              }`}
            >
              {/* Glow effect when has result */}
              {hasResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at top, rgba(139,0,255,0.06) 0%, transparent 70%)',
                  }}
                />
              )}

              <div className="relative z-10">
                {/* Persona Header */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{persona.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-ui text-[11px] font-bold tracking-wider uppercase ${
                        hasResult ? persona.accentClass : 'text-text-primary'
                      }`}
                    >
                      {persona.name}
                    </h3>
                    <p className="text-[10px] text-text-muted truncate">
                      {persona.description}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      generating
                        ? 'bg-gold animate-pulse'
                        : hasResult
                          ? 'bg-green shadow-[0_0_6px_rgba(34,197,94,0.5)]'
                          : 'bg-[#2A3040]'
                    }`}
                  />
                  <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">
                    {generating
                      ? 'Analisando...'
                      : hasResult
                        ? 'Pronto'
                        : 'Aguardando'}
                  </span>
                </div>

                {/* Generated Content */}
                <AnimatePresence>
                  {hasResult && resultText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-purple/15">
                        <p className="text-[12px] leading-relaxed text-text-secondary whitespace-pre-wrap">
                          {resultText}
                        </p>

                        <div className="flex items-center justify-between mt-3 gap-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-stat text-[11px] font-bold ${getCharColor(charCount)}`}
                            >
                              {charCount}
                            </span>
                            <span className="text-[8px] text-text-muted">
                              / 300
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(resultText, persona.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded font-ui text-[9px] font-semibold tracking-wider uppercase transition-all ${
                              isCopied
                                ? 'bg-green/10 text-green border border-green/20'
                                : 'border border-border-strong text-text-muted hover:border-cyan hover:text-cyan'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check size={10} /> Copiado
                              </>
                            ) : (
                              <>
                                <Copy size={10} /> Copiar
                              </>
                            )}
                          </button>
                        </div>

                        {/* Character bar */}
                        <div className="w-full bg-bg-primary rounded-full h-1 overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full transition-all ${
                              charCount > 300
                                ? 'bg-red'
                                : charCount > 270
                                  ? 'bg-orange'
                                  : 'bg-green'
                            }`}
                            style={{
                              width: `${Math.min((charCount / 300) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {!hasResults && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full gradient-subtle flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-purple" />
          </div>
          <h3 className="font-display text-lg tracking-wider text-text-secondary mb-2">
            Como Funciona
          </h3>
          <div className="max-w-md mx-auto space-y-3 text-sm text-text-muted">
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">1</span>
              <span>Cole uma URL ou selecione uma pauta</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">2</span>
              <span>Clique em &ldquo;Gerar Abordagens&rdquo;</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">3</span>
              <span>15 personalidades geram posts unicos</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">4</span>
              <span>Copie e publique os melhores</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
          Mesa de Abordagem — {PERSONAS.length} Personalidades
        </span>
      </div>
    </div>
  )
}
