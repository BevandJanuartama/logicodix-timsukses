'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { FloatingChat } from './FloatingChat'
import { useChat } from './useChat'

export function AssistantChat() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const chat = useChat()
  const trigger = useRef<HTMLButtonElement>(null)
  const raised = useAppStore((state) => state.mode === 'destroy')

  useEffect(() => setMounted(true), [])

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Tutup asisten gigi' : 'Buka asisten gigi'}
        className={`absolute right-3 bottom-3 z-20 grid size-12 cursor-pointer place-items-center rounded-full bg-accent-fill text-on-accent shadow-[var(--shadow-float)] transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[0.94] md:right-4 ${raised ? 'md:bottom-28' : 'md:bottom-4'}`}
      >
        <MessageCircle className="size-6" aria-hidden />
      </button>
      {mounted && createPortal(<AnimatePresence>{open && <FloatingChat chat={chat} onClose={close} />}</AnimatePresence>, document.body)}
    </>
  )
}
