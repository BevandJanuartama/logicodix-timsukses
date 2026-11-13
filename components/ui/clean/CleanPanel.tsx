'use client'

import { CheckCircle2, Droplets, RotateCcw } from 'lucide-react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { PreventionPillars } from './PreventionPillars'
import { ScoreSummary } from './ScoreSummary'
import { ToolPicker } from './ToolPicker'

export function CleanPanel() {
  const reset = useCleaningStore((state) => state.reset)
  const useMouthwash = useCleaningStore((state) => state.useMouthwash)
  const rinsed = useCleaningStore((state) => state.mouthwashNonce > 0)
  const finished = useCleaningStore((state) => state.finishedAt !== null)
  const hasRail = useMediaQuery('(min-width: 1280px)')

  return (
    <div className="space-y-4 pb-2">
      <div>
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">Latihan menyikat gigi</h2>
        <p className="mt-1 text-caption text-fg-secondary">
          Pilih alat lalu gosok plak kuning di permukaan gigi, sela gigi, dan lidah.
        </p>
      </div>

      <ScoreSummary />

      {!hasRail && (
        <div>
          <SectionTitle>Alat pembersih</SectionTitle>
          <ToolPicker />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={useMouthwash}
          disabled={rinsed}
          className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] text-caption font-semibold transition-transform ${finished ? 'bg-accent-fill text-on-accent' : 'bg-surface-sunken text-fg hover:bg-surface-sand'} duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] disabled:cursor-default disabled:opacity-45 disabled:active:scale-100`}
        >
          <Droplets className="size-4" aria-hidden />
          {rinsed ? 'Sudah berkumur' : 'Kumur'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] bg-surface-sunken px-4 text-caption font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
        >
          <RotateCcw className="size-4" aria-hidden />
          Ulangi
        </button>
      </div>

      {finished ? (
        <section aria-label="Ringkasan selesai" className="rounded-[var(--radius-control)] bg-surface-sunken p-4">
          <h3 className="font-display text-subtitle font-semibold text-fg">Ringkasan selesai</h3>
          <p className="mt-1 mb-2 flex items-center gap-2 text-caption font-semibold text-success">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            Seluruh area sudah bersih! Jaga hasilnya dengan 5 kebiasaan ini:
          </p>
          <PreventionPillars />
        </section>
      ) : (
        <ExploreDisclosure label="5 kebiasaan menjaga gigi setelah menyikat">
          <PreventionPillars />
        </ExploreDisclosure>
      )}
    </div>
  )
}
