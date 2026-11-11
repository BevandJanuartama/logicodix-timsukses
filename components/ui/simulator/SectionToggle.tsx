'use client'

import { Scissors } from 'lucide-react'
import { focusScene } from '@/lib/sceneFocus'
import { sectionedToothOf, useAppStore } from '@/lib/store'

export function SectionToggle({ toothId, hint }: { toothId: string; hint: string }) {
  const sectioned = useAppStore((state) => sectionedToothOf(state) === toothId)
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/60 p-3 ring-1 ring-ink/8">
      <Scissors className="size-4 shrink-0 text-ink/50" aria-hidden />
      <p className="flex-1 text-[12.5px] leading-snug text-ink/70">{hint}</p>
      <button
        type="button"
        aria-pressed={sectioned}
        onClick={() => focusScene({ toothId, section: !sectioned })}
        className="shrink-0 rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white aria-pressed:bg-coral"
      >
        {sectioned ? 'Tutup' : `Belah gigi ${toothId}`}
      </button>
    </div>
  )
}
