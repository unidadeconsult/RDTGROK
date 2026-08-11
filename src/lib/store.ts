'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import React from 'react'
import type {
  Pauta,
  Ideia,
  RadarItem,
  Angulo,
  ConteudoDerivado,
} from './types'
// Demo data available via: import { demoPautas, demoIdeias, demoRadarItems } from './data'
import { generateId } from './utils'

// ============================================================
// Store Types
// ============================================================

interface StoreState {
  pautas: Pauta[]
  ideias: Ideia[]
  radarItems: RadarItem[]
}

interface StoreActions {
  // Ideias
  addIdeia: (ideia: Omit<Ideia, 'id' | 'criadaEm' | 'favorita' | 'promovida'>) => Ideia
  updateIdeia: (id: string, updates: Partial<Ideia>) => void
  deleteIdeia: (id: string) => void

  // Pautas
  addPauta: (pauta: Omit<Pauta, 'id' | 'criadaEm' | 'atualizadaEm' | 'angulos' | 'conteudos' | 'overall'>) => Pauta
  updatePauta: (id: string, updates: Partial<Pauta>) => void
  deletePauta: (id: string) => void
  promoverIdeia: (ideiaId: string) => Pauta | null

  // Angulos
  addAngulo: (pautaId: string, angulo: Omit<Angulo, 'id' | 'pautaId'>) => void
  updateAngulo: (pautaId: string, anguloId: string, updates: Partial<Angulo>) => void
  deleteAngulo: (pautaId: string, anguloId: string) => void

  // Conteudos
  addConteudo: (pautaId: string, conteudo: Omit<ConteudoDerivado, 'id' | 'pautaId' | 'criadoEm'>) => void
  updateConteudo: (pautaId: string, conteudoId: string, updates: Partial<ConteudoDerivado>) => void
  deleteConteudo: (pautaId: string, conteudoId: string) => void

  // Radar
  addRadarItem: (item: Omit<RadarItem, 'id' | 'criadoEm'>) => void
  updateRadarItem: (id: string, updates: Partial<RadarItem>) => void
  deleteRadarItem: (id: string) => void

  // Utilities
  toggleFavorite: (type: 'pauta' | 'ideia' | 'angulo', id: string, parentId?: string) => void
  searchGlobal: (query: string) => { pautas: Pauta[]; ideias: Ideia[]; radarItems: RadarItem[] }
}

interface StoreContextValue extends StoreState, StoreActions {
  favorites: { pautas: Pauta[]; ideias: Ideia[] }
}

// ============================================================
// Helpers
// ============================================================

const STORAGE_KEY = 'rdt-central-store'

function calculateOverall(atributos: Pauta['atributos']): number {
  const values = Object.values(atributos)
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / values.length)
}

function loadFromStorage(): StoreState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoreState
  } catch {
    return null
  }
}

function saveToStorage(state: StoreState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable
  }
}

function getDefaultState(): StoreState {
  return {
    pautas: [],
    ideias: [],
    radarItems: [],
  }
}

// ============================================================
// Context
// ============================================================

const StoreContext = createContext<StoreContextValue | null>(null)

// ============================================================
// Provider
// ============================================================

export function StoreProvider({ children }: { children: ReactNode }) {
  const [pautas, setPautas] = useState<Pauta[]>([])
  const [ideias, setIdeias] = useState<Ideia[]>([])
  const [radarItems, setRadarItems] = useState<RadarItem[]>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize from localStorage or demo data
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      setPautas(stored.pautas)
      setIdeias(stored.ideias)
      setRadarItems(stored.radarItems)
    } else {
      const defaults = getDefaultState()
      setPautas(defaults.pautas)
      setIdeias(defaults.ideias)
      setRadarItems(defaults.radarItems)
    }
    setInitialized(true)
  }, [])

  // Persist to localStorage on state changes
  useEffect(() => {
    if (!initialized) return
    saveToStorage({ pautas, ideias, radarItems })
  }, [pautas, ideias, radarItems, initialized])

  // --- Ideias ---

  const addIdeia = useCallback(
    (data: Omit<Ideia, 'id' | 'criadaEm' | 'favorita' | 'promovida'>): Ideia => {
      const nova: Ideia = {
        ...data,
        id: generateId(),
        criadaEm: new Date().toISOString(),
        favorita: false,
        promovida: false,
      }
      setIdeias((prev) => [nova, ...prev])
      return nova
    },
    []
  )

  const updateIdeia = useCallback((id: string, updates: Partial<Ideia>) => {
    setIdeias((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [])

  const deleteIdeia = useCallback((id: string) => {
    setIdeias((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // --- Pautas ---

  const addPauta = useCallback(
    (
      data: Omit<Pauta, 'id' | 'criadaEm' | 'atualizadaEm' | 'angulos' | 'conteudos' | 'overall'>
    ): Pauta => {
      const now = new Date().toISOString()
      const nova: Pauta = {
        ...data,
        id: generateId(),
        criadaEm: now,
        atualizadaEm: now,
        angulos: [],
        conteudos: [],
        overall: calculateOverall(data.atributos),
      }
      setPautas((prev) => [nova, ...prev])
      return nova
    },
    []
  )

  const updatePauta = useCallback((id: string, updates: Partial<Pauta>) => {
    setPautas((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const merged = { ...p, ...updates, atualizadaEm: new Date().toISOString() }
        if (updates.atributos) {
          merged.overall = calculateOverall(merged.atributos)
        }
        return merged
      })
    )
  }, [])

  const deletePauta = useCallback((id: string) => {
    setPautas((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const promoverIdeia = useCallback(
    (ideiaId: string): Pauta | null => {
      const ideia = ideias.find((i) => i.id === ideiaId)
      if (!ideia) return null

      const now = new Date().toISOString()
      const novaPauta: Pauta = {
        id: generateId(),
        titulo: ideia.titulo || ideia.texto,
        descricao: ideia.texto,
        origem: ideia.fonte || 'Ideia promovida',
        fonteUrl: ideia.link,
        tags: ideia.tags,
        clube: ideia.clube,
        jogador: ideia.jogador,
        competicao: ideia.competicao,
        status: 'ideia',
        vidaUtil: 'dias',
        semaforo: 'amarelo',
        atributos: {
          atualidade: 50,
          debate: 50,
          originalidade: 50,
          emocao: 50,
          versatilidade: 50,
          vidaUtil: 50,
          potencialVisual: 50,
          profundidade: 50,
        },
        overall: 50,
        favorita: ideia.favorita,
        criadaEm: now,
        atualizadaEm: now,
        notas: ideia.notas || '',
        angulos: [],
        conteudos: [],
      }

      setPautas((prev) => [novaPauta, ...prev])
      setIdeias((prev) =>
        prev.map((i) =>
          i.id === ideiaId
            ? { ...i, promovida: true, pautaId: novaPauta.id }
            : i
        )
      )

      return novaPauta
    },
    [ideias]
  )

  // --- Angulos ---

  const addAngulo = useCallback(
    (pautaId: string, data: Omit<Angulo, 'id' | 'pautaId'>) => {
      const novo: Angulo = {
        ...data,
        id: generateId(),
        pautaId,
      }
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? { ...p, angulos: [...p.angulos, novo], atualizadaEm: new Date().toISOString() }
            : p
        )
      )
    },
    []
  )

  const updateAngulo = useCallback(
    (pautaId: string, anguloId: string, updates: Partial<Angulo>) => {
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? {
                ...p,
                angulos: p.angulos.map((a) =>
                  a.id === anguloId ? { ...a, ...updates } : a
                ),
                atualizadaEm: new Date().toISOString(),
              }
            : p
        )
      )
    },
    []
  )

  const deleteAngulo = useCallback(
    (pautaId: string, anguloId: string) => {
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? {
                ...p,
                angulos: p.angulos.filter((a) => a.id !== anguloId),
                atualizadaEm: new Date().toISOString(),
              }
            : p
        )
      )
    },
    []
  )

  // --- Conteudos ---

  const addConteudo = useCallback(
    (pautaId: string, data: Omit<ConteudoDerivado, 'id' | 'pautaId' | 'criadoEm'>) => {
      const novo: ConteudoDerivado = {
        ...data,
        id: generateId(),
        pautaId,
        criadoEm: new Date().toISOString(),
      }
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? { ...p, conteudos: [...p.conteudos, novo], atualizadaEm: new Date().toISOString() }
            : p
        )
      )
    },
    []
  )

  const updateConteudo = useCallback(
    (pautaId: string, conteudoId: string, updates: Partial<ConteudoDerivado>) => {
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? {
                ...p,
                conteudos: p.conteudos.map((c) =>
                  c.id === conteudoId ? { ...c, ...updates } : c
                ),
                atualizadaEm: new Date().toISOString(),
              }
            : p
        )
      )
    },
    []
  )

  const deleteConteudo = useCallback(
    (pautaId: string, conteudoId: string) => {
      setPautas((prev) =>
        prev.map((p) =>
          p.id === pautaId
            ? {
                ...p,
                conteudos: p.conteudos.filter((c) => c.id !== conteudoId),
                atualizadaEm: new Date().toISOString(),
              }
            : p
        )
      )
    },
    []
  )

  // --- Radar ---

  const addRadarItem = useCallback(
    (data: Omit<RadarItem, 'id' | 'criadoEm'>) => {
      const novo: RadarItem = {
        ...data,
        id: generateId(),
        criadoEm: new Date().toISOString(),
      }
      setRadarItems((prev) => [novo, ...prev])
    },
    []
  )

  const updateRadarItem = useCallback(
    (id: string, updates: Partial<RadarItem>) => {
      setRadarItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      )
    },
    []
  )

  const deleteRadarItem = useCallback((id: string) => {
    setRadarItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // --- Favorites ---

  const toggleFavorite = useCallback(
    (type: 'pauta' | 'ideia' | 'angulo', id: string, parentId?: string) => {
      switch (type) {
        case 'pauta':
          setPautas((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, favorita: !p.favorita, atualizadaEm: new Date().toISOString() }
                : p
            )
          )
          break
        case 'ideia':
          setIdeias((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, favorita: !i.favorita } : i
            )
          )
          break
        case 'angulo':
          if (!parentId) break
          setPautas((prev) =>
            prev.map((p) =>
              p.id === parentId
                ? {
                    ...p,
                    angulos: p.angulos.map((a) =>
                      a.id === id ? { ...a, favorito: !a.favorito } : a
                    ),
                    atualizadaEm: new Date().toISOString(),
                  }
                : p
            )
          )
          break
      }
    },
    []
  )

  // --- Search ---

  const searchGlobal = useCallback(
    (query: string) => {
      const q = query.toLowerCase().trim()
      if (!q) return { pautas, ideias, radarItems }

      const matchesPauta = (p: Pauta) =>
        p.titulo.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.clube && p.clube.toLowerCase().includes(q)) ||
        (p.jogador && p.jogador.toLowerCase().includes(q)) ||
        (p.competicao && p.competicao.toLowerCase().includes(q))

      const matchesIdeia = (i: Ideia) =>
        i.texto.toLowerCase().includes(q) ||
        (i.titulo && i.titulo.toLowerCase().includes(q)) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        (i.clube && i.clube.toLowerCase().includes(q)) ||
        (i.jogador && i.jogador.toLowerCase().includes(q))

      const matchesRadar = (r: RadarItem) =>
        r.assunto.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))

      return {
        pautas: pautas.filter(matchesPauta),
        ideias: ideias.filter(matchesIdeia),
        radarItems: radarItems.filter(matchesRadar),
      }
    },
    [pautas, ideias, radarItems]
  )

  // --- Derived state ---

  const favorites = {
    pautas: pautas.filter((p) => p.favorita),
    ideias: ideias.filter((i) => i.favorita),
  }

  const value: StoreContextValue = {
    pautas,
    ideias,
    radarItems,
    favorites,
    addIdeia,
    updateIdeia,
    deleteIdeia,
    addPauta,
    updatePauta,
    deletePauta,
    promoverIdeia,
    addAngulo,
    updateAngulo,
    deleteAngulo,
    addConteudo,
    updateConteudo,
    deleteConteudo,
    addRadarItem,
    updateRadarItem,
    deleteRadarItem,
    toggleFavorite,
    searchGlobal,
  }

  return React.createElement(StoreContext.Provider, { value }, children)
}

// ============================================================
// Hook
// ============================================================

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
