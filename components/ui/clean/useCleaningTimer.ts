'use client'

import { useEffect, useState } from 'react'
import { useCleaningStore } from '@/lib/cleaningStore'
import { RECOMMENDED_SECONDS } from './cleanTools'

const TICK_MS = 500

export function useCleaningTimer() {
  const startedAt = useCleaningStore((state) => state.startedAt)
  const finishedAt = useCleaningStore((state) => state.finishedAt)
  const [now, setNow] = useState(() => performance.now())

  const rawElapsed = startedAt === null ? 0 : Math.max(0, ((finishedAt ?? now) - startedAt) / 1000)
  const cappedElapsed = Math.min(RECOMMENDED_SECONDS, rawElapsed)

  useEffect(() => {
    if (startedAt === null || finishedAt !== null || cappedElapsed >= RECOMMENDED_SECONDS) return
    const timer = setInterval(() => setNow(performance.now()), TICK_MS)
    return () => clearInterval(timer)
  }, [startedAt, finishedAt, cappedElapsed])

  return cappedElapsed
}

export const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
