'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SendHorizontal, X } from 'lucide-react'
import { CHAT_LIMITS } from '@/lib/chat/types'
import { ChatMessageItem } from './ChatMessageItem'
import type { useChat } from './useChat'

interface FloatingChatProps {
  chat: ReturnType<typeof useChat>
  onClose: () => void
}

export function FloatingChat({ chat, onClose }: FloatingChatProps) {
  const { messages, pending, error, send } = chat
  const reduceMotion = useReducedMotion()
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLTextAreaElement>(null)
  const log = useRef<HTMLOListElement>(null)

  useEffect(() => input.current?.focus(), [])

  useEffect(() => {
    log.current?.lastElementChild?.scrollIntoView({ block: 'end' })
  }, [messages, pending])

  const submit = () => {
    if (!draft.trim() || pending) return
    void send(draft)
    setDraft('')
  }

  return (
    <motion.section
      role="dialog"
      aria-label="Asisten gigi"
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.stopPropagation()
        onClose()
      }}
      initial={hidden}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={hidden}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="panel fixed inset-x-3 top-20 bottom-[calc(var(--mobile-tabbar-h,0px)+12px)] z-40 flex origin-bottom-right flex-col shadow-[var(--shadow-float)] md:inset-x-auto md:top-auto md:right-4 md:bottom-4 md:h-[min(600px,calc(100vh-7rem))] md:w-[400px]"
    >
      <header className="flex shrink-0 items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <h2 className="font-display text-subtitle font-semibold text-fg">Tanya soal gigi</h2>
          <p className="text-caption text-fg-muted">Untuk belajar, bukan pengganti dokter gigi.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup asisten"
          className="-mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg-secondary transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-black/5 active:scale-[0.94]"
        >
          <X className="size-5" aria-hidden />
        </button>
      </header>

      <ol ref={log} aria-live="polite" className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 pb-3">
        {messages.length === 0 && (
          <li className="text-body text-fg-secondary">
            Tanyakan apa saja tentang gigi dan mulut, misalnya &ldquo;Apa itu gigitan terbalik?&rdquo;
          </li>
        )}
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}
        {pending && <li className="animate-pulse text-caption text-fg-muted">Asisten sedang menulis…</li>}
        {error && (
          <li role="alert" className="text-caption text-danger">
            {error}
          </li>
        )}
      </ol>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className="flex shrink-0 items-end gap-2 border-t border-black/5 p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Pertanyaan
        </label>
        <textarea
          id="chat-input"
          ref={input}
          value={draft}
          rows={1}
          maxLength={CHAT_LIMITS.maxMessageLength}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="Tulis pertanyaan…"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-[var(--radius-control)] bg-surface-sunken px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          aria-label="Kirim pertanyaan"
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-accent-fill text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[0.94] disabled:cursor-default disabled:opacity-40"
        >
          <SendHorizontal className="size-5" aria-hidden />
        </button>
      </form>
    </motion.section>
  )
}
