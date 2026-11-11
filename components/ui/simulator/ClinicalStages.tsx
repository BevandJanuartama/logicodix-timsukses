'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Info } from 'lucide-react'
import { findDisease, stagesForDisease } from '@/lib/knowledgeBase'
import { clinicalFocusTooth } from '@/lib/simulatorActions'
import { useSimulatorStore, type ClinicalTrackId } from '@/lib/simulatorStore'
import { SectionTitle, SourceLinks } from '@/components/ui/shell/PanelParts'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { SectionToggle } from './SectionToggle'

const SECTION_HINTS: Record<ClinicalTrackId, string> = {
  'DIS-001': 'Belah geraham untuk melihat lesi menembus enamel, dentin, hingga mendekati pulpa.',
  'DIS-003': 'Belah gigi seri bawah untuk melihat tulang alveolar di sekitar akar.',
}

export function ClinicalStages({ track }: { track: ClinicalTrackId }) {
  const stageIndex = useSimulatorStore((state) => state.stageIndex)
  const setStageIndex = useSimulatorStore((state) => state.setStageIndex)
  const reduceMotion = useReducedMotion()
  const stages = stagesForDisease(track)
  const stage = stages[stageIndex] ?? stages[0]
  const disease = findDisease(track)

  return (
    <section aria-label={`Tahapan ${disease?.displayName ?? track}`}>
      <SectionTitle>Pilih tahap</SectionTitle>
      <ol className="flex gap-1.5" role="list">
        {stages.map((item, index) => (
          <li key={item.id} className="flex-1">
            <button
              type="button"
              aria-current={index === stageIndex ? 'step' : undefined}
              onClick={() => setStageIndex(index)}
              className="w-full rounded-xl bg-white/60 px-2 py-2 text-center ring-1 ring-ink/8 transition-colors hover:bg-white aria-[current=step]:bg-coral aria-[current=step]:text-white aria-[current=step]:ring-coral"
            >
              <span className="block text-[15px] font-extrabold tabular-nums">{item.stageNumber}</span>
              <span className="block truncate font-mono text-[10px] opacity-70">{item.id}</span>
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={stage.id}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-3 rounded-2xl bg-coral/8 p-3.5"
        >
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-coral uppercase">
            Tahap {stage.stageNumber} dari {stages.length - 1}
            <StatusBadge contentId={stage.id} baseStatus={stage.status} />
          </p>
          <h3 className="mt-0.5 text-[15px] font-extrabold">{stage.title}</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink/80">{stage.description}</p>
          <p className="mt-2 text-[12.5px] text-ink/65">
            <span className="font-bold">Visualisasi:</span> {stage.visualChange}
          </p>
        </motion.article>
      </AnimatePresence>

      <p className="mt-3 flex gap-2 rounded-2xl bg-amber/10 p-3 text-[12.5px] leading-snug text-ink/80">
        <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
        {stage.limitation}
      </p>

      <SectionToggle toothId={clinicalFocusTooth[track]} hint={SECTION_HINTS[track]} />

      {disease && (
        <>
          <SectionTitle>Sumber</SectionTitle>
          <SourceLinks sourceIds={disease.sourceIds} />
        </>
      )}
    </section>
  )
}
