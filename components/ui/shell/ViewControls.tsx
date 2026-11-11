'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, RotateCcw, Scissors, ZoomIn, ZoomOut } from 'lucide-react'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import type { CameraPreset } from '@/lib/types'

const PRESET_DISTANCE = 8

const VIEW_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas · rahang bawah' },
  { id: 'bottom', label: 'Bawah · rahang atas' },
  { id: 'left', label: 'Samping kiri' },
  { id: 'right', label: 'Samping kanan' },
]

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
      className="grid size-11 place-items-center rounded-xl text-ink/65 transition-[color,background-color,transform] hover:bg-white hover:text-brand active:scale-95 aria-pressed:bg-brand aria-pressed:text-white"
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
  const reduceMotion = useReducedMotion()

  const toggleSection = () => {
    if (!selectedToothId) return
    setCutaway(!sectioned)
    requestCamera({ kind: 'tooth', toothId: selectedToothId, section: !sectioned })
  }

  return (
    <div className="fixed top-[68px] right-2.5 z-20 sm:top-[76px] sm:right-3 lg:top-auto lg:right-auto lg:bottom-5 lg:left-5">
      <div className="glass flex flex-col rounded-2xl p-1 lg:flex-row">
        <ControlButton label="Perbesar" onClick={() => requestCamera({ kind: 'zoom', direction: 1 })}>
          <ZoomIn className="size-[18px]" aria-hidden />
        </ControlButton>
        <ControlButton label="Perkecil" onClick={() => requestCamera({ kind: 'zoom', direction: -1 })}>
          <ZoomOut className="size-[18px]" aria-hidden />
        </ControlButton>
        <ControlButton label="Reset kamera" onClick={() => requestCamera({ kind: 'reset' })}>
          <RotateCcw className="size-[18px]" aria-hidden />
        </ControlButton>
        <div className="relative">
          <ControlButton label="Sudut pandang" pressed={presetsOpen} onClick={() => setPresetsOpen(!presetsOpen)}>
            <Camera className="size-[18px]" aria-hidden />
          </ControlButton>
          <AnimatePresence>
            {presetsOpen && (
              <motion.ul
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
                transition={{ duration: 0.16 }}
                className="glass absolute top-0 right-full mr-2 w-48 origin-top-right rounded-2xl p-1.5 lg:top-auto lg:right-auto lg:bottom-full lg:left-0 lg:mr-0 lg:mb-2 lg:origin-bottom-left"
              >
                {VIEW_PRESETS.map((preset) => (
                  <li key={preset.id}>
                    <button
                      type="button"
                      onClick={() => {
                        requestCamera({ kind: 'preset', preset: preset.id, distance: PRESET_DISTANCE })
                        setPresetsOpen(false)
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-ink/75 hover:bg-brand-50 hover:text-brand"
                    >
                      {preset.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
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
