'use client'

import { Timer } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { RECOMMENDED_SECONDS } from './cleanTools'
import { formatDuration, useCleaningTimer } from './useCleaningTimer'

const gradeTone = (score: number) => (score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger')

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-caption text-fg-secondary">
        <span>{label}</span>
        <span className="tabular-nums text-fg">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--chip-bg)]">
        <div
          className="h-full origin-left rounded-full bg-accent-fill transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)]"
          style={{ transform: `scaleX(${value / 100})` }}
        />
      </div>
    </div>
  )
}

export function ScoreSummary() {
  const stats = useCleaningStore((state) => state.stats)
  const elapsed = useCleaningTimer()
  const score = Math.round(stats.overall)

  return (
    <div className="mt-4">
      <div role="status" aria-label={`Skor kebersihan ${score} persen`} className="flex items-end justify-between">
        <p className={`font-display tabular-nums text-6xl leading-none font-semibold ${gradeTone(score)}`}>
          {score}
          <span className="font-display text-title text-fg-muted">%</span>
        </p>
        <p className="tabular-nums flex items-center gap-1.5 pb-1 text-caption text-fg-secondary">
          <Timer className="size-4" aria-hidden />
          {formatDuration(elapsed)} / 2:00
        </p>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--chip-bg)]">
        <div
          className="h-full origin-left rounded-full bg-fg-muted transition-transform duration-500 ease-linear"
          style={{ transform: `scaleX(${Math.min(1, elapsed / RECOMMENDED_SECONDS)})` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Meter label="Gigi" value={stats.surface} />
        <Meter label="Sela" value={stats.interdental} />
        <Meter label="Lidah" value={stats.tongue} />
      </div>
    </div>
  )
}
