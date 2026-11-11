'use client'

import { Droplets, RotateCcw } from 'lucide-react'
import { useCleaningStore, type CleaningTool } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import type { CameraPreset } from '@/lib/types'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { PreventionPillars } from './PreventionPillars'
import { ScoreSummary } from './ScoreSummary'
import { BrushIcon, FlossIcon, ScraperIcon } from './ToolIcons'

const TOOLS: { id: CleaningTool; name: string; icon: typeof BrushIcon; tip: string }[] = [
  {
    id: 'brush',
    name: 'Sikat gigi',
    icon: BrushIcon,
    tip: 'Arahkan bulu sikat ±45° ke garis gusi, lalu gosok dengan gerakan kecil. Jangan lupa sisi dalam dan permukaan kunyah geraham.',
  },
  {
    id: 'floss',
    name: 'Benang gigi',
    icon: FlossIcon,
    tip: 'Sikat tidak menjangkau sela gigi. Selipkan benang perlahan, lengkungkan seperti huruf C memeluk gigi, lalu gerakkan naik-turun.',
  },
  {
    id: 'scraper',
    name: 'Pembersih lidah',
    icon: ScraperIcon,
    tip: 'Lapisan putih di lidah sering menjadi sumber bau mulut. Tarik pembersih dari belakang ke depan dengan tekanan lembut.',
  },
]

const VIEWS: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
  { id: 'bottom', label: 'Bawah' },
  { id: 'left', label: 'Kiri' },
  { id: 'right', label: 'Kanan' },
]

const VIEW_DISTANCE = 7

export function CleanPanel() {
  const tool = useCleaningStore((state) => state.tool)
  const setTool = useCleaningStore((state) => state.setTool)
  const reset = useCleaningStore((state) => state.reset)
  const useMouthwash = useCleaningStore((state) => state.useMouthwash)
  const rinsed = useCleaningStore((state) => state.mouthwashNonce > 0)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const activeTool = TOOLS.find((item) => item.id === tool) ?? TOOLS[0]

  return (
    <div className="pb-2">
      <h2 className="text-xl font-extrabold tracking-tight">Bersihkan plak & sisa makanan</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
        Pilih alat, lalu gosok gumpalan kuning di gigi, sela gigi, dan lidah. Skor dihitung saat kamu menggosok.
      </p>

      <ScoreSummary />

      <SectionTitle>Alat</SectionTitle>
      <div role="radiogroup" aria-label="Alat pembersih" className="flex gap-1 rounded-2xl bg-ink/5 p-1">
        {TOOLS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === tool}
              onClick={() => setTool(item.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12.5px] font-bold text-ink/60 transition-colors aria-checked:bg-white aria-checked:text-mint aria-checked:shadow"
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2.5 text-[13px] leading-snug text-ink/75">{activeTool.tip}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={useMouthwash}
          disabled={rinsed}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-3 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:bg-ink/10 disabled:text-ink/40"
        >
          <Droplets className="size-4" aria-hidden />
          {rinsed ? 'Sudah berkumur' : 'Obat kumur'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex items-center justify-center gap-2 rounded-2xl bg-ink/5 px-3 py-3 text-sm font-bold text-ink/75 hover:bg-ink/10"
        >
          <RotateCcw className="size-4" aria-hidden />
          Ulangi
        </button>
      </div>
      <p className="mt-2 text-[12px] leading-snug text-ink/55">
        Obat kumur hanya membantu sedikit; tidak menggantikan sikat gigi dan pembersih sela gigi.
      </p>

      <SectionTitle>Sudut pandang</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => requestCamera({ kind: 'preset', preset: view.id, distance: VIEW_DISTANCE })}
            className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-ink/75 ring-1 ring-ink/10 hover:text-mint hover:ring-mint/50"
          >
            {view.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-ink/60">
        Desktop: klik kiri + gosok untuk membersihkan, klik kanan + seret untuk memutar. Layar sentuh: satu jari menggosok,
        dua jari memutar dan zoom.
      </p>

      <PreventionPillars />
    </div>
  )
}
