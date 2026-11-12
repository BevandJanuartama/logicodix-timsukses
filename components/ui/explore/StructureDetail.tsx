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
      <p className="flex items-center gap-2 text-caption font-semibold text-fg-muted">
        {structure.id} · {structure.tissueType}
        <StatusBadge contentId={structure.id} baseStatus={structure.status} />
      </p>
      <h2 className="font-display mt-1 text-title font-semibold tracking-tight text-fg">{sceneTargetLabels[objectId]}</h2>
      <p className="mt-2 text-body text-fg-secondary">{structure.description}</p>
      <p className="mt-2 text-caption text-fg-muted">Lokasi: {structure.location}</p>

      <ExploreDisclosure label="Catatan klinis">
        <p className="text-caption text-fg-secondary">{structure.clinicalNote}</p>
        <p className="mt-2 text-caption text-fg-muted">{structure.sourceLabel}</p>
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
