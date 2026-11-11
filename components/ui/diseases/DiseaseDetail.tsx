'use client'

import { Eye, FlaskConical, ShieldAlert } from 'lucide-react'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { focusScene } from '@/lib/sceneFocus'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, type ClinicalTrackId } from '@/lib/simulatorStore'
import type { Disease } from '@/lib/types'
import { SectionTitle, SourceLinks } from '@/components/ui/shell/PanelParts'

const FACTS: { key: keyof Pick<Disease, 'symptoms' | 'riskFactors' | 'affectedStructures' | 'prevention'>; label: string }[] = [
  { key: 'symptoms', label: 'Gejala umum' },
  { key: 'riskFactors', label: 'Faktor risiko' },
  { key: 'affectedStructures', label: 'Bagian terdampak' },
  { key: 'prevention', label: 'Pencegahan' },
]

const isClinicalDisease = (diseaseId: string): diseaseId is ClinicalTrackId =>
  (CLINICAL_TRACKS as string[]).includes(diseaseId)

export function DiseaseDetail({ disease }: { disease: Disease }) {
  const link = diseaseLinks[disease.id]
  const diseaseId = disease.id
  return (
    <div className="space-y-3 px-3 pt-1 pb-4">
      <p className="text-[13.5px] leading-relaxed text-ink/80">{disease.definition}</p>
      <dl className="space-y-2.5">
        {FACTS.map((fact) => (
          <div key={fact.key}>
            <dt className="text-[11px] font-bold tracking-[0.1em] text-ink/50 uppercase">{fact.label}</dt>
            <dd className="mt-0.5 text-[13px] leading-snug text-ink/80">{disease[fact.key]}</dd>
          </div>
        ))}
      </dl>

      {link && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => focusScene(link.focus)}
            className="flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-600"
          >
            <Eye className="size-3.5" aria-hidden />
            Lihat di 3D
          </button>
          {isClinicalDisease(diseaseId) && (
            <button
              type="button"
              onClick={() => openSimulatorTrack(diseaseId)}
              className="flex items-center gap-1.5 rounded-xl bg-coral px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-coral/90"
            >
              <FlaskConical className="size-3.5" aria-hidden />
              Buka simulator
            </button>
          )}
          {link.structures.slice(0, 3).map((structure) => (
            <span key={structure} className="text-[12px] font-semibold text-ink/55">
              {sceneTargetLabels[structure]}
            </span>
          ))}
        </div>
      )}

      <p className="flex gap-2 rounded-2xl bg-coral/8 p-3 text-[12.5px] leading-snug text-ink/80">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-coral" aria-hidden />
        {disease.safetyNote}
      </p>

      <SectionTitle>Sumber</SectionTitle>
      <SourceLinks sourceIds={disease.sourceIds} />
    </div>
  )
}
