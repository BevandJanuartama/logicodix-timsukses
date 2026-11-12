'use client'

import { diseaseIdsForStructure } from '@/lib/data/diseaseLinks'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { findDisease, findStructureByObjectId } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import type { AnatomyObjectId } from '@/lib/types'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { ExploreChip } from './ExploreChip'
import { ExploreDisclosure } from './ExploreDisclosure'

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
      <p className="telemetry flex items-center gap-2 text-[11px] font-semibold text-fg-muted">
        {structure.id} · {structure.tissueType}
        <StatusBadge contentId={structure.id} baseStatus={structure.status} />
      </p>
      <h2 className="mt-1 text-[22px] leading-tight font-semibold tracking-tight text-fg">{sceneTargetLabels[objectId]}</h2>
      <p className="mt-2 text-[14px] leading-snug text-fg-secondary">{structure.description}</p>
      <p className="telemetry mt-2 text-[12px] text-fg-muted">Lokasi: {structure.location}</p>

      <ExploreDisclosure label="Catatan klinis">
        <p className="text-[13px] leading-snug text-fg-secondary">{structure.clinicalNote}</p>
        <p className="telemetry mt-2 text-[11px] text-fg-muted">{structure.sourceLabel}</p>
      </ExploreDisclosure>

      {relatedDiseases.length > 0 && (
        <ExploreDisclosure label={`Penyakit terkait (${relatedDiseases.length})`}>
          <ul className="flex flex-wrap gap-1.5">
            {relatedDiseases.map((disease) => (
              <li key={disease.id}>
                <ExploreChip tone="danger" onClick={() => openDisease(disease.id)}>
                  {disease.displayName}
                </ExploreChip>
              </li>
            ))}
          </ul>
        </ExploreDisclosure>
      )}
    </article>
  )
}
