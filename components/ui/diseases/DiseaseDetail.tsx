'use client'

import { ArrowLeft, Eye, FlaskConical } from 'lucide-react'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { hasConditionPose } from '@/lib/data/conditionPoses'
import { focusScene } from '@/lib/sceneFocus'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, type ClinicalTrackId } from '@/lib/simulatorStore'
import { useAppStore } from '@/lib/store'
import type { Disease, PlainCopy } from '@/lib/types'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { DiseaseExtra } from './DiseaseExtra'
import { PoseCompareHold } from './PoseCompareHold'
import { SEVERITY_NOTE } from './diseaseSeverity'
import { SeverityBadge } from './SeverityBadge'

const plainCopyOf = (disease: Disease): PlainCopy =>
  disease.plain ?? { summary: disease.definition, signs: [disease.symptoms], prevention: [disease.prevention] }

function PlainList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-body text-fg-secondary marker:text-fg-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

interface DiseaseDetailProps {
  disease: Disease
  showBackToList: boolean
}

const BUTTON_CLASSES =
  'flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-body font-semibold transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]'

const isClinicalDisease = (diseaseId: string): diseaseId is ClinicalTrackId =>
  (CLINICAL_TRACKS as string[]).includes(diseaseId)

export function DiseaseDetail({ disease, showBackToList }: DiseaseDetailProps) {
  const selectDisease = useAppStore((state) => state.selectDisease)
  const link = diseaseLinks[disease.id]
  const copy = plainCopyOf(disease)
  const diseaseId = disease.id

  return (
    <div>
      {showBackToList && (
        <button
          type="button"
          onClick={() => selectDisease(null)}
          className="-ml-2 mb-2 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-fg-secondary hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Semua kondisi gigi
        </button>
      )}
      <h2 className="font-display text-title font-semibold tracking-tight text-fg">{disease.displayName}</h2>
      <div className="mt-2">
        <SeverityBadge diseaseId={diseaseId} />
      </div>
      {showBackToList && <p className="mt-1 text-caption text-fg-muted">{SEVERITY_NOTE}</p>}

      <SectionTitle>Apa itu</SectionTitle>
      <p className="text-body text-fg-secondary">{copy.summary}</p>

      <SectionTitle>Tanda-tandanya</SectionTitle>
      <PlainList items={copy.signs} />

      <SectionTitle>Cara mencegah</SectionTitle>
      <PlainList items={copy.prevention} />

      <div className="mt-6 space-y-2">
        {isClinicalDisease(diseaseId) && (
          <button
            type="button"
            onClick={() => openSimulatorTrack(diseaseId)}
            className={`${BUTTON_CLASSES} bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-bg-hover)]`}
          >
            <FlaskConical className="size-5" aria-hidden />
            Lihat jika dibiarkan
          </button>
        )}
        {link && (
          <button
            type="button"
            onClick={() => focusScene(link.focus)}
            className={`${BUTTON_CLASSES} bg-surface-sunken text-fg hover:bg-surface-sand`}
          >
            <Eye className="size-5" aria-hidden />
            Lihat di 3D
          </button>
        )}
        {hasConditionPose(diseaseId) && <PoseCompareHold />}
      </div>

      <DiseaseExtra disease={disease} />
    </div>
  )
}
