'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { sceneRegistry } from '@/lib/three/registry'

const PEDESTAL_COLOR = '#EADBCB'
const SHADOW_COLOR = '#7A4E3A'
const PEDESTAL_THICKNESS = 0.3
const GAP_BELOW_JAW = 0.12
const RADIUS_MARGIN = 1.35
const FALLBACK_BASE_Y = -3.6
const FALLBACK_RADIUS = 4.6
const SHADOW_SPAN = 2.6
const SHADOW_OFFSET = 0.012

const jawBounds = new THREE.Box3()
const jawSize = new THREE.Vector3()

export function Pedestal() {
  const pedestal = useRef<THREE.Group>(null!)
  const shadows = useRef<THREE.Group>(null!)
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
    const lowerJaw = sceneRegistry.jaws.lower
    if (lowerJaw) {
      lowerJaw.updateWorldMatrix(true, true)
      jawBounds.setFromObject(lowerJaw)
      if (!jawBounds.isEmpty()) {
        jawBounds.getSize(jawSize)
        topY = jawBounds.min.y - GAP_BELOW_JAW
        radius = (Math.max(jawSize.x, jawSize.z) / 2) * RADIUS_MARGIN
      }
    }
    pedestal.current.position.set(0, topY - PEDESTAL_THICKNESS / 2, 0)
    pedestal.current.scale.set(radius, 1, radius)
    shadows.current.position.set(0, topY + SHADOW_OFFSET, 0)
  }, [])

  return (
    <>
      <group ref={pedestal}>
        <mesh geometry={geometry} material={material} receiveShadow />
      </group>
      <group ref={shadows}>
        <ContactShadows
          scale={FALLBACK_RADIUS * SHADOW_SPAN}
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
