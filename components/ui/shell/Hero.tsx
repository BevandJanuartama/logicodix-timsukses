'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MousePointerClick } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function Hero() {
  const intro = useAppStore((state) => state.intro)
  const setMode = useAppStore((state) => state.setMode)
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 18

  return (
    <AnimatePresence>
      {intro && (
        <motion.div
          key="hero"
          className="pointer-events-none fixed inset-0 z-20 flex items-end p-3 sm:p-6 lg:items-center lg:p-12"
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: offset }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="glass pointer-events-auto w-full max-w-[440px] rounded-3xl p-5 sm:p-7">
            <h1 className="text-[28px] leading-[1.08] font-extrabold tracking-tight sm:text-[38px]">
              Lihat gigi dari lengkung rahang hingga <span className="text-brand">pulpa</span>.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              Putar, perbesar, dan belah model 3D untuk mengenali sepuluh struktur gigi beserta penyakit yang mengenainya.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setMode('explore')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-ink/20 transition-colors hover:bg-brand-600"
              >
                Mulai eksplorasi <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setMode('diseases')}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-coral transition-colors hover:bg-coral/10"
              >
                Katalog penyakit
              </button>
            </div>
            <p className="mt-5 flex items-center gap-1.5 text-xs text-ink/55">
              <MousePointerClick className="size-3.5 shrink-0" aria-hidden />
              Seret untuk memutar · scroll atau pinch untuk zoom · klik untuk memilih
            </p>
            <p className="mt-3 border-t border-ink/10 pt-3 text-[11px] leading-snug text-ink/50">
              Konten edukatif, bukan alat diagnosis. Keluhan gigi dan mulut perlu diperiksa tenaga kesehatan.
            </p>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
