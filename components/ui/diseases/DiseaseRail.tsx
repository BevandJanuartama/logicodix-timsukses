'use client'

import { useAppStore } from '@/lib/store'
import { chooseDisease } from './chooseDisease'
import { DiseaseList } from './DiseaseList'

export function DiseaseRail() {
  const selectedDiseaseId = useAppStore((state) => state.selectedDiseaseId)

  return (
    <nav aria-label="Daftar kondisi gigi" className="panel flex min-h-0 w-full flex-col">
      <h2 className="shrink-0 px-5 pt-5 pb-3 font-display text-subtitle font-semibold text-fg">Kondisi gigi</h2>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
        <DiseaseList
          highlight
          activeId={selectedDiseaseId}
          onSelect={(id) => chooseDisease(id === selectedDiseaseId ? null : id)}
        />
      </div>
    </nav>
  )
}
