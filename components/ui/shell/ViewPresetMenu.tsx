'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CameraPreset } from '@/lib/types'

const VIEW_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'front', label: 'Depan' },
  { id: 'top', label: 'Atas' },
  { id: 'bottom', label: 'Bawah' },
  { id: 'left', label: 'Kiri' },
  { id: 'right', label: 'Kanan' },
]

interface ViewPresetMenuProps {
  open: boolean
  onChoose: (preset: CameraPreset) => void
}

export function ViewPresetMenu({ open, onChoose }: ViewPresetMenuProps) {
  const reduceMotion = useReducedMotion()
  const hiddenScale = reduceMotion ? 1 : 0.95

  return (
    <AnimatePresence>
      {open && (
        <motion.ul
          initial={{ opacity: 0, scale: hiddenScale }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: hiddenScale }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="panel absolute top-0 right-full mr-2 w-28 origin-top-right p-1 lg:top-auto lg:right-auto lg:bottom-full lg:left-0 lg:mr-0 lg:mb-2 lg:origin-bottom-left"
        >
          {VIEW_PRESETS.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                onClick={() => onChoose(preset.id)}
                className="block min-h-10 w-full rounded-[var(--radius-control)] px-3 text-left text-caption font-semibold text-fg-secondary transition-colors hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg"
              >
                {preset.label}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}
