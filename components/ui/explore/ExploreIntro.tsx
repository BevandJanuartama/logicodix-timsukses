'use client'

import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'
import type { Lod } from '@/lib/types'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { ToothTypeTable } from './ToothTypeTable'

const QUICK_TARGETS: { label: string; focus: SceneFocus }[] = [
  { label: 'Geraham 36', focus: { toothId: '36' } },
  { label: 'Gigi seri 11', focus: { toothId: '11' } },
  { label: 'Taring 13', focus: { toothId: '13' } },
  { label: 'Premolar 24', focus: { toothId: '24' } },
  { label: 'Gusi', focus: { objectId: 'gingiva', preset: 'front' } },
  { label: 'Sela gigi', focus: { objectId: 'interdental_papilla', preset: 'front' } },
  { label: 'Lidah', focus: { objectId: 'tongue_dorsum', preset: 'top' } },
  { label: 'Langit-langit', focus: { objectId: 'palate', preset: 'bottom' } },
]

const DETAIL_STEPS: { id: Lod; title: string; description: string }[] = [
  { id: 'macro', title: 'Makro', description: 'Lengkung rahang atas dan bawah, lidah, gusi, dan 32 gigi.' },
  { id: 'meso', title: 'Meso', description: 'Klik satu gigi; kamera mendekat dan mahkota tampil lebih halus.' },
  { id: 'micro', title: 'Mikro', description: 'Zoom lebih dalam; gigi terbelah memperlihatkan dentin hingga pulpa.' },
]

export function ExploreIntro() {
  const lod = useAppStore((state) => state.lod)
  return (
    <>
      <h2 className="text-xl font-extrabold tracking-tight">Klik bagian mana pun</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
        Gigi, gusi, lidah, hingga sela gigi dapat dipilih untuk melihat nama, lokasi, dan catatan klinisnya.
      </p>

      <SectionTitle>Coba langsung</SectionTitle>
      <ul className="flex flex-wrap gap-1.5">
        {QUICK_TARGETS.map((target) => (
          <li key={target.label}>
            <button
              type="button"
              onClick={() => focusScene(target.focus)}
              className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-ink/75 ring-1 ring-ink/10 transition-colors hover:text-brand hover:ring-brand/50"
            >
              {target.label}
            </button>
          </li>
        ))}
      </ul>

      <SectionTitle>Semakin dekat, semakin detail</SectionTitle>
      <ol className="space-y-1.5">
        {DETAIL_STEPS.map((step, index) => (
          <li
            key={step.id}
            aria-current={lod === step.id ? 'step' : undefined}
            className="flex gap-3 rounded-2xl p-2.5 ring-1 ring-ink/8 transition-colors aria-[current=step]:bg-brand-50 aria-[current=step]:ring-brand/30"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink/5 text-xs font-extrabold text-ink/55 tabular-nums">
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-bold">{step.title}</span>
              <span className="block text-[13px] leading-snug text-ink/65">{step.description}</span>
            </span>
          </li>
        ))}
      </ol>

      <SectionTitle>Jenis gigi</SectionTitle>
      <ToothTypeTable />
    </>
  )
}
