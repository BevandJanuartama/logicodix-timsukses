'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { PerformanceMonitor } from '@react-three/drei'
import { useAppStore } from '@/lib/store'
import { CameraRig } from './CameraRig'
import { Hotspots } from './Hotspots'
import { CleaningController } from './cleaning/CleaningController'
import { ToolCursor } from './cleaning/ToolCursor'
import { SimulationClock } from './simulation/SimulationClock'
import { Mouth } from './Mouth'
import { Pedestal } from './Pedestal'
import { StudioLights } from './StudioLights'
import { StructureThumbnails } from './useStructureThumbnails'

const CANVAS_BACKGROUND = '#F6ECE1'
const COMPACT_DPR_CAP = 1.25
const DESKTOP_DPR_CAP = 2

const isCompactDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches)

const computeMaxDpr = () => {
  const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return Math.min(ratio, isCompactDevice() ? COMPACT_DPR_CAP : DESKTOP_DPR_CAP)
}

export default function Scene() {
  const [maxDpr, setMaxDpr] = useState(COMPACT_DPR_CAP)
  const [minDpr, setMinDpr] = useState(1)
  const hotspotLayer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const compact = isCompactDevice()
    setMinDpr(compact ? 0.85 : 1)
    setMaxDpr(computeMaxDpr())
  }, [])

  return (
    <>
      <Canvas
        dpr={[minDpr, maxDpr]}
        style={{ background: CANVAS_BACKGROUND }}
        camera={{ position: [0, 3.6, 17.3], fov: 38, near: 0.05, far: 120 }}
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
          onDecline={() => setMaxDpr((dpr) => Math.max(minDpr, dpr - 0.3))}
          onIncline={() => setMaxDpr((dpr) => Math.min(computeMaxDpr(), dpr + 0.2))}
        />
        <StudioLights />
        <Mouth />
        <Pedestal />
        <CleaningController />
        <ToolCursor />
        <SimulationClock />
        <CameraRig />
        <StructureThumbnails />
        <Hotspots overlay={hotspotLayer} />
      </Canvas>
      <div ref={hotspotLayer} className="pointer-events-none absolute inset-0" />
    </>
  )
}
