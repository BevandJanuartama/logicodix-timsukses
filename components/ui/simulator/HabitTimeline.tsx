'use client'

import { findHabitScenario, habitStageIndex } from '@/lib/data/habitScenarios'
import { useSimulatorStore, type HabitId } from '@/lib/simulatorStore'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { BulletList, SectionTitle } from '@/components/ui/shell/PanelParts'
import { SectionToggle } from './SectionToggle'
import { StephanCurve } from './StephanCurve'
import { TimelinePlayer } from './TimelinePlayer'

export function HabitTimeline({ habitId }: { habitId: HabitId }) {
  const progress = useSimulatorStore((state) => state.progress)
  const scenario = findHabitScenario(habitId)
  if (!scenario) return null
  const stageIndex = habitStageIndex(scenario, progress)
  const stage = scenario.stages[stageIndex]

  return (
    <section aria-label={scenario.title} className="mt-3 space-y-3">
      <div className="md:hidden">
        <TimelinePlayer timeline={scenario.timeline} activeStageLabel={stage.title} />
      </div>

      <article aria-live="polite" className="rounded-[var(--radius-control)] bg-surface-sunken p-4">
        <ol aria-hidden className="mb-3 flex gap-1.5">
          {scenario.stages.map((item, index) => (
            <li
              key={item.startsAt}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-[var(--duration-state)] ${
                index <= stageIndex ? 'bg-accent-fill' : 'bg-line-strong'
              }`}
            />
          ))}
        </ol>
        <p className="text-caption font-semibold text-fg-muted tabular-nums">
          Tahap {stageIndex + 1} dari {scenario.stages.length}
        </p>
        <h3 className="mt-0.5 font-display text-subtitle font-semibold text-fg">{stage.title}</h3>
        <p className="mt-1.5 text-body text-fg-secondary">{stage.description}</p>
      </article>

      <div>
        <SectionTitle>Cara mencegah</SectionTitle>
        <BulletList items={scenario.prevention} tone="mint" />
      </div>

      {scenario.inspectToothId && <SectionToggle toothId={scenario.inspectToothId} label="Belah gigi geraham" />}

      {habitId === 'boba' && (
        <ExploreDisclosure label="Kenapa gula berbahaya?">
          <StephanCurve />
        </ExploreDisclosure>
      )}

      <ExploreDisclosure label="Dampak jika kebiasaan berlanjut">
        <BulletList items={scenario.impacts} tone="coral" />
      </ExploreDisclosure>
    </section>
  )
}
