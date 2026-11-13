'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { activeConditionPose } from '@/lib/three/conditionPose'
import { noRaycast } from '@/lib/three/clip'
import { sceneRegistry } from '@/lib/three/registry'

const EXTRA_SCALE = 0.62
const FORWARD_SHIFT = 0.12
const GROW_EASE = 5

function cloneBeside(toothId: string) {
  const source = sceneRegistry.teeth.get(toothId)
  if (!source?.parent) return null
  const neighbour = sceneRegistry.teeth.get(`2${toothId.slice(1)}`)
  const extra = source.clone(true)
  extra.traverse((child) => {
    if (child instanceof THREE.Mesh) child.raycast = noRaycast as never
  })
  if (neighbour) extra.position.lerpVectors(source.position, neighbour.position, 0.5)
  extra.position.z += FORWARD_SHIFT
  extra.scale.setScalar(0)
  source.parent.add(extra)
  return extra
}

export function ConditionExtraTooth() {
  const extra = useRef<THREE.Object3D | null>(null)

  useEffect(
    () => () => {
      extra.current?.removeFromParent()
    },
    [],
  )

  useFrame((_, delta) => {
    const besideId = activeConditionPose()?.extraToothBeside
    if (besideId && !extra.current) extra.current = cloneBeside(besideId)
    const node = extra.current
    if (!node) return
    const target = besideId ? EXTRA_SCALE : 0
    node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, target, GROW_EASE, delta))
    if (!besideId && node.scale.x < 0.01) {
      node.removeFromParent()
      extra.current = null
    }
  })

  return null
}
