'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FlaskConical, ListChecks, ScanSearch, Sparkles, Stethoscope } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'
import { LibraryMenu } from './LibraryMenu'
import { ToothMark } from './ToothMark'

const MODE_TABS: { id: AppMode; label: string; icon: typeof ScanSearch; tint: string }[] = [
  { id: 'explore', label: 'Anatomi', icon: ScanSearch, tint: 'bg-brand' },
  { id: 'diseases', label: 'Penyakit', icon: Stethoscope, tint: 'bg-coral' },
  { id: 'destroy', label: 'Simulasi', icon: FlaskConical, tint: 'bg-coral' },
  { id: 'clean', label: 'Bersihkan', icon: Sparkles, tint: 'bg-mint' },
  { id: 'quiz', label: 'Kuis', icon: ListChecks, tint: 'bg-amber' },
]

const CLEAN_VIEW_DISTANCE = 7.2

function ModeTabs() {
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
    <nav aria-label="Modul" className="glass pointer-events-auto flex rounded-2xl p-1">
      {MODE_TABS.map((tab) => {
        const active = !intro && tab.id === mode
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => openMode(tab.id)}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-colors sm:px-3.5 max-sm:px-2.5 ${
              active ? 'text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-tab-indicator"
                className={`absolute inset-0 rounded-xl shadow-md ${tab.tint}`}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative size-4" strokeWidth={2.4} aria-hidden />
            <span className={`relative ${active ? 'max-[400px]:hidden' : 'hidden md:inline'}`}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function TopBar() {
  const setIntro = useAppStore((state) => state.setIntro)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const selectTarget = useAppStore((state) => state.selectTarget)

  const goHome = () => {
    selectTarget(null, null)
    setIntro(true)
    requestCamera({ kind: 'reset' })
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center gap-1.5 p-2 sm:gap-2 sm:p-3 lg:p-4">
      <button
        type="button"
        onClick={goHome}
        aria-label="Dental Explorer Edukasi anatomi gigi 3D, kembali ke beranda"
        className="glass pointer-events-auto flex shrink-0 items-center gap-2.5 rounded-2xl p-1 sm:p-1.5 sm:pr-4"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
          <ToothMark />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[15px] font-extrabold tracking-tight">Dental Explorer</span>
          <span className="block text-[11px] font-medium text-ink/55">Edukasi anatomi gigi 3D</span>
        </span>
      </button>
      <div className="ml-auto lg:ml-3">
        <ModeTabs />
      </div>
      <div className="lg:ml-auto">
        <LibraryMenu />
      </div>
    </header>
  )
}
