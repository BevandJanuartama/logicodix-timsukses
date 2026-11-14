'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CameraPreset } from '@/lib/types'

const VIEW_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
  { id: 'bottom', label: 'Bawah' },
  { id: 'left', label: 'Kiri' },
  { id: 'right', label: 'Kanan' },
  { id: 'lingual', label: 'Sisi lidah' },
]

const MENU_WIDTH = 128
const MENU_GAP = 8
const VIEWPORT_MARGIN = 8
const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface Placement {
  left: number
  top: number
  opensLeft: boolean
}

interface ViewPresetMenuProps {
  open: boolean
  anchor: RefObject<HTMLElement | null>
  onClose: () => void
  onChoose: (preset: CameraPreset) => void
}

export function ViewPresetMenu({ open, anchor, onClose, onChoose }: ViewPresetMenuProps) {
  const reduceMotion = useReducedMotion()
  const menu = useRef<HTMLUListElement>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [placement, setPlacement] = useState<Placement>({ left: 0, top: 0, opensLeft: false })
  const hiddenScale = reduceMotion ? 1 : 0.96

  useEffect(() => setHost(document.body), [])

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect()
      if (!rect) return
      const opensLeft = rect.left > window.innerWidth / 2
      const left = opensLeft ? rect.left - MENU_GAP - MENU_WIDTH : rect.right + MENU_GAP
      const maxTop = window.innerHeight - VIEWPORT_MARGIN - (menu.current?.offsetHeight ?? 0)
      setPlacement({ left, top: Math.max(VIEWPORT_MARGIN, Math.min(rect.top, maxTop)), opensLeft })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, anchor])

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (menu.current?.contains(target) || anchor.current?.contains(target)) return
      onClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onClose()
      anchor.current?.focus()
    }
    window.addEventListener('pointerdown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, anchor, onClose])

  if (!host) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.ul
          ref={menu}
          initial={{ opacity: 0, scale: hiddenScale }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: hiddenScale }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          style={{ left: placement.left, top: placement.top, width: MENU_WIDTH, originX: placement.opensLeft ? 1 : 0, originY: 0 }}
          className="panel fixed z-50 p-1"
        >
          {VIEW_PRESETS.map((preset, index) => (
            <li key={preset.id}>
              <button
                type="button"
                autoFocus={index === 0}
                onClick={() => onChoose(preset.id)}
                className="block min-h-11 w-full cursor-pointer rounded-[var(--radius-control)] px-3 text-left text-caption font-semibold text-fg-secondary transition-colors duration-[var(--duration-hover)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg"
              >
                {preset.label}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>,
    host,
  )
}
