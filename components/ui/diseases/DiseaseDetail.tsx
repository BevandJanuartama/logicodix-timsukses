'use client'

import { Eye, FlaskConical } from 'lucide-react'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { findReference } from '@/lib/knowledgeBase'
import { focusScene } from '@/lib/sceneFocus'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, type ClinicalTrackId } from '@/lib/simulatorStore'
import { useAppStore } from '@/lib/store'
import type { Disease } from '@/lib/types'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'

const FACTS: { key: 'symptoms' | 'riskFactors' | 'affectedStructures' | 'prevention'; label: string }[] = [
  { key: 'symptoms', label: 'Gejala' },
  { key: 'riskFactors', label: 'Faktor risiko' },
  { key: 'affectedStructures', label: 'Bagian terdampak' },
  { key: 'prevention', label: 'Pencegahan' },
]

const ACTION_CLASSES =
  'flex min-h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] px-3 text-[13px] font-semibold transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]'

const isClinicalDisease = (diseaseId: string): diseaseId is ClinicalTrackId =>
  (CLINICAL_TRACKS as string[]).includes(diseaseId)

export function DiseaseDetail({ disease }: { disease: Disease }) {
  const link = diseaseLinks[disease.id]
  const diseaseId = disease.id
  const openModal = useAppStore((state) => state.openModal)
  const sourceIds = disease.sourceIds.filter((sourceId) => findReference(sourceId))

  return (
    <div className="px-3 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        {link && (
          <button
            type="button"
            onClick={() => focusScene(link.focus)}
            className={`${ACTION_CLASSES} bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-bg-hover)]`}
          >
            <Eye className="size-4" aria-hidden />
            Lihat di 3D
          </button>
        )}
        {isClinicalDisease(diseaseId) && (
          <button
            type="button"
            onClick={() => openSimulatorTrack(diseaseId)}
            className={`${ACTION_CLASSES} border border-line text-fg-secondary hover:text-fg`}
          >
            <FlaskConical className="size-4" aria-hidden />
            Simulator
          </button>
        )}
      </div>

      {link && link.structures.length > 0 && (
        <p className="mt-2 text-[12px] text-fg-muted">
          {link.structures.slice(0, 3).map((structure) => sceneTargetLabels[structure]).join(' · ')}
        </p>
      )}

      <ExploreDisclosure label="Detail klinis">
        <dl className="space-y-2.5">
          {FACTS.map((fact) => (
            <div key={fact.key}>
              <dt className="telemetry text-[11px] font-semibold text-fg-muted uppercase">{fact.label}</dt>
              <dd className="mt-0.5 text-[13px] leading-snug text-fg-secondary">{disease[fact.key]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 border-l-2 border-danger pl-2.5 text-[12.5px] leading-snug text-fg-secondary">
          {disease.safetyNote}
        </p>
      </ExploreDisclosure>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        {sourceIds.map((sourceId) => (
          <button
            key={sourceId}
            type="button"
            onClick={() => openModal('references', sourceId)}
            className="telemetry min-h-10 cursor-pointer text-[11px] font-semibold text-accent hover:underline"
          >
            {sourceId}
          </button>
        ))}
      </div>
    </div>
  )
}
