'use client'

import { useAppStore } from '@/lib/store'
import type { Lod } from '@/lib/types'

const LEVELS: { id: Lod; label: string }[] = [
  { id: 'macro', label: 'Makro' },
  { id: 'meso', label: 'Meso' },
  { id: 'micro', label: 'Mikro' },
]

export function LodIndicator() {
  const lod = useAppStore((state) => state.lod)
  const zoomLevel = useAppStore((state) => state.zoomLevel)
  const current = LEVELS.find((level) => level.id === lod) ?? LEVELS[0]

  return (
    <div
      role="status"
      aria-label={`Tingkat detail ${current.label}`}
      className="panel pointer-events-none fixed top-[68px] left-2.5 z-10 w-[132px] px-2.5 py-2 sm:top-[76px] sm:left-3 lg:top-auto lg:bottom-[84px] lg:left-5"
    >
      <ol className="flex gap-0.5">
        {LEVELS.map((level) => (
          <li
            key={level.id}
            className={`flex-1 rounded-[4px] py-1 text-center text-caption font-semibold transition-colors duration-[var(--duration-hover)] ${
              level.id === lod ? 'bg-accent-fill text-on-accent' : 'text-fg-muted'
            }`}
          >
            {level.label}
          </li>
        ))}
      </ol>
      <div className="mt-2 h-0.5 overflow-hidden bg-line-strong">
        <div
          className="h-full origin-left bg-accent transition-transform duration-200"
          style={{ transform: `scaleX(${zoomLevel})` }}
        />
      </div>
    </div>
  )
}
