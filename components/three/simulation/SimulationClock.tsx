'use client'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { isClinicalTrack, simulationClock, stageTarget, useSimulatorStore } from '@/lib/simulatorStore'

const HABIT_DURATION_SECONDS = 20
const STAGE_TRANSITION_RATE = 3
const UI_SYNC_THRESHOLD = 0.006

export function SimulationClock() {
  useFrame((_, delta) => {
    if (useAppStore.getState().mode !== 'destroy') return
    const simulator = useSimulatorStore.getState()
    const { track } = simulator
    if (!track) return
    if (isClinicalTrack(track)) {
      const target = stageTarget(track, simulator.stageIndex)
      simulationClock.progress = THREE.MathUtils.damp(simulationClock.progress, target, STAGE_TRANSITION_RATE, delta)
      return
    }
    if (!simulator.playing) return
    simulationClock.progress = Math.min(1, simulationClock.progress + (delta * simulator.speed) / HABIT_DURATION_SECONDS)
    const finished = simulationClock.progress >= 1
    if (finished || Math.abs(simulationClock.progress - simulator.progress) > UI_SYNC_THRESHOLD) {
      simulator.syncProgress(simulationClock.progress, finished)
    }
  })
  return null
}
