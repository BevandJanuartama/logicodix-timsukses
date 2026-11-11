'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BookOpen, LibraryBig, ShieldCheck } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function LibraryMenu() {
  const openModal = useAppStore((state) => state.openModal)
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const choose = (modal: 'references' | 'governance') => {
    setOpen(false)
    openModal(modal)
  }

  return (
    <div ref={container} className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Sumber dan tata kelola"
        className="glass grid size-10 shrink-0 place-items-center sm:size-11 rounded-2xl text-ink/65 hover:text-brand"
      >
        <LibraryBig className="size-5" aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
            transition={{ duration: 0.15 }}
            className="glass absolute top-full right-0 mt-2 w-56 origin-top-right rounded-2xl p-1.5"
          >
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => choose('references')}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold hover:bg-brand-50"
              >
                <BookOpen className="size-4 text-brand" aria-hidden />
                Referensi ilmiah
              </button>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => choose('governance')}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold hover:bg-brand-50"
              >
                <ShieldCheck className="size-4 text-brand" aria-hidden />
                Tata kelola konten
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
