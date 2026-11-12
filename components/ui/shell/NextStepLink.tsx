'use client'

import { ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'

const STORY_ORDER: { mode: AppMode; label: string }[] = [
  { mode: 'explore', label: 'Anatomi' },
  { mode: 'diseases', label: 'Penyakit' },
  { mode: 'destroy', label: 'Simulasi' },
  { mode: 'clean', label: 'Bersihkan' },
  { mode: 'quiz', label: 'Kuis' },
]

export function NextStepLink() {
  const mode = useAppStore((state) => state.mode)
  const setMode = useAppStore((state) => state.setMode)
  const next = STORY_ORDER[STORY_ORDER.findIndex((step) => step.mode === mode) + 1]
  if (!next) return null

  return (
    <button
      type="button"
      onClick={() => setMode(next.mode)}
      className="group flex min-h-11 w-full shrink-0 cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 text-left text-caption text-fg-secondary transition-[color,transform] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
    >
      <span>
        Langkah berikutnya: <span className="font-semibold text-accent">{next.label}</span>
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 shrink-0 text-accent transition-transform duration-[var(--duration-hover)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
      />
    </button>
  )
}
