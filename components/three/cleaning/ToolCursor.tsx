'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { cleaningState } from '@/lib/three/cleaning'
import { BrushModel, FlosserModel, ScraperModel } from './ToolModels'

const WORLD_UP = new THREE.Vector3(0, 1, 0)
const xAxis = new THREE.Vector3()
const yAxis = new THREE.Vector3()
const zAxis = new THREE.Vector3()
const basis = new THREE.Matrix4()

function orientTool(isFloss: boolean) {
  zAxis.copy(cleaningState.toolNormal)
  if (isFloss) {
    yAxis.set(0, 1, 0).addScaledVector(zAxis, -zAxis.y)
    if (yAxis.lengthSq() < 0.05) yAxis.set(0, 0, 1).addScaledVector(zAxis, -zAxis.z)
    yAxis.normalize()
    xAxis.crossVectors(yAxis, zAxis).normalize()
  } else {
    xAxis.set(0, 0, 1).addScaledVector(zAxis, -zAxis.z)
    if (xAxis.lengthSq() < 0.25) xAxis.crossVectors(WORLD_UP, zAxis)
    if (xAxis.lengthSq() < 0.01) xAxis.set(1, 0, 0)
    xAxis.normalize()
    yAxis.crossVectors(zAxis, xAxis).normalize()
  }
  return basis.makeBasis(xAxis, yAxis, zAxis)
}

export function ToolCursor() {
  const tool = useCleaningStore((state) => state.tool)
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const group = useRef<THREE.Group>(null!)
  const jiggle = useRef<THREE.Group>(null!)
  const canvas = useThree((state) => state.gl.domElement)

  useEffect(() => {
    canvas.style.cursor = cleaning ? 'crosshair' : ''
  }, [cleaning, canvas])

  useFrame((state) => {
    const visible = cleaning && cleaningState.toolVisible
    group.current.visible = visible
    if (!visible) return
    group.current.position.lerp(cleaningState.toolPoint, 0.6)
    group.current.quaternion.setFromRotationMatrix(orientTool(tool === 'floss'))
    const elapsed = state.clock.elapsedTime
    const scrub = cleaningState.pressed ? cleaningState.scrub : 0
    jiggle.current.position.set(Math.sin(elapsed * 38) * 0.035 * scrub, Math.cos(elapsed * 31) * 0.02 * scrub, 0)
  })

  return (
    <group ref={group} visible={false}>
      <group ref={jiggle}>
        {tool === 'brush' && <BrushModel />}
        {tool === 'floss' && <FlosserModel />}
        {tool === 'scraper' && <ScraperModel />}
      </group>
    </group>
  )
}
