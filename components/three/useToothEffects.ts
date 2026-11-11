'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import type * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { simulationClock, useSimulatorStore } from '@/lib/simulatorStore'
import type { ToothInfo } from '@/lib/three/layout'
import { buildCracks } from '@/lib/three/toothGeometry'
import { computeToothEffects, createToothEffects, type CrownMetrics } from '@/lib/three/toothEffects'
import type { ToothMaterials } from '@/lib/three/toothMaterial'

const CRACK_SEGMENT = 6

export function useToothEffects(info: ToothInfo, materials: ToothMaterials, crown: CrownMetrics) {
  const effects = useMemo(() => createToothEffects(), [])
  const crackMeshes = useRef<(THREE.Mesh | null)[]>([])
  const inSimulator = useAppStore((state) => state.mode === 'destroy')
  const iceTrack = useSimulatorStore((state) => state.track === 'ice')
  const showsIceCracks = inSimulator && iceTrack
  const cracks = useMemo(
    () => (showsIceCracks && info.index <= 4 ? buildCracks(info.params, info.fdi) : null),
    [showsIceCracks, info],
  )

  useEffect(() => () => cracks?.forEach((geometry) => geometry.dispose()), [cracks])

  const animate = useCallback(
    (elapsed: number) => {
      const track = useAppStore.getState().mode === 'destroy' ? useSimulatorStore.getState().track : null
      computeToothEffects(effects, track, simulationClock.progress, info, crown)
      const uniforms = materials.effects
      uniforms.uTime.value = elapsed
      uniforms.uFlatNormal.value.copy(effects.flatNormal)
      uniforms.uFlatDistance.value = effects.flatDistance
      uniforms.uFlatExposure.value = effects.flatExposure
      uniforms.uDecay.value = effects.decay
      uniforms.uDecayCenter.value.copy(effects.decayCenter)
      uniforms.uDecayRadius.value = effects.decayRadius
      uniforms.uDecayDepth.value = effects.decayDepth
      uniforms.uStain.value = effects.stain
      uniforms.uInflammation.value = effects.inflammation
      cracks?.forEach((geometry, index) => {
        const mesh = crackMeshes.current[index]
        if (!mesh) return
        const total = geometry.index?.count ?? 0
        const visibleCount = Math.floor((effects.crack * total) / CRACK_SEGMENT) * CRACK_SEGMENT
        geometry.setDrawRange(0, visibleCount)
        mesh.visible = visibleCount > 0
      })
    },
    [effects, info, crown, materials, cracks],
  )

  return { animate, cracks, crackMeshes }
}
