'use client'

import { Timer } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { RECOMMENDED_SECONDS } from './cleanTools'
import { formatDuration, useCleaningTimer } from './useCleaningTimer'

function Meter({ label, value }: { label: string; value: number }) {
  const rounded = Math.round(value)
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-caption font-semibold text-fg-secondary">
        <span>{label}</span>
        <span className="font-display tabular-nums text-fg">{rounded}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full origin-left rounded-full bg-success transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)]"
          style={{ transform: `scaleX(${Math.min(1, Math.max(0, value / 100))})` }}
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
    <div className="mt-4 rounded-[var(--radius-control)] bg-surface-sunken p-4">
      <div role="status" aria-label={`Skor kebersihan ${score} persen`} className="flex items-end justify-between gap-3">
        <div>
          <p className="text-caption font-semibold text-fg-muted">Kebersihan mulut</p>
          <p className="mt-1 font-display text-display leading-none font-semibold text-fg tabular-nums">
            {score}
            <span className="ml-0.5 font-display text-title text-fg-muted">%</span>
          </p>
        </div>
        <p className="flex items-center gap-1.5 pb-1 text-caption font-semibold text-fg-secondary">
          <Timer className="size-4 text-accent" aria-hidden />
          <span className="font-display tabular-nums text-body">{formatDuration(elapsed)}</span> dari{' '}
          <span className="font-display tabular-nums text-body">{formatDuration(RECOMMENDED_SECONDS)}</span>
        </p>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-sand">
        <div
          className="h-full origin-left rounded-full bg-accent-fill transition-transform duration-500 ease-linear"
          style={{ transform: `scaleX(${Math.min(1, elapsed / RECOMMENDED_SECONDS)})` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 bg-surface-raised p-3 rounded-[var(--radius-thumb)]">
        <Meter label="Gigi" value={stats.surface} />
        <Meter label="Sela" value={stats.interdental} />
        <Meter label="Lidah" value={stats.tongue} />
      </div>
    </div>
  )
}
