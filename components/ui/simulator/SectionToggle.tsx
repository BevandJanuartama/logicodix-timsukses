'use client'

import { Scissors } from 'lucide-react'
import { focusScene } from '@/lib/sceneFocus'
import { sectionedToothOf, useAppStore } from '@/lib/store'

export function SectionToggle({ toothId, label }: { toothId: string; label: string }) {
  const sectioned = useAppStore((state) => sectionedToothOf(state) === toothId)
  return (
    <button
      type="button"
      aria-pressed={sectioned}
      onClick={() => focusScene({ toothId, section: !sectioned })}
      className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-3 text-caption font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)] aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
    >
      <Scissors className="size-4" aria-hidden />
      {sectioned ? 'Tutup belahan gigi' : label}
    </button>
  )
}
