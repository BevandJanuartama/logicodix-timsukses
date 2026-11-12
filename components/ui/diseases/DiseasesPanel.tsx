'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { diseaseIdsForStructure } from '@/lib/data/diseaseLinks'
import { isOralRegion } from '@/lib/data/oralRegions'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { diseases } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { ExploreChip } from '@/components/ui/explore/ExploreChip'
import { DiseaseCard } from './DiseaseCard'

const ALL_CATEGORIES = 'Semua'
const categories = [ALL_CATEGORIES, ...new Set(diseases.map((disease) => disease.category))]

function useStructureFilter() {
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  return selectedObjectId && !isOralRegion(selectedObjectId) ? selectedObjectId : null
}

export function DiseasesPanel() {
  const selectedDiseaseId = useAppStore((state) => state.selectedDiseaseId)
  const selectDisease = useAppStore((state) => state.selectDisease)
  const selectObject = useAppStore((state) => state.selectObject)
  const structureFilter = useStructureFilter()
  const [category, setCategory] = useState(ALL_CATEGORIES)

  const visibleDiseases = useMemo(() => {
    const linkedIds = structureFilter ? new Set(diseaseIdsForStructure(structureFilter)) : null
    return diseases.filter(
      (disease) =>
        (category === ALL_CATEGORIES || disease.category === category) && (!linkedIds || linkedIds.has(disease.id)),
    )
  }, [category, structureFilter])

  return (
    <div className="pb-2">
      <h2 className="text-xl font-semibold tracking-tight text-fg">Penyakit gigi & mulut</h2>
      <p className="mt-1 text-[13px] text-fg-secondary">Ketuk untuk detail. Lihat lokasinya di model 3D.</p>

      {structureFilter && (
        <p className="mt-3 flex items-center justify-between gap-2 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] py-1 pr-1 pl-3 text-[13px] font-semibold text-fg">
          Terkait {sceneTargetLabels[structureFilter]}
          <button
            type="button"
            onClick={() => selectObject(null)}
            aria-label="Hapus filter struktur"
            className="grid size-9 cursor-pointer place-items-center rounded-[var(--radius-control)] text-fg-secondary hover:text-fg"
          >
            <X className="size-4" aria-hidden />
          </button>
        </p>
      )}

      <div role="group" aria-label="Filter kategori" className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {categories.map((option) => (
          <span key={option} className="shrink-0 whitespace-nowrap">
            <ExploreChip pressed={option === category} onClick={() => setCategory(option)}>
              {option}
            </ExploreChip>
          </span>
        ))}
      </div>

      <ul className="mt-3 rounded-[var(--radius-control)] border border-line bg-surface">
        {visibleDiseases.map((disease) => (
          <DiseaseCard
            key={disease.id}
            disease={disease}
            expanded={disease.id === selectedDiseaseId}
            onToggle={() => selectDisease(disease.id === selectedDiseaseId ? null : disease.id)}
          />
        ))}
      </ul>
      {visibleDiseases.length === 0 && (
        <p className="mt-4 text-center text-[13px] text-fg-muted">Tidak ada penyakit pada filter ini.</p>
      )}
      <p className="mt-4 text-[12px] leading-snug text-fg-muted">Edukatif, status draf; bukan pengganti pemeriksaan tenaga kesehatan.</p>
    </div>
  )
}
