import type { ConditionGroup } from '@/lib/types'

export const CONDITION_GROUPS: { id: ConditionGroup; title: string }[] = [
  { id: 'penyakit', title: 'Penyakit gigi & gusi' },
  { id: 'gigitan', title: 'Posisi & gigitan' },
  { id: 'tumbuh', title: 'Pertumbuhan gigi' },
  { id: 'struktur', title: 'Struktur email & dentin' },
  { id: 'kebiasaan', title: 'Kebiasaan & benturan' },
]
