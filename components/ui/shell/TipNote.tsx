'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { CLEAN_TOOLS } from '@/components/ui/clean/cleanTools'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'

const STORAGE_KEY = 'dx-tip-dismissed'
const AUTO_HIDE_MS = 8000

let cleanTipDismissedThisSession = false

const TIPS = ['Seret untuk memutar', 'Gulir atau cubit untuk memperbesar', 'Ketuk bagian gigi untuk detail']

function readDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeDismissed() {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    return
  }
}

export function TipNote() {
  const [visible, setVisible] = useState(false)
  const [cleanDismissed, setCleanDismissed] = useState(cleanTipDismissedThisSession)
  const reduceMotion = useReducedMotion()
  const mode = useAppStore((state) => state.mode)
  const hotspotTouched = useAppStore((state) => state.hotspotTouched)
  const tool = useCleaningStore((state) => state.tool)

  useEffect(() => {
    setVisible(!readDismissed())
  }, [])

  const generalTipActive = mode === 'explore' && visible && !hotspotTouched

  useEffect(() => {
    if (!generalTipActive) return
    const timer = window.setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    return () => window.clearTimeout(timer)
  }, [generalTipActive])

  const dismissCleanTip = () => {
    cleanTipDismissedThisSession = true
    setCleanDismissed(true)
  }

  if (mode === 'clean') {
    if (cleanDismissed) return null
    const activeTool = CLEAN_TOOLS.find((item) => item.id === tool) ?? CLEAN_TOOLS[0]

    return (
      <motion.aside
        key={`clean-tip-${activeTool.id}`}
        aria-label="Tips teknik menyikat"
        className="absolute inset-x-3 top-3 z-10 max-w-[280px] rounded-[var(--radius-control)] bg-note p-4 pr-12 text-ink shadow-[var(--shadow-float)] md:inset-x-auto md:top-4 md:right-4"
        style={{ rotate: '-1.5deg' }}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <h2 className="font-display text-[17px] font-semibold">Tips {activeTool.name}</h2>
        <p className="mt-1.5 text-[15px] leading-snug">{activeTool.hint}</p>
        <p className="mt-1.5 text-[15px] leading-snug opacity-80">
          Seret pada gigi untuk menggosok · Klik kanan atau 2 jari untuk memutar
        </p>
        <button
          type="button"
          onClick={dismissCleanTip}
          aria-label="Tutup tips"
          className="absolute top-1 right-1 grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-black/5 active:scale-[0.94]"
        >
          <X className="size-5" aria-hidden />
        </button>
      </motion.aside>
    )
  }

  if (!generalTipActive) return null

  const dismiss = () => {
    writeDismissed()
    setVisible(false)
  }

  return (
    <motion.aside
      aria-label="Tips"
      className="absolute inset-x-3 top-3 z-10 max-w-[260px] rounded-[var(--radius-control)] bg-note p-4 pr-14 text-ink shadow-[var(--shadow-float)] md:inset-x-auto md:top-4 md:right-4"
      style={{ rotate: '-1.5deg' }}
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <h2 className="font-display text-[17px] font-semibold">Tips</h2>
      <ul className="mt-2 space-y-1 text-[15px] leading-snug">
        {TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup tips"
        className="absolute top-1 right-1 grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-black/5 active:scale-[0.94]"
      >
        <X className="size-5" aria-hidden />
      </button>
    </motion.aside>
  )
}
