'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Baby, Camera, RotateCcw, Scissors } from 'lucide-react'
import { activeComparison, jawSectionOn, sectionedToothOf, useAppStore } from '@/lib/store'
import { useUiStore } from '@/lib/uiStore'
import type { CameraPreset } from '@/lib/types'

/** Everyday words: "Samping" instead of left/right, "Sisi lidah" instead of lingual. */
const ANGLES: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
  { id: 'bottom', label: 'Bawah' },
  { id: 'right', label: 'Samping' },
  { id: 'lingual', label: 'Sisi lidah' },
]

const ANGLE_DISTANCE = 8
const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface BarButtonProps {
  label: string
  hint: string
  pressed?: boolean
  expanded?: boolean
  onClick: () => void
  children: ReactNode
}

function BarButton({ label, hint, pressed, expanded, onClick, children }: BarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-expanded={expanded}
      title={hint}
      className="flex min-h-12 min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-2.5 text-[12px] leading-4 font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] aria-pressed:bg-accent-fill aria-pressed:text-on-accent aria-expanded:bg-surface-sunken aria-expanded:text-fg"
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

/**
 * Thumb-reach quick controls for phones. Rides just above the bottom sheet's top edge (--sheet-visible-h, published
 * by BottomSheet) and steps aside when the sheet is fully open.
 */
export function MobileActionBar() {
  const mode = useAppStore((state) => state.mode)
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const toothSectioned = useAppStore((state) => sectionedToothOf(state) !== null)
  const jawCut = useAppStore(jawSectionOn)
  const jawSectionActive = useAppStore((state) => state.jawSection.active)
  const dentition = useAppStore((state) => state.dentition)
  const comparing = useAppStore((state) => activeComparison(state) !== 'off')
  const sheetFull = useUiStore((state) => state.sheetPosition === 'full')
  const tutorialOpen = useUiStore((state) => state.tutorialOpen)
  const reduceMotion = useReducedMotion()
  const [anglesOpen, setAnglesOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!anglesOpen) return
    const close = (event: PointerEvent) => {
      if (!bar.current?.contains(event.target as Node)) setAnglesOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [anglesOpen])

  const explore = mode === 'explore'
  const cleaning = mode === 'clean'
  const toothCut = Boolean(selectedToothId) && !cleaning
  const showCut = explore || toothCut
  const hidden = sheetFull || tutorialOpen

  const store = () => useAppStore.getState()

  const toggleCut = () => {
    const state = store()
    // A chosen tooth opens on its own; otherwise the whole jaw is cut front-to-back.
    if (state.selectedToothId && !cleaning) {
      state.setCutaway(!toothSectioned)
      state.requestCamera({ kind: 'tooth', toothId: state.selectedToothId, section: !toothSectioned })
      return
    }
    if (jawSectionActive) {
      state.closeJawSection()
      state.requestCamera({ kind: 'reset' })
    } else {
      state.setJawSection({ active: true })
      state.requestCamera({ kind: 'preset', preset: state.jawSection.axis === 'sagittal' ? 'right' : 'front' })
    }
  }

  const reset = () => {
    const state = store()
    state.selectTarget(null, null)
    if (state.jawSection.active) state.closeJawSection()
    state.requestCamera({ kind: 'reset' })
    setAnglesOpen(false)
  }

  return (
    <div
      ref={bar}
      className={`fixed left-1/2 z-20 -translate-x-1/2 transition-opacity duration-200 ease-[var(--ease-out)] md:hidden ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      style={{ bottom: 'calc(var(--mobile-tabbar-h) + var(--sheet-visible-h, var(--sheet-peek-h)) + 10px)' }}
      aria-hidden={hidden}
    >
      <AnimatePresence>
        {anglesOpen && (
          <motion.div
            role="menu"
            aria-label="Pilih sudut pandang"
            initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className="panel shadow-float absolute bottom-full left-1/2 mb-2 grid w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 grid-cols-3 gap-1 p-1.5"
          >
            <p className="col-span-3 px-1.5 pt-0.5 pb-1 text-caption text-fg-secondary">Lihat gigi dari arah:</p>
            {ANGLES.map((angle) => (
              <button
                key={angle.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  store().requestCamera({ kind: 'preset', preset: angle.id, distance: ANGLE_DISTANCE })
                  setAnglesOpen(false)
                }}
                className="min-h-11 cursor-pointer rounded-[var(--radius-control)] bg-surface-sunken text-caption font-semibold text-fg active:scale-[var(--scale-press)]"
              >
                {angle.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div role="toolbar" aria-label="Kontrol cepat" className="panel shadow-float flex items-center gap-0.5 rounded-full p-1">
        <BarButton label="Sudut" hint="Lihat gigi dari arah lain" expanded={anglesOpen} onClick={() => setAnglesOpen(!anglesOpen)}>
          <Camera className="size-[18px]" aria-hidden />
        </BarButton>
        {showCut && (
          <BarButton
            label="Belah"
            hint={toothCut ? 'Lihat isi gigi ini' : 'Belah rahang untuk melihat isi gigi'}
            pressed={toothCut ? toothSectioned : jawCut || jawSectionActive}
            onClick={toggleCut}
          >
            <Scissors className="size-[18px]" aria-hidden />
          </BarButton>
        )}
        {explore && !comparing && (
          <BarButton
            label="Gigi susu"
            hint={dentition === 'primary' ? 'Kembali ke gigi dewasa' : 'Tampilkan gigi anak-anak'}
            pressed={dentition === 'primary'}
            onClick={() => store().setDentition(dentition === 'primary' ? 'permanent' : 'primary')}
          >
            <Baby className="size-[18px]" aria-hidden />
          </BarButton>
        )}
        <BarButton label="Ulang" hint="Kembali ke tampilan awal" onClick={reset}>
          <RotateCcw className="size-[18px]" aria-hidden />
        </BarButton>
      </div>
    </div>
  )
}
