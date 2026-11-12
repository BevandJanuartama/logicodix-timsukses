'use client'

import { findHabitScenario, habitStageIndex } from '@/lib/data/habitScenarios'
import { stagesForDisease } from '@/lib/knowledgeBase'
import { isClinicalTrack, useSimulatorStore } from '@/lib/simulatorStore'
import { useAppStore } from '@/lib/store'
import { CLINICAL_TIMELINES } from './plainStages'
import { StageScrubber } from './StageScrubber'
import { TimelinePlayer } from './TimelinePlayer'

export function CanvasScrubber() {
  const mode = useAppStore((state) => state.mode)
  const track = useSimulatorStore((state) => state.track)
  const stageIndex = useSimulatorStore((state) => state.stageIndex)
  const setStageIndex = useSimulatorStore((state) => state.setStageIndex)
  const progress = useSimulatorStore((state) => state.progress)

  if (mode !== 'destroy' || !track) return null

  if (isClinicalTrack(track)) {
    const stages = stagesForDisease(track)
    return (
      <div
        role="region"
        aria-label="Penggeser waktu di kanvas"
        className="pointer-events-auto absolute right-4 bottom-4 left-24 z-20 mx-auto hidden max-w-xl md:block"
      >
        <div className="panel p-2.5 shadow-[var(--shadow-float)]">
          <StageScrubber
            label="Tahap perkembangan"
            items={stages}
            activeIndex={stageIndex}
            indicatorId={`canvas-stage-${track}`}
            timeline={CLINICAL_TIMELINES[track]}
            onSelect={setStageIndex}
          />
        </div>
      </div>
    )
  }

  const scenario = findHabitScenario(track)
  if (!scenario) return null
  const activeStage = scenario.stages[habitStageIndex(scenario, progress)]

  return (
    <div
      role="region"
      aria-label="Penggeser waktu di kanvas"
      className="pointer-events-auto absolute right-4 bottom-4 left-24 z-20 mx-auto hidden max-w-xl md:block"
    >
      <div className="panel p-2 shadow-[var(--shadow-float)]">
        <TimelinePlayer timeline={scenario.timeline} activeStageLabel={activeStage?.title} />
      </div>
    </div>
  )
}

