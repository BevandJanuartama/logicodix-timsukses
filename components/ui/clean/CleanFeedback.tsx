'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, RotateCcw, X } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { formatDuration, useCleaningTimer } from './useCleaningTimer'

const RECOMMENDED_SECONDS = 120
const RINSE_VISIBLE_MS = 1600

export function CleanSuccessToast() {
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const finished = useCleaningStore((state) => state.finishedAt !== null)
  const overall = useCleaningStore((state) => state.stats.overall)
  const resetNonce = useCleaningStore((state) => state.resetNonce)
  const reset = useCleaningStore((state) => state.reset)
  const elapsed = useCleaningTimer()
  const reduceMotion = useReducedMotion()
  const [dismissedFor, setDismissedFor] = useState(-1)
  const visible = cleaning && finished && dismissedFor !== resetNonce

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="glass fixed top-[72px] left-1/2 z-40 w-[min(92vw,380px)] -translate-x-1/2 rounded-2xl p-4 lg:left-[calc((100%-424px)/2)]"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-mint" aria-hidden />
            <div className="flex-1">
              <p className="text-[15px] font-extrabold">
                Bersih {Math.round(overall)}% dalam {formatDuration(elapsed)}
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink/70">
                {elapsed < RECOMMENDED_SECONDS
                  ? 'Di dunia nyata, menyikat tetap butuh sekitar 2 menit agar semua permukaan benar-benar bersih.'
                  : 'Sikat 2× sehari, bersihkan sela gigi setiap hari, dan jangan lupa lidah.'}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-mint px-3 py-2 text-xs font-bold text-white"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Ulangi
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDismissedFor(resetNonce)}
              aria-label="Tutup notifikasi"
              className="grid size-7 place-items-center rounded-lg text-ink/50 hover:bg-ink/5"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
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
          className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-transparent via-brand/25 to-transparent"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: '-20%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  )
}
