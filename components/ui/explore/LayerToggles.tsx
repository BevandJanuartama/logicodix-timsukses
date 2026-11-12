'use client'

import { Eye, EyeOff, RotateCcw } from 'lucide-react'
import { layerOrder, layerSwatches, sceneTargetLabels } from '@/lib/data/sceneLabels'
import { findStructureByObjectId } from '@/lib/knowledgeBase'
import { focusScene } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

export function LayerToggles() {
  const layers = useAppStore((state) => state.layers)
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  const toggleLayer = useAppStore((state) => state.toggleLayer)
  const resetLayers = useAppStore((state) => state.resetLayers)
  const hiddenCount = layerOrder.filter((layer) => !layers[layer]).length

  return (
    <section aria-labelledby="layer-matrix-title">
      <div className="flex items-end justify-between">
        <SectionTitle>
          <span id="layer-matrix-title">Lapisan anatomi</span>
        </SectionTitle>
        <button
          type="button"
          onClick={resetLayers}
          aria-label="Tampilkan semua lapisan"
          title="Tampilkan semua lapisan"
          style={{ opacity: hiddenCount > 0 ? 1 : 0 }}
          tabIndex={hiddenCount > 0 ? 0 : -1}
          className="mb-2 grid size-8 cursor-pointer place-items-center rounded-[var(--radius-control)] text-accent transition-opacity duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)]"
        >
          <RotateCcw className="size-4" aria-hidden />
        </button>
      </div>
      <ul className="divide-y divide-line rounded-[var(--radius-control)] border border-line">
        {layerOrder.map((layer) => {
          const visible = layers[layer]
          const structure = findStructureByObjectId(layer)
          return (
            <li key={layer} className="flex items-center" style={{ opacity: visible ? 1 : 0.5 }}>
              <button
                type="button"
                aria-pressed={selectedObjectId === layer}
                onClick={() => focusScene({ objectId: layer, preset: 'front' })}
                className="flex min-h-10 flex-1 cursor-pointer items-center gap-2.5 px-2.5 text-left text-[13px] font-semibold text-fg-secondary hover:text-fg aria-pressed:text-fg"
              >
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full ring-1 ring-line-strong"
                  style={{ background: layerSwatches[layer] }}
                />
                <span className="telemetry w-12 shrink-0 text-[11px] text-fg-muted">{structure?.id}</span>
                <span className="flex-1 truncate">{sceneTargetLabels[layer]}</span>
              </button>
              <button
                type="button"
                aria-pressed={visible}
                aria-label={`${visible ? 'Sembunyikan' : 'Tampilkan'} ${sceneTargetLabels[layer]}`}
                onClick={() => toggleLayer(layer)}
                className="grid size-10 shrink-0 cursor-pointer place-items-center text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
              >
                {visible ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
