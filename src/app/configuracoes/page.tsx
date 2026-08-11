'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  Key,
  Download,
  Upload,
  Trash2,
  Info,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const providers = ['OpenAI', 'Groq', 'DeepSeek', 'Anthropic'];

export default function ConfiguracoesPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [provider, setProvider] = useState('OpenAI');
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [imported, setImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('rdt-api-key') || '');
      setApiUrl(localStorage.getItem('rdt-api-url') || '');
      const storedProvider = localStorage.getItem('rdt-api-provider');
      if (storedProvider) setProvider(storedProvider);
    }
  }, []);

  function handleSave() {
    localStorage.setItem('rdt-api-key', apiKey);
    localStorage.setItem('rdt-api-url', apiUrl);
    localStorage.setItem('rdt-api-provider', provider);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rdt-central-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    const confirmed = window.confirm(
      'ATENCAO: Isso vai apagar todos os seus dados e restaurar os dados de demonstracao. Deseja continuar?',
    );
    if (!confirmed) return;
    localStorage.clear();
    setApiKey('');
    setApiUrl('');
    setProvider('OpenAI');
    setCleared(true);
    setTimeout(() => {
      setCleared(false);
      window.location.reload();
    }, 1500);
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data === 'object' && data !== null) {
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'string') {
              localStorage.setItem(key, value);
            }
          });
          setImported(true);
          setTimeout(() => {
            setImported(false);
            window.location.reload();
          }, 1500);
        }
      } catch {
        alert('Arquivo invalido. Selecione um arquivo JSON valido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl tracking-wider gradient-text">
          CONFIGURACOES
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Personalize sua experiencia
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Section 1: API & Integracao */}
        <motion.div
          variants={item}
          className="bg-surface border border-border rounded-lg overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple/10 border border-purple/20 flex items-center justify-center">
                <Key size={16} className="text-purple" />
              </div>
              <div>
                <h2 className="font-display text-lg tracking-wider text-text-primary">
                  API & INTEGRACAO
                </h2>
                <p className="text-xs text-text-muted">
                  Configure sua conexao com provedores de IA
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                Provedor
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
              />
            </div>

            <div>
              <label className="font-ui text-[9px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-1.5 block">
                API URL (opcional)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full bg-bg-primary border border-border-strong rounded-md p-2.5 text-sm text-text-primary outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,0,255,0.15)] transition-all placeholder:text-text-muted"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
            >
              {saved ? 'Salvo!' : 'Salvar Configuracoes'}
            </button>
            {saved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green text-center"
              >
                Configuracoes salvas com sucesso!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Section 2: Dados */}
        <motion.div
          variants={item}
          className="bg-surface border border-border rounded-lg overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Database size={16} className="text-cyan" />
              </div>
              <div>
                <h2 className="font-display text-lg tracking-wider text-text-primary">
                  DADOS
                </h2>
                <p className="text-xs text-text-muted">
                  Gerencie seus dados locais
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 rounded-md bg-bg-primary border border-border-strong hover:border-cyan hover:text-cyan transition-all group"
            >
              <Download
                size={16}
                className="text-text-muted group-hover:text-cyan transition-colors"
              />
              <div className="text-left">
                <span className="text-sm text-text-primary block group-hover:text-cyan transition-colors">
                  Exportar Dados
                </span>
                <span className="text-[10px] text-text-muted">
                  Baixar todos os dados como arquivo JSON
                </span>
              </div>
            </button>

            <button
              onClick={handleImport}
              className="w-full flex items-center gap-3 p-3 rounded-md bg-bg-primary border border-border-strong hover:border-purple hover:text-purple transition-all group"
            >
              <Upload
                size={16}
                className="text-text-muted group-hover:text-purple transition-colors"
              />
              <div className="text-left">
                <span className="text-sm text-text-primary block group-hover:text-purple transition-colors">
                  Importar Dados
                </span>
                <span className="text-[10px] text-text-muted">
                  Restaurar dados de um backup JSON
                </span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onFileSelected}
              className="hidden"
            />
            {imported && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green text-center"
              >
                Dados importados com sucesso! Recarregando...
              </motion.p>
            )}

            <div className="pt-2 border-t border-border">
              <button
                onClick={handleClear}
                className="w-full flex items-center gap-3 p-3 rounded-md bg-red/5 border border-red/20 hover:border-red hover:bg-red/10 transition-all group"
              >
                <Trash2
                  size={16}
                  className="text-red"
                />
                <div className="text-left">
                  <span className="text-sm text-red block">
                    Limpar Dados
                  </span>
                  <span className="text-[10px] text-red/60">
                    Apaga tudo e restaura dados de demonstracao
                  </span>
                </div>
              </button>
              <p className="text-[10px] text-red/80 mt-2 px-1">
                Atencao: esta acao e irreversivel. Todos os dados serao apagados e substituidos pelos dados de demonstracao.
              </p>
              {cleared && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green text-center mt-2"
                >
                  Dados limpos! Recarregando...
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section 3: Sobre */}
        <motion.div
          variants={item}
          className="bg-surface border border-border rounded-lg overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Info size={16} className="text-gold" />
              </div>
              <div>
                <h2 className="font-display text-lg tracking-wider text-text-primary">
                  SOBRE
                </h2>
                <p className="text-xs text-text-muted">
                  Informacoes do aplicativo
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg gradient-bg flex items-center justify-center">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wider gradient-text">
                  RDT CENTRAL DE CRIACAO
                </h3>
                <span className="font-stat text-sm text-text-muted">v1.0</span>
              </div>
            </div>

            <div className="bg-bg-primary border border-border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Desenvolvido por</span>
                <span className="text-xs text-text-primary font-semibold">
                  Resenha da Torcida
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Tecnologia</span>
                <span className="text-xs text-text-primary">
                  Next.js + Tailwind CSS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Armazenamento</span>
                <span className="text-xs text-text-primary">
                  localStorage (local)
                </span>
              </div>
            </div>

            <div className="bg-purple/5 border border-purple/15 rounded-md p-3">
              <p className="text-xs text-text-secondary">
                Este aplicativo utiliza dados de demonstracao para ilustrar funcionalidades. Os dados sao armazenados localmente no seu navegador e nao sao enviados para nenhum servidor.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="text-center py-4">
        <span className="font-ui text-[9px] tracking-[3px] uppercase text-text-muted">
          Nao comece pelo post. Comece pela ideia.
        </span>
      </div>
    </div>
  );
}
