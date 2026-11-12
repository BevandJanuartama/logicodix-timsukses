import { oralRegions } from '@/lib/data/oralRegions'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import type { OralRegionId } from '@/lib/types'
import { BulletList } from '@/components/ui/shell/PanelParts'
import { ExploreDisclosure } from './ExploreDisclosure'

export function OralRegionDetail({ regionId }: { regionId: OralRegionId }) {
  const region = oralRegions[regionId]
  return (
    <article>
      <h2 className="font-display text-title font-semibold tracking-tight text-fg">{sceneTargetLabels[regionId]}</h2>
      <p className="text-caption font-medium text-fg-muted italic">{region.clinicalName}</p>
      <p className="mt-3 text-body text-fg-secondary">{region.summary}</p>
      <ExploreDisclosure label="Fungsi">
        <BulletList items={region.functions} />
      </ExploreDisclosure>
      <ExploreDisclosure label="Cara merawat">
        <BulletList items={region.care} tone="mint" />
      </ExploreDisclosure>
    </article>
  )
}
