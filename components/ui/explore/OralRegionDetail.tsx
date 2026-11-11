import { oralRegions } from '@/lib/data/oralRegions'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import type { OralRegionId } from '@/lib/types'
import { BulletList, SectionTitle } from '@/components/ui/shell/PanelParts'

export function OralRegionDetail({ regionId }: { regionId: OralRegionId }) {
  const region = oralRegions[regionId]
  return (
    <article>
      <p className="text-[12px] font-semibold text-brand-600">Rongga mulut</p>
      <h2 className="mt-1 text-[22px] leading-tight font-extrabold tracking-tight">{sceneTargetLabels[regionId]}</h2>
      <p className="text-[13px] font-medium text-ink/55 italic">{region.clinicalName}</p>
      <p className="mt-3 text-[14px] leading-relaxed text-ink/80">{region.summary}</p>
      <SectionTitle>Fungsi</SectionTitle>
      <BulletList items={region.functions} />
      <SectionTitle>Cara merawat</SectionTitle>
      <BulletList items={region.care} tone="mint" />
    </article>
  )
}
