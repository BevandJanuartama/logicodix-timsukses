'use client'

import { findHabitScenario, habitStageIndex } from '@/lib/data/habitScenarios'
import { useSimulatorStore, type HabitId } from '@/lib/simulatorStore'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { BulletList } from '@/components/ui/shell/PanelParts'
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
    <section aria-label={scenario.title} className="mt-3 space-y-2">
      <TimelinePlayer timeline={scenario.timeline} />

      <article aria-live="polite" className="rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-3">
        <ol aria-hidden className="mb-2 flex gap-1">
          {scenario.stages.map((item, index) => (
            <li
              key={item.startsAt}
              className={`h-1 flex-1 rounded-full transition-colors duration-[var(--duration-state)] ${index <= stageIndex ? 'bg-danger' : 'bg-line-strong'}`}
            />
          ))}
        </ol>
        <h3 className="font-display text-body font-semibold text-fg">
          <span className="mr-2 text-caption text-fg-muted tabular-nums">
            {stageIndex + 1}/{scenario.stages.length}
          </span>
          {stage.title}
        </h3>
        <p className="mt-1 text-caption text-fg-secondary">{stage.description}</p>
      </article>

      {scenario.inspectToothId && <SectionToggle toothId={scenario.inspectToothId} label="Belah geraham" />}

      {habitId === 'boba' && <StephanCurve />}

      <ExploreDisclosure label="Dampak dan pencegahan">
        <BulletList items={scenario.impacts} tone="coral" />
        <div className="mt-3">
          <BulletList items={scenario.prevention} tone="mint" />
        </div>
      </ExploreDisclosure>
    </section>
  )
}
