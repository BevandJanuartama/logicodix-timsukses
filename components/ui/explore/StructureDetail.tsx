'use client'

import { chooseDisease } from '@/components/ui/diseases/chooseDisease'
import { diseaseIdsForStructure } from '@/lib/data/diseaseLinks'
import { findDisease, findStructureByObjectId } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import type { AnatomyObjectId } from '@/lib/types'
import { ExploreDisclosure } from './ExploreDisclosure'
import { FactList } from './FactList'
import { plainNames } from './plainLabels'

export function StructureDetail({ objectId }: { objectId: AnatomyObjectId }) {
  const setMode = useAppStore((state) => state.setMode)
  const structure = findStructureByObjectId(objectId)
  if (!structure) return null
  const relatedDiseases = diseaseIdsForStructure(objectId)
    .map(findDisease)
    .filter((disease) => disease !== undefined)

  const openDisease = (diseaseId: string) => {
    setMode('diseases')
    chooseDisease(diseaseId)
  }

  return (
    <article className="space-y-4">
      <div>
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">{plainNames[objectId]}</h2>
        <p className="mt-1 text-body text-fg-secondary">{structure.description}</p>
      </div>

      <FactList
        facts={[
          { label: 'Jenis jaringan', value: structure.tissueType },
          { label: 'Letak', value: structure.location },
        ]}
      />

      <div>
        <ExploreDisclosure label="Catatan penting">
          <p className="text-caption text-fg-secondary">{structure.clinicalNote}</p>
        </ExploreDisclosure>

        {relatedDiseases.length > 0 && (
          <ExploreDisclosure label={`Masalah yang bisa terjadi (${relatedDiseases.length})`}>
            <ul className="space-y-0.5">
              {relatedDiseases.map((disease) => (
                <li key={disease.id}>
                  <button
                    type="button"
                    onClick={() => openDisease(disease.id)}
                    className="min-h-10 w-full cursor-pointer rounded-[var(--radius-control)] px-2 text-left text-caption font-semibold text-danger hover:text-fg"
                  >
                    {disease.displayName}
                  </button>
                </li>
              ))}
            </ul>
          </ExploreDisclosure>
        )}
      </div>

      <p className="text-caption text-fg-secondary">Sumber: {structure.sourceLabel}</p>
    </article>
  )
}
