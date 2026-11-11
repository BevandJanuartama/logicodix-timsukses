import { create } from 'zustand'

export type CleaningTool = 'brush' | 'floss' | 'scraper'

export interface CleanStats {
  surface: number
  interdental: number
  tongue: number
  overall: number
}

export const CLEAN_TARGET = 95

const ZERO_STATS: CleanStats = { surface: 0, interdental: 0, tongue: 0, overall: 0 }

interface CleaningState {
  tool: CleaningTool
  stats: CleanStats
  startedAt: number | null
  finishedAt: number | null
  resetNonce: number
  mouthwashNonce: number
  setTool: (tool: CleaningTool) => void
  setStats: (stats: CleanStats) => void
  markStarted: () => void
  markFinished: () => void
  reset: () => void
  useMouthwash: () => void
}

export const useCleaningStore = create<CleaningState>((set, get) => ({
  tool: 'brush',
  stats: ZERO_STATS,
  startedAt: null,
  finishedAt: null,
  resetNonce: 0,
  mouthwashNonce: 0,
  setTool: (tool) => set({ tool }),
  setStats: (stats) => set({ stats }),
  markStarted: () => {
    if (get().startedAt === null) set({ startedAt: performance.now() })
  },
  markFinished: () => {
    if (get().finishedAt === null) set({ finishedAt: performance.now() })
  },
  reset: () =>
    set((state) => ({
      stats: ZERO_STATS,
      startedAt: null,
      finishedAt: null,
      mouthwashNonce: 0,
      resetNonce: state.resetNonce + 1,
    })),
  useMouthwash: () => set((state) => (state.mouthwashNonce > 0 ? {} : { mouthwashNonce: 1 })),
}))
