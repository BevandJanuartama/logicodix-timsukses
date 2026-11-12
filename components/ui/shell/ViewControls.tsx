'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Camera, RotateCcw, Scissors, ZoomIn, ZoomOut } from 'lucide-react'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import { ViewPresetMenu } from './ViewPresetMenu'

const PRESET_DISTANCE = 8

interface ControlButtonProps {
  label: string
  onClick: () => void
  pressed?: boolean
  children: ReactNode
}

function ControlButton({ label, onClick, pressed, children }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className="grid size-11 place-items-center rounded-[var(--radius-control)] text-fg-secondary transition-[color,background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg active:scale-[0.97] aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
    >
      {children}
    </button>
  )
}

export function ViewControls() {
  const requestCamera = useAppStore((state) => state.requestCamera)
  const setCutaway = useAppStore((state) => state.setCutaway)
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const sectioned = useAppStore((state) => sectionedToothOf(state) !== null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const presetAnchor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!presetsOpen) return
    const closeOnOutside = (event: PointerEvent) => {
      if (!presetAnchor.current?.contains(event.target as Node)) setPresetsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPresetsOpen(false)
    }
    window.addEventListener('pointerdown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [presetsOpen])

  const toggleSection = () => {
    if (!selectedToothId) return
    setCutaway(!sectioned)
    requestCamera({ kind: 'tooth', toothId: selectedToothId, section: !sectioned })
  }

  return (
    <div className="fixed top-[68px] right-2.5 z-20 sm:top-[76px] sm:right-3 lg:top-auto lg:right-auto lg:bottom-5 lg:left-5">
      <div className="panel flex flex-col p-1 lg:flex-row">
        <ControlButton label="Perbesar" onClick={() => requestCamera({ kind: 'zoom', direction: 1 })}>
          <ZoomIn className="size-[18px]" aria-hidden />
        </ControlButton>
        <ControlButton label="Perkecil" onClick={() => requestCamera({ kind: 'zoom', direction: -1 })}>
          <ZoomOut className="size-[18px]" aria-hidden />
        </ControlButton>
        <ControlButton label="Reset kamera" onClick={() => requestCamera({ kind: 'reset' })}>
          <RotateCcw className="size-[18px]" aria-hidden />
        </ControlButton>
        <div ref={presetAnchor} className="relative">
          <ControlButton label="Sudut pandang" pressed={presetsOpen} onClick={() => setPresetsOpen(!presetsOpen)}>
            <Camera className="size-[18px]" aria-hidden />
          </ControlButton>
          <ViewPresetMenu
            open={presetsOpen}
            onChoose={(preset) => {
              requestCamera({ kind: 'preset', preset, distance: PRESET_DISTANCE })
              setPresetsOpen(false)
            }}
          />
        </div>
        {selectedToothId && !cleaning && (
          <ControlButton label="Belah penampang gigi" pressed={sectioned} onClick={toggleSection}>
            <Scissors className="size-[18px]" aria-hidden />
          </ControlButton>
        )}
      </div>
    </div>
  )
}
