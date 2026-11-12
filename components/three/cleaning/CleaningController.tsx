'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CLEAN_TARGET, useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { cleaningState, computeCleanStats, generatePlaque, rinseWithMouthwash } from '@/lib/three/cleaning'
import { getLayouts } from '@/lib/three/layout'
import { CleaningSparkles } from './CleaningSparkles'

const STATS_INTERVAL = 0.15
const SCRUB_DECAY = 0.9

export function CleaningController() {
  const resetNonce = useCleaningStore((state) => state.resetNonce)
  const mouthwashNonce = useCleaningStore((state) => state.mouthwashNonce)
  const lastSync = useRef(0)

  useEffect(() => {
    generatePlaque(getLayouts())
  }, [resetNonce])

  useEffect(() => {
    if (mouthwashNonce > 0) rinseWithMouthwash()
  }, [mouthwashNonce])

  useFrame((state) => {
    if (useAppStore.getState().mode !== 'clean') return
    cleaningState.scrub *= SCRUB_DECAY
    const elapsed = state.clock.elapsedTime
    if (elapsed - lastSync.current < STATS_INTERVAL) return
    lastSync.current = elapsed
    const stats = computeCleanStats()
    const store = useCleaningStore.getState()
    if (store.stats.overall !== stats.overall || store.stats.tongue !== stats.tongue) store.setStats(stats)
    if (stats.overall >= CLEAN_TARGET) store.markFinished()
  })

  return <CleaningSparkles />
}
