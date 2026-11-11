'use client'

import { Eye, EyeOff, RotateCcw } from 'lucide-react'
import { layerOrder, layerSwatches, sceneTargetLabels } from '@/lib/data/sceneLabels'
import { useAppStore } from '@/lib/store'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

export function LayerToggles() {
  const layers = useAppStore((state) => state.layers)
  const toggleLayer = useAppStore((state) => state.toggleLayer)
  const resetLayers = useAppStore((state) => state.resetLayers)
  const allVisible = layerOrder.every((layer) => layers[layer])

  return (
    <section aria-labelledby="layer-toggles-title">
      <div className="flex items-end justify-between">
        <SectionTitle>
          <span id="layer-toggles-title">Tampilkan / sembunyikan lapisan</span>
        </SectionTitle>
        <button
          type="button"
          onClick={resetLayers}
          disabled={allVisible}
          className="mb-1.5 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-brand hover:bg-brand-50 disabled:opacity-0"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Semua
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        {layerOrder.map((layer) => {
          const visible = layers[layer]
          return (
            <li key={layer}>
              <button
                type="button"
                aria-pressed={visible}
                onClick={() => toggleLayer(layer)}
                className="flex w-full items-center gap-2 rounded-xl bg-white/60 px-2.5 py-2 text-left text-[12.5px] font-semibold ring-1 ring-ink/5 transition-colors hover:bg-white aria-[pressed=false]:bg-transparent aria-[pressed=false]:text-ink/40"
              >
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full ring-1 ring-ink/15"
                  style={{ background: layerSwatches[layer], opacity: visible ? 1 : 0.35 }}
                />
                <span className="flex-1 truncate">{sceneTargetLabels[layer]}</span>
                {visible ? (
                  <Eye className="size-3.5 shrink-0 text-ink/45" aria-hidden />
                ) : (
                  <EyeOff className="size-3.5 shrink-0 text-ink/30" aria-hidden />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
