'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, RotateCcw, X } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { useStageBox } from '@/components/ui/shell/useStageBox'
import { RECOMMENDED_SECONDS } from './cleanTools'
import { formatDuration, useCleaningTimer } from './useCleaningTimer'

const RINSE_VISIBLE_MS = 1600
const EASE_OUT = [0.23, 1, 0.32, 1] as const

export function CleanSuccessToast() {
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const finished = useCleaningStore((state) => state.finishedAt !== null)
  const overall = useCleaningStore((state) => state.stats.overall)
  const resetNonce = useCleaningStore((state) => state.resetNonce)
  const reset = useCleaningStore((state) => state.reset)
  const elapsed = useCleaningTimer()
  const stage = useStageBox()
  const reduceMotion = useReducedMotion()
  const [dismissedFor, setDismissedFor] = useState(-1)
  const visible = cleaning && finished && dismissedFor !== resetNonce && stage !== null
  const offsetY = reduceMotion ? 0 : -12

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: offsetY, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: offsetY, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{ left: stage?.centerX, top: (stage?.top ?? 0) + 12, width: Math.min((stage?.width ?? 340) - 24, 340) }}
          className="panel fixed z-40 -translate-x-1/2 p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 shrink-0 text-success" aria-hidden />
            <div className="flex-1">
              <p className="tabular-nums text-body font-semibold text-fg">
                {Math.round(overall)}% · {formatDuration(elapsed)}
              </p>
              <p className="text-caption text-fg-secondary">
                {elapsed < RECOMMENDED_SECONDS ? 'Di dunia nyata, sikat sekitar 2 menit.' : 'Sikat 2× sehari, bersihkan sela gigi.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedFor(resetNonce)}
              aria-label="Tutup notifikasi"
              className="grid size-9 cursor-pointer place-items-center rounded-[var(--radius-control)] text-fg-muted hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-3 flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-control)] bg-accent-fill text-caption font-semibold text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
          >
            <RotateCcw className="size-4" aria-hidden />
            Ulangi
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MouthwashOverlay() {
  const mouthwashNonce = useCleaningStore((state) => state.mouthwashNonce)
  const reduceMotion = useReducedMotion()
  const [rinsing, setRinsing] = useState(false)

  useEffect(() => {
    if (mouthwashNonce === 0) return
    setRinsing(true)
    const timer = setTimeout(() => setRinsing(false), RINSE_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [mouthwashNonce])

  return (
    <AnimatePresence>
      {rinsing && !reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-10 bg-[var(--chip-bg)]"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: '-10%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        />
      )}
    </AnimatePresence>
  )
}
