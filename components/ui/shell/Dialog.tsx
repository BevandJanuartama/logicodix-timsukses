'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
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
      className="glass m-auto max-h-[86dvh] w-[min(94vw,720px)] overflow-hidden rounded-3xl p-0 text-ink backdrop:bg-ink/35 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <header className="flex items-start gap-3 border-b border-ink/8 px-5 pt-5 pb-4">
        <div className="flex-1">
          <h2 id={titleId} className="text-lg font-extrabold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-[13px] leading-snug text-ink/60">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/60 hover:bg-ink/10"
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>
      <div className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-4">{open && children}</div>
    </dialog>
  )
}
