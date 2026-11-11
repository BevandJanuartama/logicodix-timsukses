'use client'

import { Info } from 'lucide-react'
import { diseaseIdsForStructure } from '@/lib/data/diseaseLinks'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { findDisease, findStructureByObjectId } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import type { AnatomyObjectId } from '@/lib/types'
import { BulletList, SectionTitle } from '@/components/ui/shell/PanelParts'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'

export function StructureDetail({ objectId }: { objectId: AnatomyObjectId }) {
  const setMode = useAppStore((state) => state.setMode)
  const selectDisease = useAppStore((state) => state.selectDisease)
  const structure = findStructureByObjectId(objectId)
  if (!structure) return null
  const relatedDiseases = diseaseIdsForStructure(objectId)
    .map(findDisease)
    .filter((disease) => disease !== undefined)

  const openDisease = (diseaseId: string) => {
    selectDisease(diseaseId)
    setMode('diseases')
  }

  return (
    <article>
      <p className="flex items-center gap-2 text-[12px] font-semibold text-brand-600">
        {structure.id} · {structure.tissueType}
        <StatusBadge contentId={structure.id} baseStatus={structure.status} />
      </p>
      <h2 className="mt-1 text-[22px] leading-tight font-extrabold tracking-tight">{sceneTargetLabels[objectId]}</h2>
      {structure.name !== sceneTargetLabels[objectId] && (
        <p className="text-[13px] font-medium text-ink/55 italic">{structure.name}</p>
      )}

      <p className="mt-3 text-[14px] leading-relaxed text-ink/80">{structure.description}</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
        <dt className="font-bold text-ink/55">Lokasi</dt>
        <dd>{structure.location}</dd>
        <dt className="font-bold text-ink/55">Sumber</dt>
        <dd>{structure.sourceLabel}</dd>
      </dl>

      <p className="mt-4 flex gap-2 rounded-2xl bg-amber/10 p-3 text-[13px] leading-snug text-ink/85">
        <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
        {structure.clinicalNote}
      </p>

      <SectionTitle>Kondisi yang berkaitan</SectionTitle>
      <BulletList items={structure.relatedConditions} tone="coral" />

      {relatedDiseases.length > 0 && (
        <>
          <SectionTitle>Buka di katalog penyakit</SectionTitle>
          <ul className="flex flex-wrap gap-1.5">
            {relatedDiseases.map((disease) => (
              <li key={disease.id}>
                <button
                  type="button"
                  onClick={() => openDisease(disease.id)}
                  className="rounded-full bg-coral/10 px-3 py-1.5 text-[12.5px] font-bold text-coral transition-colors hover:bg-coral hover:text-white"
                >
                  {disease.displayName}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}
