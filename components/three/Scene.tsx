'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { PerformanceMonitor } from '@react-three/drei'
import { useAppStore } from '@/lib/store'
import { CameraRig } from './CameraRig'
import { CleaningController } from './cleaning/CleaningController'
import { ToolCursor } from './cleaning/ToolCursor'
import { SimulationClock } from './simulation/SimulationClock'
import { Mouth } from './Mouth'
import { Pedestal } from './Pedestal'
import { StudioLights } from './StudioLights'

const CANVAS_BACKGROUND = '#F6ECE1'

const deviceRatioCap = () => Math.min(window.devicePixelRatio || 1, 2)

export default function Scene() {
  const [maxDpr, setMaxDpr] = useState(1.5)

  useEffect(() => {
    const isCompact = window.matchMedia('(max-width: 768px)').matches
    setMaxDpr(Math.min(deviceRatioCap(), isCompact ? 1.6 : 2))
  }, [])

  return (
    <Canvas
      dpr={[1, maxDpr]}
      style={{ background: CANVAS_BACKGROUND }}
      camera={{ position: [0, 2.4, 11], fov: 38, near: 0.05, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true
      }}
      onPointerMissed={() => {
        const state = useAppStore.getState()
        if (state.mode !== 'clean') state.selectTarget(null, null)
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <PerformanceMonitor
        onDecline={() => setMaxDpr((dpr) => Math.max(1, dpr - 0.4))}
        onIncline={() => setMaxDpr((dpr) => Math.min(deviceRatioCap(), dpr + 0.25))}
      />
      <StudioLights />
      <Mouth />
      <Pedestal />
      <CleaningController />
      <ToolCursor />
      <SimulationClock />
      <CameraRig />
    </Canvas>
  )
}
