'use client'

import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { diseases } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { DiseaseDetail } from './DiseaseDetail'
import { chooseDisease } from './chooseDisease'
import { DiseaseList } from './DiseaseList'

export function DiseasesPanel() {
  const selectedDiseaseId = useAppStore((state) => state.selectedDiseaseId)
  const hasRail = useMediaQuery('(min-width: 1280px)')
  const selected = diseases.find((disease) => disease.id === selectedDiseaseId)

  return (
    <div className="pb-2">
      {selected ? (
        <DiseaseDetail disease={selected} showBackToList={!hasRail} />
      ) : (
        <>
          <h2 className="font-display text-title font-semibold tracking-tight text-fg">Masalah gigi yang sering terjadi</h2>
          <p className="mt-2 text-body text-fg-secondary">
            Pilih salah satu untuk melihat tanda, cara mencegah, dan letaknya di model.
          </p>
          <p className="mt-2 text-caption text-fg-muted">
            {hasRail ? 'Pilih dari daftar di kiri.' : 'Pilih dari daftar di bawah.'} Titik di model juga bisa diketuk.
          </p>
          {!hasRail && (
            <div className="mt-4">
              <DiseaseList activeId={null} onSelect={chooseDisease} />
            </div>
          )}
        </>
      )}
      <p className="mt-6 text-caption text-fg-muted">Edukatif, status draf; bukan pengganti pemeriksaan tenaga kesehatan.</p>
    </div>
  )
}
