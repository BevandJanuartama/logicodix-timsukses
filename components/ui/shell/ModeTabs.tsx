'use client'

import { useRef, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FlaskConical, ListChecks, ScanSearch, Sparkles, Stethoscope } from 'lucide-react'
import { CLEAN_VIEW_DISTANCE } from '@/components/ui/clean/cleanTools'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'

const MODE_TABS: { id: AppMode; label: string; icon: typeof ScanSearch }[] = [
  { id: 'explore', label: 'Anatomi', icon: ScanSearch },
  { id: 'diseases', label: 'Kondisi', icon: Stethoscope },
  { id: 'destroy', label: 'Simulasi', icon: FlaskConical },
  { id: 'clean', label: 'Bersihkan', icon: Sparkles },
  { id: 'quiz', label: 'Kuis', icon: ListChecks },
]

const PILL_SPRING = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 } as const

type ModeTabsVariant = 'top' | 'bottom'

export function ModeTabs({ variant = 'top' }: { variant?: ModeTabsVariant }) {
  const mode = useAppStore((state) => state.mode)
  const intro = useAppStore((state) => state.intro)
  const setMode = useAppStore((state) => state.setMode)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const reduceMotion = useReducedMotion()
  const list = useRef<HTMLDivElement>(null)
  const bottom = variant === 'bottom'

  const openMode = (next: AppMode) => {
    setMode(next)
    if (next === 'clean') requestCamera({ kind: 'preset', preset: 'front', distance: CLEAN_VIEW_DISTANCE })
  }

  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const tabs = Array.from(list.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = tabs[(tabs.indexOf(document.activeElement as HTMLElement) + step + tabs.length) % tabs.length]
    next?.focus()
    next?.click()
  }

  const focusable = intro ? MODE_TABS[0].id : mode

  return (
    <div
      ref={list}
      role="tablist"
      aria-label="Modul"
      aria-orientation="horizontal"
      onKeyDown={moveFocus}
      className={
        bottom
          ? 'pointer-events-auto grid h-[var(--mobile-tabbar-h)] grid-cols-5 bg-surface-raised px-1 pb-[env(safe-area-inset-bottom)]'
          : 'pointer-events-auto flex items-center gap-1'
      }
    >
      {MODE_TABS.map((tab) => {
        const active = !intro && tab.id === mode
        const Icon = tab.icon
        return (
          <motion.button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={tab.id === focusable ? 0 : -1}
            onClick={() => openMode(tab.id)}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
            className={`relative flex cursor-pointer items-center justify-center transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] ${
              bottom
                ? 'min-h-14 flex-col gap-0.5 text-[0.875rem] leading-4'
                : 'min-h-10 gap-2 rounded-full px-4 text-caption'
            } ${
              active
                ? 'font-semibold text-accent'
                : `text-fg-secondary hover:text-fg ${bottom ? '' : 'hover:bg-surface-sunken'}`
            }`}
          >
            {active && (
              <motion.span
                layoutId={bottom ? 'mode-pill-mobile' : 'mode-pill'}
                className="absolute inset-x-1 inset-y-1 rounded-full bg-accent-tint"
                transition={reduceMotion ? { duration: 0 } : PILL_SPRING}
              />
            )}
            <Icon className="relative size-[1.125rem]" strokeWidth={2.1} aria-hidden />
            <span className="relative">{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
