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
              className="flex items-center gap-1 rounded-xl bg-ink/5 px-2.5 py-1.5 text-xs font-bold text-ink/60 hover:bg-ink/10"
            >
              <X className="size-3.5" aria-hidden />
              Tutup pilihan
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
