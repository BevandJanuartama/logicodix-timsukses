'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FlaskConical, ListChecks, ScanSearch, Sparkles, Stethoscope } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'

const MODE_TABS: { id: AppMode; label: string; icon: typeof ScanSearch }[] = [
  { id: 'explore', label: 'Anatomi', icon: ScanSearch },
  { id: 'diseases', label: 'Penyakit', icon: Stethoscope },
  { id: 'destroy', label: 'Simulasi', icon: FlaskConical },
  { id: 'clean', label: 'Bersihkan', icon: Sparkles },
  { id: 'quiz', label: 'Kuis', icon: ListChecks },
]

const CLEAN_VIEW_DISTANCE = 7.2
const INDICATOR_SPRING = { type: 'spring', stiffness: 420, damping: 34 } as const

export function ModeTabs() {
  const mode = useAppStore((state) => state.mode)
  const intro = useAppStore((state) => state.intro)
  const setMode = useAppStore((state) => state.setMode)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const reduceMotion = useReducedMotion()

  const openMode = (next: AppMode) => {
    setMode(next)
    if (next === 'clean') requestCamera({ kind: 'preset', preset: 'front', distance: CLEAN_VIEW_DISTANCE })
  }

  return (
    <nav aria-label="Modul" className="panel pointer-events-auto flex gap-0.5 p-1">
      {MODE_TABS.map((tab) => {
        const active = !intro && tab.id === mode
        const Icon = tab.icon
        return (
          <motion.button
            key={tab.id}
            type="button"
            onClick={() => openMode(tab.id)}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className={`relative flex min-h-10 items-center gap-1.5 rounded-[var(--radius-control)] px-3 text-caption font-semibold transition-colors duration-[var(--duration-hover)] max-sm:min-w-10 max-sm:justify-center max-sm:px-2.5 ${
              active ? 'text-on-accent' : 'text-fg-secondary hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg'
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-tab-indicator"
                className="absolute inset-0 rounded-[var(--radius-control)] bg-accent-fill"
                transition={reduceMotion ? { duration: 0 } : INDICATOR_SPRING}
              />
            )}
            <Icon className="relative size-4" strokeWidth={2.2} aria-hidden />
            <span className={`relative ${active ? 'max-[400px]:hidden' : 'hidden md:inline'}`}>{tab.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
