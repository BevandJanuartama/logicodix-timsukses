'use client'

import { Timer } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { formatDuration, useCleaningTimer } from './useCleaningTimer'

const RECOMMENDED_SECONDS = 120

const GRADES = [
  { min: 95, label: 'Bersih menyeluruh', color: 'var(--color-mint)' },
  { min: 80, label: 'Hampir selesai', color: 'var(--color-mint)' },
  { min: 50, label: 'Lanjutkan menggosok', color: 'var(--color-amber)' },
  { min: 0, label: 'Plak masih banyak', color: 'var(--color-coral)' },
]

const gradeFor = (score: number) => GRADES.find((grade) => score >= grade.min) ?? GRADES[GRADES.length - 1]

function ScoreRing({ value, size = 104 }: { value: number; size?: number }) {
  const radius = (size - 14) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeOpacity={0.1} strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={gradeFor(value).color}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <p className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="block text-2xl leading-none font-extrabold tabular-nums">{Math.round(value)}%</span>
          <span className="mt-0.5 block text-[10px] font-bold tracking-wider text-ink/45 uppercase">Bersih</span>
        </span>
      </p>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12.5px] font-semibold">
        <span className="text-ink/65">{label}</span>
        <span className="tabular-nums">{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full origin-left rounded-full transition-transform duration-300"
          style={{ transform: `scaleX(${value / 100})`, background: color }}
        />
      </div>
    </div>
  )
}

export function ScoreSummary() {
  const stats = useCleaningStore((state) => state.stats)
  const elapsed = useCleaningTimer()
  const grade = gradeFor(stats.overall)
  return (
    <>
      <div role="status" aria-label={`Skor kebersihan ${Math.round(stats.overall)} persen`} className="mt-4 flex items-center gap-4 rounded-3xl bg-white/60 p-3.5 ring-1 ring-ink/8">
        <ScoreRing value={stats.overall} />
        <div className="min-w-0 flex-1 space-y-2.5">
          <p className="text-sm font-extrabold" style={{ color: grade.color }}>
            {grade.label}
          </p>
          <Meter label="Permukaan gigi" value={stats.surface} color="var(--color-brand)" />
          <Meter label="Sela gigi" value={stats.interdental} color="var(--color-ink)" />
          <Meter label="Lidah" value={stats.tongue} color="var(--color-coral)" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-ink/[0.04] px-3.5 py-2.5">
        <Timer className="size-4 text-ink/55" aria-hidden />
        <div className="flex-1">
          <div className="flex justify-between text-[12.5px] font-semibold">
            <span className="text-ink/65">Durasi menyikat</span>
            <span className="tabular-nums">{formatDuration(elapsed)} / 2:00</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full origin-left rounded-full bg-brand transition-transform duration-500"
              style={{ transform: `scaleX(${Math.min(1, elapsed / RECOMMENDED_SECONDS)})` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
