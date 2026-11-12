'use client'

import { useMemo } from 'react'
import { LayoutGroup } from 'framer-motion'
import { CleanRail } from '@/components/ui/clean/CleanRail'
import { DiseaseRail } from '@/components/ui/diseases/DiseaseRail'
import { QUICK_TARGETS } from '@/components/ui/explore/ExploreIntro'
import { SimulatorRail } from '@/components/ui/simulator/SimulatorRail'
import { toothById, toothLabel } from '@/lib/data/dentition'
import { focusScene } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'
import { LibraryRail, RailThumbnail, type RailItem } from './LibraryRail'

const targetId = ({ toothId, objectId }: { toothId?: string; objectId?: string }) => toothId ?? objectId ?? ''

const anatomyItems: RailItem[] = QUICK_TARGETS.map(({ label, focus }) => {
  const tooth = focus.toothId ? toothById.get(focus.toothId) : undefined
  return { id: targetId(focus), title: label, subtitle: tooth ? toothLabel(tooth) : 'Jaringan lunak' }
})

function AnatomyRail() {
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  const selectedId = selectedToothId ?? selectedObjectId
  const thumbnails = useAppStore((state) => state.thumbnails)
  const items = useMemo(
    () => anatomyItems.map((item) => ({ ...item, thumbnail: thumbnails[item.id] ? <RailThumbnail src={thumbnails[item.id]} /> : undefined })),
    [thumbnails],
  )

  const onSelect = (id: string) => {
    const target = QUICK_TARGETS.find(({ focus }) => targetId(focus) === id)
    if (target) focusScene(target.focus)
  }

  return (
    <LibraryRail
      title="Pustaka anatomi"
      items={items}
      activeId={items.some((item) => item.id === selectedId) ? selectedId : null}
      onSelect={onSelect}
    />
  )
}

export function ModeRail() {
  const mode = useAppStore((state) => state.mode)
  if (mode === 'quiz') return null

  return (
    <LayoutGroup id={`rail-${mode}`}>
      {mode === 'explore' && <AnatomyRail />}
      {mode === 'diseases' && <DiseaseRail />}
      {mode === 'destroy' && <SimulatorRail />}
      {mode === 'clean' && <CleanRail />}
    </LayoutGroup>
  )
}
