'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const PRESS_TRANSITION =
  'transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[0.97]'

export function Hero() {
  const setMode = useAppStore((state) => state.setMode)
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      aria-label="Selamat datang"
      className="panel flex max-h-[45dvh] flex-col gap-4 overflow-y-auto p-5 md:max-h-none md:h-full md:justify-center md:gap-6 md:p-7"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-fg md:text-title xl:text-[30px]">
        Kenali gigimu, dari luar sampai akar.
      </h1>
      <p className="text-[15px] leading-relaxed text-fg-secondary">
        Putar model 3D gigi, lihat bagian-bagiannya, lalu pelajari masalah yang sering terjadi.
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setMode('explore')}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-fill px-5 text-[15px] font-semibold text-on-accent hover:bg-[var(--button-primary-bg-hover)] ${PRESS_TRANSITION}`}
        >
          Mulai menjelajah <ArrowRight className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setMode('diseases')}
          className={`min-h-11 rounded-[var(--radius-control)] px-4 text-[15px] font-semibold text-accent underline-offset-4 hover:bg-[var(--button-ghost-bg-hover)] hover:underline ${PRESS_TRANSITION}`}
        >
          Lihat masalah gigi
        </button>
      </div>
      <p className="border-t border-line pt-3 text-[15px] text-fg-muted">Untuk belajar, bukan diagnosis.</p>
    </motion.section>
  )
}
