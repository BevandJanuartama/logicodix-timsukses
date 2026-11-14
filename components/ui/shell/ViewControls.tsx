'use client'

import { useRef, useState } from 'react'
import { Camera, RotateCcw, Scissors, ZoomIn, ZoomOut } from 'lucide-react'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import { LodButtons } from './LodIndicator'
import { ToolbarButton } from './ToolbarButton'
import { ViewPresetMenu } from './ViewPresetMenu'

const PRESET_DISTANCE = 8

export function ViewControls() {
  const requestCamera = useAppStore((state) => state.requestCamera)
  const setCutaway = useAppStore((state) => state.setCutaway)
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const sectioned = useAppStore((state) => sectionedToothOf(state) !== null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const presetTrigger = useRef<HTMLButtonElement>(null)

  const toggleSection = () => {
    if (!selectedToothId) return
    setCutaway(!sectioned)
    requestCamera({ kind: 'tooth', toothId: selectedToothId, section: !sectioned })
  }

  return (
    <div
      role="toolbar"
      aria-label="Kontrol tampilan"
      aria-orientation="vertical"
      className="panel absolute top-3 right-3 z-20 flex max-h-[calc(100%-1.5rem)] flex-col overflow-y-auto p-1 md:top-1/2 md:right-auto md:left-3 md:-translate-y-1/2"
    >
      <LodButtons />
      {/* Phones pinch to zoom, and get Ulang / Sudut / Belah from the thumb-reach MobileActionBar instead. */}
      <div className="hidden md:contents">
        <ToolbarButton label="Perbesar" onClick={() => requestCamera({ kind: 'zoom', direction: 1 })}>
          <ZoomIn className="size-[18px]" aria-hidden />
        </ToolbarButton>
        <ToolbarButton label="Perkecil" onClick={() => requestCamera({ kind: 'zoom', direction: -1 })}>
          <ZoomOut className="size-[18px]" aria-hidden />
        </ToolbarButton>
        <ToolbarButton label="Ulang" hint="Kembali ke tampilan awal" onClick={() => requestCamera({ kind: 'reset' })}>
          <RotateCcw className="size-[18px]" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          ref={presetTrigger}
          label="Sudut"
          hint="Lihat gigi dari arah lain"
          expanded={presetsOpen}
          onClick={() => setPresetsOpen(!presetsOpen)}
        >
          <Camera className="size-[18px]" aria-hidden />
        </ToolbarButton>
        <ViewPresetMenu
          open={presetsOpen}
          anchor={presetTrigger}
          onClose={() => setPresetsOpen(false)}
          onChoose={(preset) => {
            requestCamera({ kind: 'preset', preset, distance: PRESET_DISTANCE })
            setPresetsOpen(false)
            presetTrigger.current?.focus()
          }}
        />
        {selectedToothId && !cleaning && (
          <ToolbarButton label="Belah" hint="Lihat isi gigi ini" pressed={sectioned} onClick={toggleSection}>
            <Scissors className="size-[18px]" aria-hidden />
          </ToolbarButton>
        )}
      </div>
    </div>
  )
}
