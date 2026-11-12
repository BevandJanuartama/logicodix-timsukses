'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, title, description, onClose, children }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby={titleId}
      className="m-auto w-[min(94vw,720px)] border-0 bg-transparent p-0 text-fg backdrop:bg-surface-scrim backdrop:backdrop-blur-sm"
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="panel flex max-h-[86dvh] flex-col overflow-hidden"
        >
          <header className="flex items-start gap-3 border-b border-line px-5 pt-4 pb-3">
            <div className="flex-1">
              <h2 id={titleId} className="font-display text-subtitle font-bold tracking-tight">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-caption text-fg-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-control)] text-fg-secondary transition-[color,background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg active:scale-[var(--scale-press)]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>
          <div className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        </motion.div>
      )}
    </dialog>
  )
}
