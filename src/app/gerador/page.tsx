'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link as LinkIcon, Sparkles, Copy, Check, RotateCcw,
  Loader2, AlertCircle, MessageCircle, AtSign, Camera,
  Hash, ChevronDown, Send,
} from 'lucide-react';

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter / X', icon: AtSign, maxChars: 280 },
  { id: 'instagram', label: 'Instagram', icon: Camera, maxChars: 300 },
  { id: 'threads', label: 'Threads', icon: MessageCircle, maxChars: 300 },
  { id: 'whatsapp', label: 'WhatsApp Status', icon: Send, maxChars: 250 },
];

const TONES = [
  { id: 'informativo', label: 'Informativo' },
  { id: 'provocador', label: 'Provocador' },
  { id: 'emocional', label: 'Emocional' },
  { id: 'humor', label: 'Com Humor' },
  { id: 'analitico', label: 'Analitico' },
];

interface GeneratedPost {
  platform: string;
  text: string;
  charCount: number;
}

export default function GeradorPage() {
  const [url, setUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(['twitter', 'instagram']));
  const [selectedTone, setSelectedTone] = useState('informativo');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function togglePlatform(id: string) {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleGenerate() {
    if (!url.trim()) {
      setError('Cole uma URL para comecar.');
      return;
    }

    const apiKey = localStorage.getItem('rdt-api-key');
    if (!apiKey) {
      setError('Configure sua API Key da OpenAI em Configuracoes antes de usar o gerador.');
      return;
    }

    setError('');
    setPosts([]);
    setExtractedContent('');

    setExtracting(true);
    let content = '';
    try {
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok) {
        throw new Error(extractData.error || 'Falha ao extrair conteudo da URL');
      }
      content = extractData.content;
      setExtractedContent(content.slice(0, 500) + (content.length > 500 ? '...' : ''));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao extrair URL';
      setError(msg);
      setExtracting(false);
      return;
    }
    setExtracting(false);

    setLoading(true);
    try {
      const platforms = PLATFORMS.filter(p => selectedPlatforms.has(p.id));
      const platformList = platforms.map(p => `- ${p.label} (maximo ${p.maxChars} caracteres)`).join('\n');

      const systemPrompt = `Voce e um especialista em criacao de conteudo para redes sociais de futebol brasileiro.
Seu trabalho e criar posts curtos, impactantes e prontos para publicar.

REGRAS OBRIGATORIAS:
- Cada post DEVE ter no MAXIMO o limite de caracteres da plataforma (contando espacos e emojis)
- Use portugues brasileiro coloquial
- Inclua emojis relevantes quando apropriado
- Hashtags contam nos caracteres
- Foque no que e mais interessante/impactante da noticia
- Tom: ${selectedTone}
${customInstructions ? `- Instrucoes adicionais: ${customInstructions}` : ''}

Gere EXATAMENTE 2 opcoes de post para CADA plataforma solicitada.

Responda APENAS com um JSON valido no formato:
[{"platform": "nome da plataforma", "text": "texto do post"}]

Nao inclua explicacoes, apenas o JSON.`;

      const userPrompt = `Crie posts para as seguintes plataformas:
${platformList}

Baseado neste conteudo:
${content.slice(0, 4000)}`;

      const apiUrl = localStorage.getItem('rdt-api-url') || 'https://api.openai.com/v1/chat/completions';

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
            temperature: 0.8,
            max_tokens: 2000,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Erro na API da OpenAI');
      }

      const responseText = data.choices?.[0]?.message?.content || '';
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Resposta da IA nao contem posts validos');
      }

      const generated: { platform: string; text: string }[] = JSON.parse(jsonMatch[0]);
      const formattedPosts: GeneratedPost[] = generated.map(g => ({
        platform: g.platform,
        text: g.text,
        charCount: g.text.length,
      }));

      setPosts(formattedPosts);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar conteudo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleReset() {
    setUrl('');
    setPosts([]);
    setError('');
    setExtractedContent('');
    inputRef.current?.focus();
  }

  function getPlatformIcon(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes('twitter') || lower.includes('x')) return AtSign;
    if (lower.includes('instagram')) return Camera;
    if (lower.includes('thread')) return MessageCircle;
    if (lower.includes('whatsapp')) return Send;
    return Hash;
  }

  function getCharColor(count: number, platform: string) {
    const plat = PLATFORMS.find(p => platform.toLowerCase().includes(p.id));
    const max = plat?.maxChars || 300;
    if (count > max) return 'text-red';
    if (count > max * 0.9) return 'text-orange';
    return 'text-green';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">GERADOR DE CONTEUDO</h1>
        <p className="text-text-muted text-sm mt-1">Cole a URL, gere posts prontos para redes sociais.</p>
      </div>

      <div className="bg-surface border border-purple/20 rounded-lg p-5 lg:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />

        <div className="space-y-4">
          <div>
            <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
              URL da Noticia ou Conteudo
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  ref={inputRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                  placeholder="https://..."
                  className="w-full bg-bg-primary border border-border-strong rounded-md pl-9 pr-3 py-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
                  autoFocus
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || extracting}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-ui text-[10px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  loading || extracting
                    ? 'bg-surface border border-border text-text-muted cursor-wait'
                    : 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
                }`}
              >
                {extracting ? (
                  <><Loader2 size={14} className="animate-spin" /> Extraindo...</>
                ) : loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Gerando...</>
                ) : (
                  <><Sparkles size={14} /> Gerar Posts</>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-2 block">
              Plataformas
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => {
                const Icon = p.icon;
                const active = selectedPlatforms.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-[9px] font-semibold tracking-wider uppercase border transition-all ${
                      active
                        ? 'gradient-bg text-white border-transparent'
                        : 'border-border-strong text-text-muted hover:border-purple hover:text-text-primary'
                    }`}
                  >
                    <Icon size={12} />
                    {p.label}
                    <span className="text-[8px] opacity-70">{p.maxChars}c</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-2 block">
              Tom
            </label>
            <div className="flex gap-2 flex-wrap">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className={`px-3 py-1.5 rounded-md font-ui text-[9px] font-semibold tracking-wider uppercase border transition-all ${
                    selectedTone === t.id
                      ? 'gradient-bg text-white border-transparent'
                      : 'border-border-strong text-text-muted hover:border-purple hover:text-text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary font-ui text-[9px] tracking-wider uppercase transition-colors"
          >
            <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Instrucoes adicionais
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <textarea
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Foque no Flamengo, use girias cariocas, mencione @resenhadatorcida..."
                  rows={2}
                  className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple transition-all resize-none placeholder:text-text-muted"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
                <a href="/configuracoes" className="text-xs text-purple hover:text-cyan mt-1 inline-block">
                  Ir para Configuracoes
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {extractedContent && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon size={12} className="text-cyan" />
            <span className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-cyan">Conteudo Extraido</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{extractedContent}</p>
        </motion.div>
      )}

      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-purple" />
              <h2 className="font-ui text-[11px] font-bold tracking-wider uppercase text-text-primary">
                {posts.length} Posts Gerados
              </h2>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-strong text-text-muted font-ui text-[9px] font-semibold tracking-wider uppercase hover:border-purple hover:text-purple transition-all"
            >
              <RotateCcw size={12} /> Nova URL
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {posts.map((post, i) => {
              const PlatIcon = getPlatformIcon(post.platform);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-surface border border-border rounded-lg p-4 hover:border-purple/25 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <PlatIcon size={14} className="text-purple" />
                      <span className="font-ui text-[9px] font-semibold tracking-wider uppercase text-text-muted">
                        {post.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-stat text-xs font-bold ${getCharColor(post.charCount, post.platform)}`}>
                        {post.charCount}
                      </span>
                      <span className="text-[9px] text-text-muted">chars</span>
                    </div>
                  </div>

                  <p className="text-sm text-text-primary leading-relaxed mb-3 whitespace-pre-wrap">
                    {post.text}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="w-full bg-bg-primary rounded-full h-1.5 overflow-hidden flex-1 mr-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          post.charCount > 300 ? 'bg-red' : post.charCount > 270 ? 'bg-orange' : 'bg-green'
                        }`}
                        style={{ width: `${Math.min((post.charCount / 300) * 100, 100)}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleCopy(post.text, i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-[9px] font-semibold tracking-wider uppercase transition-all shrink-0 ${
                        copiedIndex === i
                          ? 'bg-green/10 text-green border border-green/20'
                          : 'border border-border-strong text-text-muted hover:border-cyan hover:text-cyan'
                      }`}
                    >
                      {copiedIndex === i ? (
                        <><Check size={12} /> Copiado</>
                      ) : (
                        <><Copy size={12} /> Copiar</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md gradient-subtle border border-purple/20 text-text-primary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple/40 transition-all"
            >
              <RotateCcw size={14} className="text-purple" /> Gerar Novamente
            </button>
          </div>
        </motion.div>
      )}

      {!posts.length && !loading && !extracting && (
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full gradient-subtle flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-purple" />
          </div>
          <h3 className="font-display text-lg tracking-wider text-text-secondary mb-2">Como Funciona</h3>
          <div className="max-w-md mx-auto space-y-3 text-sm text-text-muted">
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">1</span>
              <span>Cole a URL de uma noticia ou artigo</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">2</span>
              <span>Escolha as plataformas e o tom</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">3</span>
              <span>A IA gera posts com ate 300 caracteres</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border">
              <span className="font-stat text-lg font-bold text-purple">4</span>
              <span>Copie e publique nas suas redes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
