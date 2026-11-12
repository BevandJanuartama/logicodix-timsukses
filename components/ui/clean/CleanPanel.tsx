'use client'

import { Droplets, RotateCcw } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { ExploreChip } from '@/components/ui/explore/ExploreChip'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { CLEAN_VIEWS, CLEAN_VIEW_DISTANCE } from './cleanTools'
import { PreventionPillars } from './PreventionPillars'
import { ScoreSummary } from './ScoreSummary'
import { ToolPicker } from './ToolPicker'

export function CleanPanel() {
  const reset = useCleaningStore((state) => state.reset)
  const useMouthwash = useCleaningStore((state) => state.useMouthwash)
  const rinsed = useCleaningStore((state) => state.mouthwashNonce > 0)
  const requestCamera = useAppStore((state) => state.requestCamera)

  return (
    <div className="pb-2">
      <h2 className="text-subtitle font-semibold tracking-tight text-fg">Bersihkan plak</h2>
      <p className="mt-1 text-caption text-fg-secondary">Gosok gumpalan kuning di gigi, sela, dan lidah.</p>

      <ScoreSummary />

      <SectionTitle>Alat</SectionTitle>
      <ToolPicker />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={useMouthwash}
          disabled={rinsed}
          className="flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-fill text-caption font-semibold text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] disabled:cursor-default disabled:opacity-45 disabled:active:scale-100"
        >
          <Droplets className="size-4" aria-hidden />
          {rinsed ? 'Sudah berkumur' : 'Obat kumur'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-4 text-caption font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
        >
          <RotateCcw className="size-4" aria-hidden />
          Ulangi
        </button>
      </div>

      <SectionTitle>Sudut pandang</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {CLEAN_VIEWS.map((view) => (
          <ExploreChip key={view.id} onClick={() => requestCamera({ kind: 'preset', preset: view.id, distance: CLEAN_VIEW_DISTANCE })}>
            {view.label}
          </ExploreChip>
        ))}
      </div>
      <p className="mt-3 text-caption text-fg-muted">Klik kiri atau satu jari menggosok. Klik kanan atau dua jari memutar.</p>

      <PreventionPillars />
    </div>
  )
}
