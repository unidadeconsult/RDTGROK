'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function Header() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (cmdOpen && inputRef.current) inputRef.current.focus();
  }, [cmdOpen]);

  const commands = [
    { label: 'Nova ideia', icon: '💡', action: () => router.push('/vestiario') },
    { label: 'Nova pauta', icon: '📋', action: () => router.push('/draft') },
    { label: 'Buscar', icon: '🔍', action: () => {} },
    { label: 'Abrir Draft', icon: '🔥', action: () => router.push('/draft') },
    { label: 'Brainstorming', icon: '🧠', action: () => router.push('/sala-criacao') },
    { label: 'Mesa Redonda', icon: '⚽', action: () => router.push('/mesa-redonda') },
    { label: 'Criar pacote', icon: '📦', action: () => router.push('/pacotes') },
    { label: 'Calendario', icon: '📅', action: () => router.push('/planejamento') },
    { label: 'Favoritos', icon: '⭐', action: () => router.push('/favoritos') },
  ];

  const filtered = search
    ? commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : commands;

  return (
    <>
      <header className="h-14 lg:h-16 border-b border-border bg-bg-primary/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 gradient-border">
        <div className="hidden lg:flex items-center gap-3 text-text-muted text-sm">
          <span className="font-ui text-[9px] tracking-[2px] uppercase">Resenha da Torcida</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Command palette trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong text-text-muted hover:text-text-primary hover:border-purple transition-all text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:inline text-xs">Buscar...</span>
            <kbd className="hidden sm:inline font-ui text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border-strong ml-2">
              <Command size={9} className="inline" /> K
            </kbd>
          </button>

          {/* New idea button */}
          <button
            onClick={() => router.push('/vestiario')}
            className="flex items-center gap-2 px-4 py-2 rounded-md gradient-bg text-white font-ui text-[10px] font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-purple/20 transition-all"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nova Ideia</span>
          </button>
        </div>
      </header>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-[100]"
              onClick={() => setCmdOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[540px] bg-surface border border-border-strong rounded-xl shadow-2xl shadow-purple/10 z-[101] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar ou executar comando..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
                <kbd className="font-ui text-[9px] px-1.5 py-0.5 rounded bg-bg-primary border border-border text-text-muted">
                  ESC
                </kbd>
              </div>
              <div className="max-h-[50vh] overflow-y-auto py-2">
                <div className="px-3 py-1">
                  <div className="font-ui text-[9px] tracking-[2px] uppercase text-text-muted px-2 mb-2">
                    Comandos
                  </div>
                </div>
                {filtered.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => { cmd.action(); setCmdOpen(false); setSearch(''); }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-text-secondary hover:bg-purple/8 hover:text-text-primary transition-colors"
                  >
                    <span className="text-base">{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-5 py-8 text-center text-text-muted text-sm">
                    Nenhum resultado encontrado.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
