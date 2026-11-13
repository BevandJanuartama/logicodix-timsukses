'use client'

import { useState } from 'react'
import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { DentitionToggle, type Dentition } from './DentitionToggle'
import { ExploreChip } from './ExploreChip'
import { ExploreDisclosure } from './ExploreDisclosure'
import { KeyFigures } from './KeyFigures'
import { ToothTypeTable } from './ToothTypeTable'

export const QUICK_TARGETS: { label: string; focus: SceneFocus }[] = [
  { label: 'Geraham besar', focus: { toothId: '36' } },
  { label: 'Gigi seri', focus: { toothId: '11' } },
  { label: 'Gigi taring', focus: { toothId: '13' } },
  { label: 'Geraham kecil', focus: { toothId: '24' } },
  { label: 'Gusi', focus: { objectId: 'gingiva', preset: 'front' } },
  { label: 'Lidah', focus: { objectId: 'tongue_dorsum', preset: 'top' } },
]

export function ExploreIntro() {
  const [dentition, setDentition] = useState<Dentition>('permanent')
  const hasRail = useMediaQuery('(min-width: 1280px)')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">Pilih satu gigi</h2>
        <p className="mt-1 text-body text-fg-secondary">Ketuk titik oranye di model atau pilih dari daftar.</p>
      </div>

      {!hasRail && (
        <ul className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_TARGETS.map((target) => (
            <li key={target.label} className="shrink-0">
              <ExploreChip onClick={() => focusScene(target.focus)}>{target.label}</ExploreChip>
            </li>
          ))}
        </ul>
      )}

      <DentitionToggle value={dentition} onChange={setDentition} />
      <KeyFigures />

      <ExploreDisclosure label="Bandingkan jenis gigi">
        <ToothTypeTable dentition={dentition} />
      </ExploreDisclosure>
    </div>
  )
}
