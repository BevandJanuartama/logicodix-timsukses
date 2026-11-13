'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BookOpen, LibraryBig, ShieldCheck } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const MENU_ITEMS = [
  { modal: 'references', label: 'Sumber', Icon: BookOpen },
  { modal: 'governance', label: 'Tentang konten ini', Icon: ShieldCheck },
] as const

export function LibraryMenu() {
  const openModal = useAppStore((state) => state.openModal)
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    window.addEventListener('pointerdown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const moveFocus = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = (items.indexOf(document.activeElement as HTMLElement) + step + items.length) % items.length
    items[next]?.focus()
  }

  const choose = (modal: (typeof MENU_ITEMS)[number]['modal']) => {
    setOpen(false)
    openModal(modal)
  }

  return (
    <div ref={container} className="pointer-events-auto relative">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] px-3 text-caption font-semibold text-fg-secondary transition-[color,background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg active:scale-[var(--scale-press)] aria-expanded:text-accent"
      >
        <LibraryBig className="size-4" aria-hidden />
        Sumber
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            onKeyDown={moveFocus}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="panel absolute top-full right-0 mt-2 w-56 origin-top-right p-1"
          >
            {MENU_ITEMS.map(({ modal, label, Icon }, index) => (
              <li key={modal} role="none">
                <button
                  type="button"
                  role="menuitem"
                  autoFocus={index === 0}
                  onClick={() => choose(modal)}
                  className="flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-left text-caption font-semibold text-fg-secondary transition-colors duration-[var(--duration-press)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg"
                >
                  <Icon className="size-4 text-accent" aria-hidden />
                  {label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
