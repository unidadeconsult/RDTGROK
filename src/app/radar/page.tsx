'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Eye, AlertTriangle, Plus, X, Loader2,
  Link as LinkIcon, Zap, AlertCircle, Trash2,
  RefreshCw, Rss, Clock, Check, ExternalLink,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import type { CategoriaRadar } from '@/lib/types';

// ============================================================
// Types
// ============================================================

interface FonteMonitorada {
  id: string;
  nome: string;
  url: string;
  criadaEm: string;
  ultimaVerificacao: string | null;
}

interface ScanResult {
  assunto: string;
  categoria: CategoriaRadar;
  tags: string[];
  fonteId?: string;
}

// ============================================================
// Constants
// ============================================================

const FONTES_KEY = 'rdt-radar-fontes';

const categoriaConfig: Record<CategoriaRadar, { label: string; emoji: string; color: string; borderColor: string; bgColor: string }> = {
  explodindo: { label: 'Explodindo', emoji: '🔥', color: 'text-red', borderColor: 'border-red/30', bgColor: 'bg-red/10' },
  crescendo: { label: 'Crescendo', emoji: '📈', color: 'text-orange', borderColor: 'border-orange/30', bgColor: 'bg-orange/10' },
  monitorar: { label: 'Monitorar', emoji: '👁️', color: 'text-cyan', borderColor: 'border-cyan/30', bgColor: 'bg-cyan/10' },
  estavel: { label: 'Estavel', emoji: '✅', color: 'text-green', borderColor: 'border-green/30', bgColor: 'bg-green/10' },
  esfriando: { label: 'Esfriando', emoji: '❄️', color: 'text-text-muted', borderColor: 'border-border', bgColor: 'bg-surface' },
};

const categoriaOrder: CategoriaRadar[] = ['explodindo', 'crescendo', 'monitorar', 'estavel', 'esfriando'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const SUGGESTED_FONTES = [
  { nome: 'ge.globo.com', url: 'https://ge.globo.com/' },
  { nome: 'ESPN Brasil', url: 'https://www.espn.com.br/futebol/' },
  { nome: 'UOL Esporte', url: 'https://www.uol.com.br/esporte/futebol/' },
  { nome: 'TNT Sports', url: 'https://www.tntsports.com.br/' },
  { nome: 'Trivela', url: 'https://trivela.com.br/' },
];

// ============================================================
// Helpers
// ============================================================

function loadFontes(): FonteMonitorada[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FONTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveFontes(fontes: FonteMonitorada[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FONTES_KEY, JSON.stringify(fontes));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function scanSingleUrl(url: string, apiKey: string, apiUrl: string): Promise<ScanResult[]> {
  const extractRes = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const extractData = await extractRes.json();
  if (!extractRes.ok) throw new Error(extractData.error || 'Falha ao extrair conteudo');

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
          {
            role: 'system',
            content: `Voce e um editor de conteudo esportivo. Analise o conteudo de uma pagina web e identifique topicos/assuntos que podem virar pautas de futebol.

Para cada topico, classifique como: explodindo (assunto viral/urgente), crescendo (ganhando tracao), monitorar (vale acompanhar), estavel (assunto constante), esfriando (perdendo relevancia).

Responda APENAS com JSON valido:
[{"assunto": "descricao curta do topico", "categoria": "classificacao", "tags": ["tag1", "tag2"]}]

Identifique entre 3 e 8 topicos relevantes. Use portugues brasileiro.`,
          },
          { role: 'user', content: `Analise este conteudo e identifique topicos para o radar:\n\n${extractData.content.slice(0, 4000)}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.error || 'Erro na API');

  const responseText = data.choices?.[0]?.message?.content || '';
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Resposta da IA invalida');

  const topics: { assunto: string; categoria: string; tags: string[] }[] = JSON.parse(jsonMatch[0]);
  return topics.map(t => ({
    assunto: t.assunto,
    categoria: categoriaOrder.includes(t.categoria as CategoriaRadar) ? t.categoria as CategoriaRadar : 'monitorar',
    tags: Array.isArray(t.tags) ? t.tags : [],
  }));
}

// ============================================================
// Component
// ============================================================

export default function RadarPage() {
  const { radarItems, addRadarItem, deleteRadarItem } = useStore();

  // Manual add
  const [showForm, setShowForm] = useState(false);
  const [newAssunto, setNewAssunto] = useState('');
  const [newCategoria, setNewCategoria] = useState<CategoriaRadar>('monitorar');
  const [newTags, setNewTags] = useState('');

  // Single URL scan
  const [showUrlScan, setShowUrlScan] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  // Fontes monitoradas
  const [fontes, setFontes] = useState<FonteMonitorada[]>([]);
  const [showAddFonte, setShowAddFonte] = useState(false);
  const [newFonteNome, setNewFonteNome] = useState('');
  const [newFonteUrl, setNewFonteUrl] = useState('');
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updatingFonteId, setUpdatingFonteId] = useState<string | null>(null);
  const [fonteError, setFonteError] = useState('');
  const [fonteResults, setFonteResults] = useState<ScanResult[]>([]);
  const [updateProgress, setUpdateProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    setFontes(loadFontes());
  }, []);

  // --- Manual add ---
  function handleAdd() {
    if (!newAssunto.trim()) return;
    addRadarItem({
      assunto: newAssunto.trim(),
      categoria: newCategoria,
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    setNewAssunto('');
    setNewCategoria('monitorar');
    setNewTags('');
    setShowForm(false);
  }

  // --- Single URL scan ---
  async function handleScanUrl() {
    if (!scanUrl.trim()) { setScanError('Cole uma URL para escanear.'); return; }
    const apiKey = localStorage.getItem('rdt-api-key');
    if (!apiKey) { setScanError('Configure sua API Key em Configuracoes.'); return; }
    setScanError(''); setScanResults([]); setScanning(true);
    try {
      const apiUrl = localStorage.getItem('rdt-api-url') || 'https://api.openai.com/v1/chat/completions';
      const results = await scanSingleUrl(scanUrl.trim(), apiKey, apiUrl);
      setScanResults(results);
    } catch (err: unknown) {
      setScanError(err instanceof Error ? err.message : 'Erro ao escanear URL');
    } finally { setScanning(false); }
  }

  function addScanResult(result: ScanResult) {
    addRadarItem({ assunto: result.assunto, categoria: result.categoria, tags: result.tags });
    setScanResults(prev => prev.filter(r => r.assunto !== result.assunto));
    setFonteResults(prev => prev.filter(r => r.assunto !== result.assunto));
  }

  function addAllResults(results: ScanResult[], clearFn: (v: ScanResult[]) => void) {
    for (const r of results) addRadarItem({ assunto: r.assunto, categoria: r.categoria, tags: r.tags });
    clearFn([]);
  }

  // --- Fontes ---
  function handleAddFonte() {
    if (!newFonteUrl.trim()) return;
    let url = newFonteUrl.trim();
    if (!url.startsWith('http')) url = 'https://' + url;
    const nome = newFonteNome.trim() || new URL(url).hostname.replace('www.', '');
    const nova: FonteMonitorada = {
      id: generateId(),
      nome,
      url,
      criadaEm: new Date().toISOString(),
      ultimaVerificacao: null,
    };
    const updated = [...fontes, nova];
    setFontes(updated);
    saveFontes(updated);
    setNewFonteNome('');
    setNewFonteUrl('');
    setShowAddFonte(false);
  }

  function handleAddSuggested(s: { nome: string; url: string }) {
    if (fontes.some(f => f.url === s.url)) return;
    const nova: FonteMonitorada = {
      id: generateId(),
      nome: s.nome,
      url: s.url,
      criadaEm: new Date().toISOString(),
      ultimaVerificacao: null,
    };
    const updated = [...fontes, nova];
    setFontes(updated);
    saveFontes(updated);
  }

  function handleRemoveFonte(id: string) {
    const updated = fontes.filter(f => f.id !== id);
    setFontes(updated);
    saveFontes(updated);
  }

  const updateFonteTimestamp = useCallback((fonteId: string) => {
    setFontes(prev => {
      const updated = prev.map(f =>
        f.id === fonteId ? { ...f, ultimaVerificacao: new Date().toISOString() } : f
      );
      saveFontes(updated);
      return updated;
    });
  }, []);

  async function handleUpdateFonte(fonte: FonteMonitorada) {
    const apiKey = localStorage.getItem('rdt-api-key');
    if (!apiKey) { setFonteError('Configure sua API Key em Configuracoes.'); return; }
    setFonteError(''); setUpdatingFonteId(fonte.id);
    try {
      const apiUrl = localStorage.getItem('rdt-api-url') || 'https://api.openai.com/v1/chat/completions';
      const results = await scanSingleUrl(fonte.url, apiKey, apiUrl);
      setFonteResults(prev => [
        ...prev.filter(r => r.fonteId !== fonte.id),
        ...results.map(r => ({ ...r, fonteId: fonte.id })),
      ]);
      updateFonteTimestamp(fonte.id);
    } catch (err: unknown) {
      setFonteError(`Erro ao escanear ${fonte.nome}: ${err instanceof Error ? err.message : 'erro desconhecido'}`);
    } finally { setUpdatingFonteId(null); }
  }

  async function handleUpdateAll() {
    const apiKey = localStorage.getItem('rdt-api-key');
    if (!apiKey) { setFonteError('Configure sua API Key em Configuracoes.'); return; }
    if (fontes.length === 0) return;

    setFonteError('');
    setFonteResults([]);
    setUpdatingAll(true);
    setUpdateProgress({ current: 0, total: fontes.length });

    const apiUrl = localStorage.getItem('rdt-api-url') || 'https://api.openai.com/v1/chat/completions';
    const allResults: ScanResult[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fontes.length; i++) {
      const fonte = fontes[i];
      setUpdateProgress({ current: i + 1, total: fontes.length });
      try {
        const results = await scanSingleUrl(fonte.url, apiKey, apiUrl);
        allResults.push(...results.map(r => ({ ...r, fonteId: fonte.id })));
        updateFonteTimestamp(fonte.id);
      } catch {
        errors.push(fonte.nome);
      }
    }

    setFonteResults(allResults);
    setUpdatingAll(false);
    setUpdateProgress(null);
    if (errors.length > 0) {
      setFonteError(`Falha ao escanear: ${errors.join(', ')}`);
    }
  }

  const grouped = categoriaOrder.map(cat => ({
    categoria: cat,
    config: categoriaConfig[cat],
    items: radarItems.filter(r => r.categoria === cat),
  }));

  const fonteResultsForDisplay = fonteResults.filter(r => {
    const existing = radarItems.some(ri => ri.assunto.toLowerCase() === r.assunto.toLowerCase());
    return !existing;
  });

  // ============================================================
  // Render
  // ============================================================

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={itemAnim} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">RADAR DE PAUTAS</h1>
          <p className="text-text-muted text-sm mt-1">Monitoramento de Tendencias</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {fontes.length > 0 && (
            <button
              onClick={handleUpdateAll}
              disabled={updatingAll}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-ui text-[10px] font-semibold tracking-wider uppercase transition-all ${
                updatingAll
                  ? 'bg-surface border border-border text-text-muted cursor-wait'
                  : 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
              }`}
            >
              {updatingAll ? (
                <><Loader2 size={14} className="animate-spin" /> {updateProgress ? `${updateProgress.current}/${updateProgress.total}` : 'Atualizando...'}</>
              ) : (
                <><RefreshCw size={14} /> Atualizar Todas</>
              )}
            </button>
          )}
          <button
            onClick={() => { setShowUrlScan(true); setShowForm(false); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-purple/30 text-purple font-ui text-[10px] font-semibold tracking-wider uppercase hover:bg-purple/5 transition-all"
          >
            <Zap size={14} /> Escanear URL
          </button>
          <button
            onClick={() => { setShowForm(true); setShowUrlScan(false); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-strong text-text-secondary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple hover:text-purple transition-all"
          >
            <Plus size={14} /> Manual
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemAnim} className="grid grid-cols-5 gap-2 lg:gap-3">
        {grouped.map(g => (
          <div key={g.categoria} className={`bg-surface border ${g.config.borderColor} rounded-lg p-3 text-center`}>
            <div className="text-lg mb-1">{g.config.emoji}</div>
            <div className={`font-stat text-xl font-bold ${g.config.color}`}>{g.items.length}</div>
            <div className="font-ui text-[8px] tracking-[1px] uppercase text-text-muted mt-0.5">{g.config.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ============================================================ */}
      {/* FONTES MONITORADAS */}
      {/* ============================================================ */}
      <motion.div variants={itemAnim} className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface-elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Rss size={16} className="text-cyan" />
              </div>
              <div>
                <h2 className="font-ui text-[11px] font-bold tracking-[2px] uppercase text-text-primary">
                  Fontes Monitoradas
                </h2>
                <p className="text-[10px] text-text-muted">
                  {fontes.length} {fontes.length === 1 ? 'fonte configurada' : 'fontes configuradas'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddFonte(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-strong text-text-secondary font-ui text-[9px] font-semibold tracking-wider uppercase hover:border-cyan hover:text-cyan transition-all"
            >
              <Plus size={12} /> Adicionar Fonte
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Add fonte form */}
          <AnimatePresence>
            {showAddFonte && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-bg-primary border border-cyan/20 rounded-lg p-4 space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-ui text-[9px] font-bold tracking-[1.5px] uppercase text-cyan">Nova Fonte</h4>
                    <button onClick={() => setShowAddFonte(false)} className="text-text-muted hover:text-text-primary">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      value={newFonteNome}
                      onChange={e => setNewFonteNome(e.target.value)}
                      placeholder="Nome (opcional)"
                      className="bg-surface border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-cyan transition-all placeholder:text-text-muted"
                    />
                    <div className="sm:col-span-2 flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          value={newFonteUrl}
                          onChange={e => setNewFonteUrl(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddFonte()}
                          placeholder="https://ge.globo.com/"
                          className="w-full bg-surface border border-border-strong rounded-md pl-8 pr-3 p-2.5 text-sm text-text-primary outline-none focus:border-cyan transition-all placeholder:text-text-muted"
                        />
                      </div>
                      <button
                        onClick={handleAddFonte}
                        className="px-4 py-2 rounded-md gradient-bg text-white font-ui text-[9px] font-semibold tracking-wider uppercase whitespace-nowrap"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>

                  {/* Suggested sources */}
                  {SUGGESTED_FONTES.filter(s => !fontes.some(f => f.url === s.url)).length > 0 && (
                    <div>
                      <span className="font-ui text-[8px] tracking-wider uppercase text-text-muted block mb-1.5">Sugestoes</span>
                      <div className="flex gap-2 flex-wrap">
                        {SUGGESTED_FONTES.filter(s => !fontes.some(f => f.url === s.url)).map(s => (
                          <button
                            key={s.url}
                            onClick={() => handleAddSuggested(s)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border-strong text-text-muted font-ui text-[9px] tracking-wider hover:border-cyan hover:text-cyan transition-all"
                          >
                            <Plus size={10} /> {s.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fontes list */}
          {fontes.length === 0 ? (
            <div className="text-center py-6">
              <Rss size={24} className="text-text-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm text-text-muted mb-3">Nenhuma fonte configurada.</p>
              <button
                onClick={() => setShowAddFonte(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md gradient-bg text-white font-ui text-[9px] font-semibold tracking-wider uppercase"
              >
                <Plus size={12} /> Adicionar Primeira Fonte
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {fontes.map(fonte => {
                const isUpdating = updatingFonteId === fonte.id || (updatingAll && updateProgress !== null);
                return (
                  <div
                    key={fonte.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-bg-primary/50 border border-border hover:border-cyan/20 transition-all group"
                  >
                    <div className="w-7 h-7 rounded bg-cyan/10 flex items-center justify-center shrink-0">
                      <Rss size={12} className="text-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{fonte.nome}</span>
                        <a
                          href={fonte.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-cyan transition-colors shrink-0"
                        >
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={9} className="text-text-muted" />
                        <span className="text-[9px] text-text-muted">
                          {fonte.ultimaVerificacao
                            ? `Verificada ${timeAgo(fonte.ultimaVerificacao)}`
                            : 'Nunca verificada'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdateFonte(fonte)}
                      disabled={isUpdating}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded border font-ui text-[9px] font-semibold tracking-wider uppercase transition-all shrink-0 ${
                        isUpdating
                          ? 'border-border text-text-muted cursor-wait'
                          : 'border-border-strong text-text-muted hover:border-cyan hover:text-cyan'
                      }`}
                    >
                      {updatingFonteId === fonte.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <RefreshCw size={10} />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveFonte(fonte.id)}
                      className="p-1 rounded text-text-muted hover:text-red opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Remover fonte"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fonte error */}
          {fonteError && (
            <div className="bg-red/10 border border-red/20 rounded-md p-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-red mt-0.5 shrink-0" />
              <p className="text-xs text-red">{fonteError}</p>
            </div>
          )}

          {/* Fonte scan results */}
          <AnimatePresence>
            {fonteResultsForDisplay.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 pt-2 border-t border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-gold" />
                    <span className="font-ui text-[10px] font-bold tracking-wider uppercase text-gold">
                      {fonteResultsForDisplay.length} topicos encontrados
                    </span>
                  </div>
                  <button
                    onClick={() => addAllResults(fonteResultsForDisplay, setFonteResults)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md gradient-bg text-white font-ui text-[9px] font-semibold tracking-wider uppercase"
                  >
                    <Plus size={12} /> Adicionar Todos
                  </button>
                </div>
                {fonteResultsForDisplay.map((result, i) => {
                  const config = categoriaConfig[result.categoria];
                  const fonteName = result.fonteId ? fontes.find(f => f.id === result.fonteId)?.nome : undefined;
                  return (
                    <motion.div
                      key={`${result.assunto}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-3 p-3 rounded-md bg-bg-primary border ${config.borderColor}`}
                    >
                      <span className="text-base shrink-0">{config.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">{result.assunto}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {fonteName && (
                            <span className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-cyan/8 text-cyan border border-cyan/15">
                              {fonteName}
                            </span>
                          )}
                          {result.tags.map(tag => (
                            <span key={tag} className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-purple/8 text-purple border border-purple/15">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`font-ui text-[8px] tracking-wider uppercase shrink-0 ${config.color}`}>{config.label}</span>
                      <button
                        onClick={() => addScanResult(result)}
                        className="p-1.5 rounded border border-border-strong text-text-muted hover:border-green hover:text-green transition-all shrink-0"
                        title="Adicionar ao Radar"
                      >
                        <Plus size={14} />
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SINGLE URL SCAN */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showUrlScan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-purple/20 rounded-lg p-5 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-cyan">Escanear URL Avulsa</h3>
                <button onClick={() => { setShowUrlScan(false); setScanResults([]); setScanError(''); }} className="text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      value={scanUrl}
                      onChange={e => setScanUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleScanUrl()}
                      placeholder="https://ge.globo.com/..."
                      className="w-full bg-bg-primary border border-border-strong rounded-md pl-9 pr-3 py-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleScanUrl}
                    disabled={scanning}
                    className={`flex items-center gap-2 px-6 py-3 rounded-md font-ui text-[10px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                      scanning
                        ? 'bg-surface border border-border text-text-muted cursor-wait'
                        : 'gradient-bg text-white hover:shadow-lg hover:shadow-purple/20'
                    }`}
                  >
                    {scanning ? (
                      <><Loader2 size={14} className="animate-spin" /> Escaneando...</>
                    ) : (
                      <><Zap size={14} /> Escanear</>
                    )}
                  </button>
                </div>

                {scanError && (
                  <div className="bg-red/10 border border-red/20 rounded-md p-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-red mt-0.5 shrink-0" />
                    <p className="text-xs text-red">{scanError}</p>
                  </div>
                )}

                {scanResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-ui text-[9px] tracking-wider uppercase text-text-muted">
                        {scanResults.length} topicos encontrados
                      </span>
                      <button
                        onClick={() => addAllResults(scanResults, setScanResults)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md gradient-bg text-white font-ui text-[9px] font-semibold tracking-wider uppercase"
                      >
                        <Plus size={12} /> Adicionar Todos
                      </button>
                    </div>
                    {scanResults.map((result, i) => {
                      const config = categoriaConfig[result.categoria];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={`flex items-center gap-3 p-3 rounded-md bg-bg-primary border ${config.borderColor}`}
                        >
                          <span className="text-base">{config.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary">{result.assunto}</p>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              {result.tags.map(tag => (
                                <span key={tag} className="text-[8px] font-ui tracking-wider px-1.5 py-0.5 rounded bg-purple/8 text-purple border border-purple/15">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className={`font-ui text-[8px] tracking-wider uppercase ${config.color}`}>{config.label}</span>
                          <button
                            onClick={() => addScanResult(result)}
                            className="p-1.5 rounded border border-border-strong text-text-muted hover:border-green hover:text-green transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MANUAL ADD */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-purple/20 rounded-lg p-5 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-ui text-[11px] font-bold tracking-wider uppercase text-cyan">Adicionar Manualmente</h3>
                <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={newAssunto}
                  onChange={e => setNewAssunto(e.target.value)}
                  placeholder="Qual o assunto em alta?"
                  className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
                  autoFocus
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={newCategoria}
                    onChange={e => setNewCategoria(e.target.value as CategoriaRadar)}
                    className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple transition-all"
                  >
                    {categoriaOrder.map(cat => (
                      <option key={cat} value={cat}>{categoriaConfig[cat].emoji} {categoriaConfig[cat].label}</option>
                    ))}
                  </select>
                  <input
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="Tags (separar por virgula)"
                    className="w-full bg-bg-primary border border-border-strong rounded-md p-3 text-sm text-text-primary outline-none focus:border-purple transition-all placeholder:text-text-muted"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAdd} className="flex-1 py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all">
                    Salvar no Radar
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-md bg-surface border border-border-strong text-text-secondary font-ui text-[10px] font-semibold tracking-wider uppercase hover:border-purple transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* CATEGORIES */}
      {/* ============================================================ */}
      {grouped.map(g => (
        <motion.div key={g.categoria} variants={itemAnim}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-md ${g.config.bgColor} flex items-center justify-center`}>
              <span className="text-base">{g.config.emoji}</span>
            </div>
            <h2 className={`font-ui text-[12px] font-bold tracking-wider uppercase ${g.config.color}`}>
              {g.config.label}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className={`font-stat text-sm font-bold ${g.config.color}`}>{g.items.length}</span>
          </div>

          {g.items.length > 0 ? (
            <div className="space-y-2 mb-6">
              {g.items.map((radarItem, idx) => (
                <motion.div
                  key={radarItem.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`bg-surface border ${g.config.borderColor} rounded-lg p-4 hover:shadow-lg hover:shadow-purple/5 transition-all group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-cyan transition-colors">
                        {radarItem.assunto}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {radarItem.tags.map(tag => (
                          <span key={tag} className="font-ui text-[9px] tracking-wider px-2 py-0.5 rounded bg-purple/8 text-purple border border-purple/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-text-muted whitespace-nowrap">{timeAgo(radarItem.criadoEm)}</span>
                      <button
                        onClick={() => deleteRadarItem(radarItem.id)}
                        className="p-1 rounded text-text-muted hover:text-red opacity-0 group-hover:opacity-100 transition-all"
                        title="Remover"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-border text-center mb-6">
              <span className="text-[10px] text-text-muted font-ui tracking-wider uppercase">Nenhum assunto nesta categoria</span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Total */}
      <motion.div variants={itemAnim} className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
        <span className="font-ui text-[10px] tracking-wider uppercase text-text-muted">Total no radar</span>
        <span className="font-stat text-xl font-bold text-cyan">{radarItems.length}</span>
      </motion.div>
    </motion.div>
  );
}
