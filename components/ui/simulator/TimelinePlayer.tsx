'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { useSimulatorStore } from '@/lib/simulatorStore'
import { ExploreChip } from '@/components/ui/explore/ExploreChip'

const SPEEDS = [1, 2, 4]
const SLIDER_STEPS = 1000

export function TimelinePlayer({ timeline }: { timeline: [string, string] }) {
  const progress = useSimulatorStore((state) => state.progress)
  const playing = useSimulatorStore((state) => state.playing)
  const speed = useSimulatorStore((state) => state.speed)
  const setPlaying = useSimulatorStore((state) => state.setPlaying)
  const setProgress = useSimulatorStore((state) => state.setProgress)
  const setSpeed = useSimulatorStore((state) => state.setSpeed)
  const percent = Math.round(progress * 100)

  return (
    <div className="rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Jeda' : 'Putar'}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-control)] bg-accent-fill text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--accent-fill-hover)] active:scale-[var(--scale-press)]"
        >
          {playing ? <Pause className="size-5" fill="currentColor" /> : <Play className="ml-0.5 size-5" fill="currentColor" />}
        </button>
        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={SLIDER_STEPS}
            value={Math.round(progress * SLIDER_STEPS)}
            onChange={(event) => {
              setPlaying(false)
              setProgress(Number(event.target.value) / SLIDER_STEPS)
            }}
            aria-label="Garis waktu"
            aria-valuetext={`${percent}%`}
            className="h-7 w-full cursor-pointer accent-[var(--accent-fill)]"
          />
          <div className="flex justify-between text-[11px] font-semibold text-fg-muted">
            <span>{timeline[0]}</span>
            <span className="telemetry text-fg tabular-nums">{percent}%</span>
            <span>{timeline[1]}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div role="group" aria-label="Kecepatan" className="flex gap-1">
          {SPEEDS.map((value) => (
            <ExploreChip key={value} pressed={speed === value} onClick={() => setSpeed(value)}>
              {value}×
            </ExploreChip>
          ))}
        </div>
        <ExploreChip
          onClick={() => {
            setProgress(0)
            setPlaying(true)
          }}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Ulang
        </ExploreChip>
      </div>
    </div>
  )
}
