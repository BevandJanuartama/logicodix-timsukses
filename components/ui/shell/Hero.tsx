'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Hand, Move3d, ZoomIn } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const GESTURES = [
  { icon: Move3d, label: 'Putar' },
  { icon: ZoomIn, label: 'Zoom' },
  { icon: Hand, label: 'Pilih' },
]

export function Hero() {
  const intro = useAppStore((state) => state.intro)
  const setMode = useAppStore((state) => state.setMode)
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 16

  return (
    <AnimatePresence>
      {intro && (
        <motion.div
          key="hero"
          className="pointer-events-none fixed inset-0 z-20 flex items-end p-3 sm:p-6 lg:items-center lg:p-12"
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: offset }}
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
        >
          <section className="panel pointer-events-auto w-full max-w-[400px] p-5 sm:p-6">
            <p className="telemetry text-[11px] text-fg-muted uppercase">10 struktur · 10 penyakit</p>
            <h1 className="mt-2 font-display text-[30px] leading-[1.05] font-extrabold tracking-tight text-fg sm:text-[38px]">
              Anatomi gigi, <span className="text-accent">3D</span>.
            </h1>
            <ul className="mt-4 flex gap-4 text-fg-secondary">
              {GESTURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5 text-xs font-medium">
                  <Icon className="size-4 text-accent" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('explore')}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-fill px-5 text-sm font-semibold text-on-accent transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-primary-bg-hover)] active:scale-[0.97]"
              >
                Mulai <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setMode('diseases')}
                className="min-h-11 rounded-[var(--radius-control)] px-4 text-sm font-semibold text-danger transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)] active:scale-[0.97]"
              >
                Penyakit
              </button>
            </div>
            <p className="mt-4 border-t border-line pt-3 text-[11px] leading-snug text-fg-muted">
              Edukasi, bukan diagnosis. Keluhan perlu tenaga kesehatan.
            </p>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
