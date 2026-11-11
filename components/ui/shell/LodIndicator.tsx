'use client'

import { useAppStore } from '@/lib/store'
import type { Lod } from '@/lib/types'

const LEVELS: { id: Lod; label: string; description: string }[] = [
  { id: 'macro', label: 'Makro', description: 'Lengkung rahang utuh' },
  { id: 'meso', label: 'Meso', description: 'Fokus satu gigi' },
  { id: 'micro', label: 'Mikro', description: 'Penampang lapisan' },
]

export function LodIndicator() {
  const lod = useAppStore((state) => state.lod)
  const zoomLevel = useAppStore((state) => state.zoomLevel)
  const current = LEVELS.find((level) => level.id === lod) ?? LEVELS[0]

  return (
    <div
      role="status"
      aria-label={`Tingkat detail ${current.label}`}
      className="glass pointer-events-none fixed top-[68px] left-2.5 z-10 w-[150px] rounded-2xl px-3 py-2.5 sm:top-[76px] sm:left-3 sm:w-[168px] lg:top-auto lg:bottom-[84px] lg:left-5"
    >
      <p className="text-[10px] font-bold tracking-[0.14em] text-ink/45 uppercase">Tingkat detail</p>
      <ol className="mt-1.5 flex gap-1">
        {LEVELS.map((level) => (
          <li
            key={level.id}
            className={`flex-1 rounded-md py-1 text-center text-[11px] font-bold transition-colors ${
              level.id === lod ? 'bg-brand text-white' : 'bg-ink/5 text-ink/40'
            }`}
          >
            {level.label}
          </li>
        ))}
      </ol>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full origin-left rounded-full bg-brand transition-transform duration-200"
          style={{ transform: `scaleX(${zoomLevel})` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-ink/55">{current.description}</p>
    </div>
  )
}
