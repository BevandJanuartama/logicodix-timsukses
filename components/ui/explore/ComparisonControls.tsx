'use client'

import { useAppStore } from '@/lib/store'
import type { ComparisonMode } from '@/lib/types'

const OPTIONS: { id: ComparisonMode; label: string }[] = [
  { id: 'off', label: 'Normal' },
  { id: 'side-by-side', label: 'Berdampingan' },
  { id: 'overlay', label: 'Tumpang tindih' },
]

const HINTS: Record<ComparisonMode, string> = {
  off: 'Tampilkan satu jenis gigi saja.',
  'side-by-side': 'Gigi susu di kiri, gigi dewasa di kanan. Bandingkan ukuran dan jumlahnya.',
  overlay: 'Gigi susu dibuat tembus pandang di atas gigi dewasa. Lihat gigi mana yang nanti menggantikannya.',
}

const OPACITY_STEPS = 100

export function ComparisonControls() {
  const mode = useAppStore((state) => state.comparisonMode)
  const setMode = useAppStore((state) => state.setComparisonMode)
  const opacity = useAppStore((state) => state.overlayOpacity)
  const setOpacity = useAppStore((state) => state.setOverlayOpacity)
  const percent = Math.round(opacity * 100)

  return (
    <div className="space-y-2">
      <div role="group" aria-label="Mode perbandingan" className="grid grid-cols-3 gap-1 rounded-[var(--radius-control)] bg-surface p-1">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mode === option.id}
            onClick={() => setMode(option.id)}
            className="min-h-10 cursor-pointer rounded-[var(--radius-control)] px-1 text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="px-0.5 text-caption text-fg-secondary">{HINTS[mode]}</p>
      {mode === 'overlay' && (
        <label className="block px-0.5">
          <span className="flex items-center justify-between text-caption font-semibold text-fg-secondary">
            Kejelasan gigi susu
            <span className="font-display tabular-nums text-fg">{percent}%</span>
          </span>
          <input
            type="range"
            min={10}
            max={OPACITY_STEPS}
            value={percent}
            onChange={(event) => setOpacity(Number(event.target.value) / OPACITY_STEPS)}
            aria-valuetext={`${percent}%`}
            className="h-7 w-full cursor-pointer accent-[var(--accent-fill)]"
          />
        </label>
      )}
    </div>
  )
}
