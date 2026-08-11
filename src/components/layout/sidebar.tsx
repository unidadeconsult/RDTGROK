'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Lightbulb, Flame, Brain, Goal,
  TreePine, Gamepad2, Radar, Package, Calendar,
  Star, Archive, Settings, Zap, Search, X, Menu
} from 'lucide-react';
import { useState } from 'react';

const navSections = [
  {
    label: null,
    items: [
      { id: 'central', label: 'Central', icon: Home, href: '/', badge: null },
    ]
  },
  {
    label: 'Criacao',
    items: [
      { id: 'vestiario', label: 'Vestiario de Ideias', icon: Lightbulb, href: '/vestiario', badge: null },
      { id: 'draft', label: 'Draft RDT', icon: Flame, href: '/draft', badge: null },
      { id: 'sala-criacao', label: 'Sala de Criacao', icon: Brain, href: '/sala-criacao', badge: null },
      { id: 'mesa-redonda', label: 'Mesa Redonda', icon: Zap, href: '/mesa-redonda', badge: null },
      { id: 'prancheta', label: 'Prancheta Editorial', icon: Goal, href: '/prancheta', badge: null },
      { id: 'arvore', label: 'Arvore de Conteudo', icon: TreePine, href: '/arvore', badge: null },
      { id: 'escalacao', label: 'Escalacao', icon: Gamepad2, href: '/escalacao', badge: null },
    ]
  },
  {
    label: 'Monitorar',
    items: [
      { id: 'radar', label: 'Radar de Pautas', icon: Radar, href: '/radar', badge: null },
      { id: 'pacotes', label: 'Pacotes', icon: Package, href: '/pacotes', badge: null },
      { id: 'planejamento', label: 'Planejamento', icon: Calendar, href: '/planejamento', badge: null },
    ]
  },
  {
    label: 'Biblioteca',
    items: [
      { id: 'favoritos', label: 'Favoritos', icon: Star, href: '/favoritos', badge: null },
      { id: 'arquivo', label: 'Arquivo', icon: Archive, href: '/arquivo', badge: null },
      { id: 'configuracoes', label: 'Configuracoes', icon: Settings, href: '/configuracoes', badge: null },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <Link href="/" className="block">
          <div className="font-ui text-lg font-extrabold tracking-[3px] gradient-text">
            RDT
          </div>
          <div className="font-ui text-[9px] font-semibold tracking-[2px] uppercase text-text-muted mt-0.5">
            Central de Criacao
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section, si) => (
          <div key={si} className="mb-4">
            {section.label && (
              <div className="font-ui text-[9px] font-semibold tracking-[2px] uppercase text-text-muted px-3 mb-2 mt-2">
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium
                    transition-all duration-200 mb-0.5 border border-transparent
                    ${active
                      ? 'bg-purple/8 text-cyan border-purple/20'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 gradient-bg rounded-r"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={16} className={active ? 'text-cyan' : ''} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto font-ui text-[8px] font-bold tracking-wider px-2 py-0.5 rounded gradient-bg text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="text-[10px] text-text-muted font-ui tracking-wider uppercase">
          Dados demonstrativos
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border bg-bg-primary h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-bg-primary/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <div className="font-ui text-sm font-extrabold tracking-[2px] gradient-text">
          RDT
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md border border-border-strong text-text-secondary hover:text-text-primary hover:border-purple transition-all"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-bg-primary border-r border-border z-50 overflow-y-auto"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </>
  );
}
