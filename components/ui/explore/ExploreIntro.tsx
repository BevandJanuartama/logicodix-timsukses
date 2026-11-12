'use client'

import { Maximize, Microscope, ZoomIn, type LucideIcon } from 'lucide-react'
import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'
import type { Lod } from '@/lib/types'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { ExploreChip } from './ExploreChip'
import { KeyFigures } from './KeyFigures'
import { ToothTypeTable } from './ToothTypeTable'

const QUICK_TARGETS: { label: string; focus: SceneFocus }[] = [
  { label: 'Geraham 36', focus: { toothId: '36' } },
  { label: 'Gigi seri 11', focus: { toothId: '11' } },
  { label: 'Taring 13', focus: { toothId: '13' } },
  { label: 'Premolar 24', focus: { toothId: '24' } },
  { label: 'Gusi', focus: { objectId: 'gingiva', preset: 'front' } },
  { label: 'Lidah', focus: { objectId: 'tongue_dorsum', preset: 'top' } },
]

const DETAIL_STEPS: { id: Lod; label: string; hint: string; Icon: LucideIcon }[] = [
  { id: 'macro', label: 'Makro', hint: 'Lengkung rahang, lidah, gusi, dan 32 gigi', Icon: Maximize },
  { id: 'meso', label: 'Meso', hint: 'Klik satu gigi untuk mendekat', Icon: ZoomIn },
  { id: 'micro', label: 'Mikro', hint: 'Zoom dalam untuk melihat dentin dan pulpa', Icon: Microscope },
]

export function ExploreIntro() {
  const lod = useAppStore((state) => state.lod)

  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight text-fg">Klik bagian mana pun</h2>
      <p className="mt-1 text-[13.5px] leading-snug text-fg-secondary">Pilih gigi, gusi, atau lidah di 3D, atau mulai dari pintasan.</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {QUICK_TARGETS.map((target) => (
          <li key={target.label}>
            <ExploreChip onClick={() => focusScene(target.focus)}>{target.label}</ExploreChip>
          </li>
        ))}
      </ul>

      <SectionTitle>Zoom</SectionTitle>
      <ol className="flex gap-1.5">
        {DETAIL_STEPS.map(({ id, label, hint, Icon }) => (
          <li
            key={id}
            title={hint}
            aria-current={lod === id ? 'step' : undefined}
            className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-control)] border border-line text-[13px] font-semibold text-fg-muted aria-[current=step]:border-line-strong aria-[current=step]:bg-[var(--chip-bg)] aria-[current=step]:text-fg"
          >
            <Icon className="size-4" aria-hidden />
            {label}
            <span className="sr-only">: {hint}</span>
          </li>
        ))}
      </ol>

      <SectionTitle>Jenis gigi</SectionTitle>
      <ToothTypeTable />

      <KeyFigures />
    </>
  )
}
