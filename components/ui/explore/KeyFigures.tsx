'use client'

import { useAppStore } from '@/lib/store'
import { toothTypes } from '@/lib/knowledgeBase'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

const permanentTotal = toothTypes.reduce((sum, type) => sum + type.permanentCount, 0)
const primaryTotal = toothTypes.reduce((sum, type) => sum + type.primaryCount, 0)

export function KeyFigures() {
  const openModal = useAppStore((state) => state.openModal)

  return (
    <section aria-labelledby="key-figures-title">
      <SectionTitle>
        <span id="key-figures-title">Angka kunci</span>
      </SectionTitle>
      <div className="flex items-stretch gap-4">
        <div className="flex-[1.4]">
          <p className="font-display tabular-nums text-6xl leading-none font-semibold text-fg">{permanentTotal}</p>
          <p className="mt-2 text-caption text-fg-secondary">gigi permanen dewasa</p>
        </div>
        <div className="flex-1 space-y-3 border-l border-line pl-4">
          <div>
            <p className="font-display tabular-nums text-title font-semibold text-fg">{primaryTotal}</p>
            <p className="mt-1 text-caption text-fg-secondary">gigi sulung</p>
          </div>
          <div>
            <p className="font-display tabular-nums text-title font-semibold text-fg">&lt;10%</p>
            <p className="mt-1 text-caption text-fg-secondary">energi harian dari gula bebas</p>
            <button
              type="button"
              onClick={() => openModal('references', 'SRC-002')}
              className="mt-1 cursor-pointer text-caption font-semibold text-accent hover:underline"
            >
              WHO · SRC-002
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-caption text-fg-muted">Statistik Kemenkes SKI 2023 menunggu verifikasi tabel resmi.</p>
    </section>
  )
}
