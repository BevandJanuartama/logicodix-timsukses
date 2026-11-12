'use client'

import { useCleaningStore, type CleaningTool } from '@/lib/cleaningStore'
import { LibraryRail, type RailItem } from '@/components/ui/shell/LibraryRail'
import { CLEAN_TOOLS } from './cleanTools'

const toolRailItems: RailItem[] = CLEAN_TOOLS.map((item) => {
  const Icon = item.icon
  return {
    id: item.id,
    title: item.name,
    subtitle: item.area,
    thumbnail: (
      <span className="grid size-full place-items-center text-accent">
        <Icon className="size-8" />
      </span>
    ),
  }
})

export function CleanRail() {
  const tool = useCleaningStore((state) => state.tool)
  const setTool = useCleaningStore((state) => state.setTool)

  return (
    <LibraryRail
      title="Alat pembersih"
      items={toolRailItems}
      activeId={tool}
      onSelect={(id) => setTool(id as CleaningTool)}
    />
  )
}

