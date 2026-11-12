import { oralRegions } from '@/lib/data/oralRegions'
import type { OralRegionId } from '@/lib/types'
import { BulletList } from '@/components/ui/shell/PanelParts'
import { ExploreDisclosure } from './ExploreDisclosure'
import { plainNames } from './plainLabels'

export function OralRegionDetail({ regionId }: { regionId: OralRegionId }) {
  const region = oralRegions[regionId]
  return (
    <article className="space-y-4">
      <div>
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">{plainNames[regionId]}</h2>
        <p className="mt-1 text-body text-fg-secondary">{region.summary}</p>
      </div>
      <div>
        <ExploreDisclosure label="Apa fungsinya">
          <BulletList items={region.functions} />
        </ExploreDisclosure>
        <ExploreDisclosure label="Cara merawat">
          <BulletList items={region.care} tone="mint" />
        </ExploreDisclosure>
      </div>
    </article>
  )
}
