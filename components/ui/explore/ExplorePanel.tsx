'use client'

import { X } from 'lucide-react'
import { isOralRegion } from '@/lib/data/oralRegions'
import { useAppStore } from '@/lib/store'
import { getLayouts } from '@/lib/three/layout'
import { ExploreIntro } from './ExploreIntro'
import { LayerToggles } from './LayerToggles'
import { OralRegionDetail } from './OralRegionDetail'
import { StructureDetail } from './StructureDetail'
import { ToothSummary } from './ToothSummary'

export function ExplorePanel() {
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  const selectTarget = useAppStore((state) => state.selectTarget)
  const tooth = selectedToothId ? getLayouts().byId.get(selectedToothId) : undefined
  const hasSelection = Boolean(tooth || selectedObjectId)

  return (
    <div className="pb-2">
      {hasSelection ? (
        <div key={`${selectedToothId}-${selectedObjectId}`} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => selectTarget(null, null)}
              aria-label="Tutup pilihan"
              title="Tutup pilihan"
              className="grid size-9 cursor-pointer place-items-center rounded-[var(--radius-control)] border border-line text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          {selectedObjectId &&
            (isOralRegion(selectedObjectId) ? (
              <OralRegionDetail regionId={selectedObjectId} />
            ) : (
              <StructureDetail objectId={selectedObjectId} />
            ))}
          {tooth && <ToothSummary tooth={tooth} />}
        </div>
      ) : (
        <ExploreIntro />
      )}
      <LayerToggles />
    </div>
  )
}
