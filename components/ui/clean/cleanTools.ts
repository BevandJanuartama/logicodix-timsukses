import type { CleaningTool } from '@/lib/cleaningStore'
import { BrushIcon, FlossIcon, ScraperIcon } from './ToolIcons'

export interface CleanToolSpec {
  id: CleaningTool
  name: string
  area: string
  icon: typeof BrushIcon
  hint: string
}

export const CLEAN_TOOLS: CleanToolSpec[] = [
  {
    id: 'brush',
    name: 'Sikat gigi',
    area: 'Permukaan & garis gusi',
    icon: BrushIcon,
    hint: 'Miringkan bulu sikat 45° ke garis gusi, gosok memutar pendek.',
  },
  {
    id: 'floss',
    name: 'Benang gigi',
    area: 'Sela antar gigi',
    icon: FlossIcon,
    hint: 'Selipkan di sela gigi, lengkungkan mengikuti sisi gigi.',
  },
  {
    id: 'scraper',
    name: 'Pembersih lidah',
    area: 'Permukaan atas lidah',
    icon: ScraperIcon,
    hint: 'Tarik lembut dari pangkal ke ujung lidah.',
  },
]

export const CLEAN_VIEW_DISTANCE = 14.5
export const RECOMMENDED_SECONDS = 120
