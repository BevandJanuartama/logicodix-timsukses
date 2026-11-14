'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { activeComparison, renderedDentition, useAppStore } from '@/lib/store'
import { STACK_ASPECT, sceneJawBounds } from '@/lib/three/comparison'
import { sceneRegistry } from '@/lib/three/registry'

const PEDESTAL_COLOR = '#CFDEDC'
const SHADOW_COLOR = '#7A4E3A'
const PEDESTAL_THICKNESS = 0.3
const GAP_BELOW_JAW = 0.12
const RADIUS_MARGIN = 1.35
// Side-by-side comparison: stretch the disc into an ellipse that just covers both jaws.
const SPAN_MARGIN = 1.12
const FALLBACK_BASE_Y = -3.6
const FALLBACK_RADIUS = 4.6
const SHADOW_SPAN = 2.6
const SHADOW_OFFSET = 0.012

const jawBounds = new THREE.Box3()
const jawSize = new THREE.Vector3()
const spanSize = new THREE.Vector3()
const spanCenter = new THREE.Vector3()

export function Pedestal() {
  const pedestal = useRef<THREE.Group>(null!)
  const shadows = useRef<THREE.Group>(null!)
  const topYRef = useRef(FALLBACK_BASE_Y)
  const dentition = useAppStore(renderedDentition)
  const comparison = useAppStore(activeComparison)
  const stacked = useThree((state) => state.size.width / Math.max(1, state.size.height) < STACK_ASPECT)
  // ContactShadows bakes once (frames=1): remount it with a new key whenever the jaws on the disc change.
  const [shadow, setShadow] = useState({ key: 0, scale: [FALLBACK_RADIUS * SHADOW_SPAN, FALLBACK_RADIUS * SHADOW_SPAN] as [number, number] })
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, PEDESTAL_THICKNESS, 72), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: PEDESTAL_COLOR, roughness: 0.92, metalness: 0 }), [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useLayoutEffect(() => {
    let topY = FALLBACK_BASE_Y
    let radius = FALLBACK_RADIUS
    let radiusX = FALLBACK_RADIUS
    let centerX = 0
    const lowerJaw = sceneRegistry.jaws.lower
    if (lowerJaw) {
      lowerJaw.updateWorldMatrix(true, true)
      jawBounds.setFromObject(lowerJaw)
      if (!jawBounds.isEmpty()) {
        jawBounds.getSize(jawSize)
        radius = (Math.max(jawSize.x, jawSize.z) / 2) * RADIUS_MARGIN
        radiusX = radius
        // Every lower jaw on screen (main + comparison): lowest base sets the height, the span sets the width.
        const span = sceneJawBounds('lower')
        span.getSize(spanSize)
        span.getCenter(spanCenter)
        topY = span.min.y - GAP_BELOW_JAW
        if (sceneRegistry.compareJaws.lower) {
          centerX = spanCenter.x
          radiusX = Math.max(radius, (spanSize.x / 2) * SPAN_MARGIN)
        }
      }
    }
    topYRef.current = topY
    pedestal.current.position.set(centerX, topY - PEDESTAL_THICKNESS / 2, 0)
    pedestal.current.scale.set(radiusX, 1, radius)
    shadows.current.position.set(centerX, topY + SHADOW_OFFSET, 0)
    setShadow((previous) => ({
      key: previous.key + 1,
      scale: [Math.max(FALLBACK_RADIUS, radiusX) * SHADOW_SPAN, Math.max(FALLBACK_RADIUS, radius) * SHADOW_SPAN],
    }))
  }, [dentition, comparison, stacked])

  // Bottom views put the camera under the pedestal; hide it there so its cap never blocks the jaw.
  useFrame(({ camera }) => {
    const above = camera.position.y > topYRef.current
    pedestal.current.visible = above
    shadows.current.visible = above
  })

  return (
    <>
      <group ref={pedestal}>
        <mesh geometry={geometry} material={material} receiveShadow />
      </group>
      <group ref={shadows}>
        <ContactShadows
          key={shadow.key}
          scale={shadow.scale}
          far={4.2}
          resolution={256}
          color={SHADOW_COLOR}
          opacity={0.32}
          blur={2.4}
          frames={1}
        />
      </group>
    </>
  )
}
