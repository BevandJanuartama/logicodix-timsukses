'use client'

import { useEffect, useState } from 'react'
import { useCleaningStore } from '@/lib/cleaningStore'

const TICK_MS = 500

export function useCleaningTimer() {
  const startedAt = useCleaningStore((state) => state.startedAt)
  const finishedAt = useCleaningStore((state) => state.finishedAt)
  const [now, setNow] = useState(() => performance.now())

  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return
    const timer = setInterval(() => setNow(performance.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [startedAt, finishedAt])

  if (startedAt === null) return 0
  return Math.max(0, ((finishedAt ?? now) - startedAt) / 1000)
}

export const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
