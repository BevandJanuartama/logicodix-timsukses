'use client'

import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useAppStore } from '@/lib/store'
import { ComparisonControls } from './ComparisonControls'
import { DentitionToggle } from './DentitionToggle'
import { ExploreChip } from './ExploreChip'
import { ExploreDisclosure } from './ExploreDisclosure'
import { KeyFigures } from './KeyFigures'
import { SectionControls } from './SectionControls'
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
  const dentition = useAppStore((state) => state.dentition)
  const hasRail = useMediaQuery('(min-width: 1280px)')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">Pilih satu gigi</h2>
        <p className="mt-1 text-body text-fg-secondary">Ketuk titik hijau di model atau pilih dari daftar.</p>
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

      <DentitionToggle />
      <KeyFigures />

      <div className="rounded-[var(--radius-control)] bg-surface-sunken p-3">
        <SectionControls />
      </div>

      <ExploreDisclosure label="Bandingkan jenis gigi">
        <ComparisonControls />
        <div className="mt-3">
          <ToothTypeTable dentition={dentition} />
        </div>
      </ExploreDisclosure>
    </div>
  )
}
