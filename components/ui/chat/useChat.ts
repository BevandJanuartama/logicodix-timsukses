'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CHAT_LIMITS, type ChatMessage, type ChatReply } from '@/lib/chat/types'

const ERROR_TEXT: Record<string, string> = {
  not_configured: 'Asisten belum aktif. Kunci API belum diisi.',
  rate_limited: 'Terlalu banyak pertanyaan. Coba lagi beberapa menit lagi.',
}
const FALLBACK_ERROR = 'Asisten sedang tidak bisa menjawab. Coba lagi sebentar lagi.'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => () => controller.current?.abort(), [])

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim().slice(0, CHAT_LIMITS.maxMessageLength)
      if (!text || pending) return
      const history: ChatMessage[] = [...messages, { role: 'user', text }]
      setMessages(history)
      setPending(true)
      setError(null)
      controller.current = new AbortController()
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.map(({ role, text: content }) => ({ role, text: content })) }),
          signal: controller.current.signal,
        })
        const data = (await response.json().catch(() => ({}))) as Partial<ChatReply> & { error?: string }
        if (!response.ok || !data.reply) throw new Error(data.error ?? 'failed')
        setMessages([...history, { role: 'model', text: data.reply, conditionId: data.conditionId ?? undefined }])
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setError(ERROR_TEXT[(caught as Error).message] ?? FALLBACK_ERROR)
      } finally {
        setPending(false)
      }
    },
    [messages, pending],
  )

  return { messages, pending, error, send }
}
