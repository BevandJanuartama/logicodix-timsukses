'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { findHabitScenario, habitStageIndex } from '@/lib/data/habitScenarios'
import { useSimulatorStore, type HabitId } from '@/lib/simulatorStore'
import { BulletList, SectionTitle } from '@/components/ui/shell/PanelParts'
import { SectionToggle } from './SectionToggle'
import { StephanCurve } from './StephanCurve'

const SPEEDS = [1, 2, 4]
const SLIDER_STEPS = 1000

function TimelinePlayer({ timeline }: { timeline: [string, string] }) {
  const progress = useSimulatorStore((state) => state.progress)
  const playing = useSimulatorStore((state) => state.playing)
  const speed = useSimulatorStore((state) => state.speed)
  const setPlaying = useSimulatorStore((state) => state.setPlaying)
  const setProgress = useSimulatorStore((state) => state.setProgress)
  const setSpeed = useSimulatorStore((state) => state.setSpeed)
  const percent = Math.round(progress * 100)

  return (
    <div className="rounded-2xl bg-white/70 p-3.5 ring-1 ring-ink/8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Jeda' : 'Putar'}
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral text-white shadow-lg shadow-coral/30 transition-transform active:scale-95"
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
            className="h-7 w-full accent-coral"
          />
          <div className="flex justify-between text-[11px] font-semibold text-ink/55">
            <span>{timeline[0]}</span>
            <span className="text-ink tabular-nums">{percent}%</span>
            <span>{timeline[1]}</span>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <div role="group" aria-label="Kecepatan" className="flex gap-1 rounded-xl bg-ink/5 p-1">
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speed === value}
              onClick={() => setSpeed(value)}
              className="rounded-lg px-2.5 py-1 text-xs font-bold text-ink/55 aria-pressed:bg-white aria-pressed:text-ink aria-pressed:shadow"
            >
              {value}×
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setProgress(0)
            setPlaying(true)
          }}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-ink/65 hover:bg-ink/5"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Ulang
        </button>
      </div>
    </div>
  )
}

export function HabitTimeline({ habitId }: { habitId: HabitId }) {
  const progress = useSimulatorStore((state) => state.progress)
  const scenario = findHabitScenario(habitId)
  if (!scenario) return null
  const stageIndex = habitStageIndex(scenario, progress)
  const stage = scenario.stages[stageIndex]

  return (
    <section aria-label={scenario.title}>
      <SectionTitle>Garis waktu</SectionTitle>
      <TimelinePlayer timeline={scenario.timeline} />

      <article aria-live="polite" className="mt-3 rounded-2xl bg-coral/8 p-3.5">
        <ol aria-hidden className="mb-2 flex gap-1">
          {scenario.stages.map((item, index) => (
            <li
              key={item.startsAt}
              className={`h-1.5 flex-1 rounded-full transition-colors ${index <= stageIndex ? 'bg-coral' : 'bg-ink/10'}`}
            />
          ))}
        </ol>
        <p className="text-[11px] font-bold tracking-wider text-coral uppercase">
          Tahap {stageIndex + 1} dari {scenario.stages.length}
        </p>
        <h3 className="mt-0.5 text-[15px] font-extrabold">{stage.title}</h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink/80">{stage.description}</p>
      </article>

      {scenario.inspectToothId && (
        <SectionToggle
          toothId={scenario.inspectToothId}
          hint="Belah geraham untuk melihat lubang menembus dentin hingga pulpa."
        />
      )}

      {habitId === 'boba' && (
        <>
          <SectionTitle>Mengapa frekuensi gula penting</SectionTitle>
          <StephanCurve />
        </>
      )}

      <SectionTitle>Dampak</SectionTitle>
      <BulletList items={scenario.impacts} tone="coral" />
      <SectionTitle>Cara mencegah</SectionTitle>
      <BulletList items={scenario.prevention} tone="mint" />
    </section>
  )
}
