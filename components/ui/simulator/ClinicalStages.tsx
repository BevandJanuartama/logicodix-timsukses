'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { findDisease, stagesForDisease } from '@/lib/knowledgeBase'
import { clinicalFocusTooth } from '@/lib/simulatorActions'
import { useSimulatorStore, type ClinicalTrackId } from '@/lib/simulatorStore'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { SectionTitle, SourceLinks } from '@/components/ui/shell/PanelParts'
import { CompareHold } from './CompareHold'
import { CLINICAL_TIMELINES, getPlainStage } from './plainStages'
import { SectionToggle } from './SectionToggle'
import { StageScrubber } from './StageScrubber'

const SECTION_LABELS: Record<ClinicalTrackId, string> = {
  'DIS-001': 'Belah gigi geraham',
  'DIS-003': 'Belah gigi seri',
}

export function ClinicalStages({ track }: { track: ClinicalTrackId }) {
  const stageIndex = useSimulatorStore((state) => state.stageIndex)
  const setStageIndex = useSimulatorStore((state) => state.setStageIndex)
  const reduceMotion = useReducedMotion()
  const stages = stagesForDisease(track)
  const stage = stages[stageIndex] ?? stages[0]
  const disease = findDisease(track)
  const plain = getPlainStage(stage.id)

  return (
    <section aria-label={`Tahapan ${disease?.displayName ?? ''}`} className="mt-3 space-y-3">
      <div className="md:hidden">
        <StageScrubber
          label="Tahap perkembangan"
          items={stages}
          activeIndex={stageIndex}
          indicatorId={`stage-indicator-${track}`}
          timeline={CLINICAL_TIMELINES[track]}
          onSelect={setStageIndex}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage.id}
          aria-live="polite"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <article className="rounded-[var(--radius-control)] bg-surface-sunken p-4">
            <p className="text-caption font-semibold text-fg-muted tabular-nums">
              Tahap {stageIndex + 1} dari {stages.length} · {plain?.shortLabel ?? stage.title}
            </p>
            <h3 className="mt-0.5 font-display text-subtitle font-semibold text-fg">{plain?.title ?? stage.title}</h3>
            <p className="mt-1.5 text-body text-fg-secondary">{plain?.whatHappens ?? stage.description}</p>
          </article>

          {plain?.howToStop && (
            <>
              <SectionTitle>Cara menghentikan</SectionTitle>
              <p className="text-body text-fg-secondary">{plain.howToStop}</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <CompareHold activeIndex={stageIndex} onSelect={setStageIndex} />
      <SectionToggle toothId={clinicalFocusTooth[track]} label={SECTION_LABELS[track]} />

      {disease && (
        <ExploreDisclosure label="Catatan & rujukan">
          <div className="space-y-2 text-caption text-fg-secondary">
            <p>{stage.limitation}</p>
            <SourceLinks sourceIds={disease.sourceIds} />
          </div>
        </ExploreDisclosure>
      )}
    </section>
  )
}
