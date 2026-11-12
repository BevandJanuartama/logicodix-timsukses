'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { findDisease, stagesForDisease } from '@/lib/knowledgeBase'
import { clinicalFocusTooth } from '@/lib/simulatorActions'
import { useSimulatorStore, type ClinicalTrackId } from '@/lib/simulatorStore'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { SourceLinks } from '@/components/ui/shell/PanelParts'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { CompareHold } from './CompareHold'
import { SectionToggle } from './SectionToggle'
import { StageScrubber } from './StageScrubber'

const SECTION_LABELS: Record<ClinicalTrackId, string> = {
  'DIS-001': 'Belah geraham',
  'DIS-003': 'Belah gigi seri',
}

export function ClinicalStages({ track }: { track: ClinicalTrackId }) {
  const stageIndex = useSimulatorStore((state) => state.stageIndex)
  const setStageIndex = useSimulatorStore((state) => state.setStageIndex)
  const reduceMotion = useReducedMotion()
  const stages = stagesForDisease(track)
  const stage = stages[stageIndex] ?? stages[0]
  const disease = findDisease(track)

  return (
    <section aria-label={`Tahapan ${disease?.displayName ?? track}`} className="mt-3 space-y-2">
      <StageScrubber
        label="Tahap"
        items={stages}
        activeIndex={stageIndex}
        indicatorId={`stage-indicator-${track}`}
        onSelect={setStageIndex}
      />
      <CompareHold activeIndex={stageIndex} onSelect={setStageIndex} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={stage.id}
          aria-live="polite"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-3"
        >
          <h3 className="font-display text-body font-semibold text-fg">{stage.title}</h3>
          <p className="mt-1 text-caption text-fg-secondary">{stage.description}</p>
        </motion.article>
      </AnimatePresence>

      <SectionToggle toothId={clinicalFocusTooth[track]} label={SECTION_LABELS[track]} />

      <ExploreDisclosure label="Detail klinis">
        <div className="space-y-2 text-caption text-fg-secondary">
          <p className="flex items-center gap-2">
            <StatusBadge contentId={stage.id} baseStatus={stage.status} />
            <span className="text-caption text-fg-muted">{stage.id}</span>
          </p>
          <p>
            <span className="font-semibold text-fg">Visual: </span>
            {stage.visualChange}
          </p>
          <p className="text-warning">{stage.limitation}</p>
          {disease && <SourceLinks sourceIds={disease.sourceIds} />}
        </div>
      </ExploreDisclosure>
    </section>
  )
}
