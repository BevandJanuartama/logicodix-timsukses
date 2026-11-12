import type { CleaningTool } from '@/lib/cleaningStore'
import type { CameraPreset } from '@/lib/types'
import { BrushIcon, FlossIcon, ScraperIcon } from './ToolIcons'

export const CLEAN_TOOLS: { id: CleaningTool; name: string; icon: typeof BrushIcon; hint: string }[] = [
  { id: 'brush', name: 'Sikat', icon: BrushIcon, hint: 'Miringkan 45° ke garis gusi.' },
  { id: 'floss', name: 'Benang', icon: FlossIcon, hint: 'Lengkungkan seperti huruf C.' },
  { id: 'scraper', name: 'Lidah', icon: ScraperIcon, hint: 'Tarik dari belakang ke depan.' },
]

export const CLEAN_VIEWS: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
  { id: 'bottom', label: 'Bawah' },
  { id: 'left', label: 'Kiri' },
  { id: 'right', label: 'Kanan' },
]

export const CLEAN_VIEW_DISTANCE = 7
export const RECOMMENDED_SECONDS = 120
