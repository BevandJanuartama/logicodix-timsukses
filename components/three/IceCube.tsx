'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { noRaycast } from '@/lib/three/clip'
import { getLayouts } from '@/lib/three/layout'
import { iceBiteCycle } from '@/lib/three/math'
import { sceneRegistry } from '@/lib/three/registry'
import { useAppStore } from '@/lib/store'
import { useSimulatorStore } from '@/lib/simulatorStore'

const UPPER_INCISORS = ['11', '21']
const LOWER_INCISORS = ['31', '41']
const RESTING_DROP = 0.5
const SIZE_RATIO = 0.78
const SQUASH_AT_BITE = 0.16
const APPEAR_EASE = 8
const cursor = new THREE.Vector3()
const upperCenter = new THREE.Vector3()
const lowerCenter = new THREE.Vector3()

function averagePosition(ids: string[], into: THREE.Vector3) {
  into.set(0, 0, 0)
  let found = 0
  for (const id of ids) {
    const tooth = sceneRegistry.teeth.get(id)
    if (!tooth) continue
    into.add(tooth.getWorldPosition(cursor))
    found++
  }
  if (found) into.divideScalar(found)
  return found > 0
}

export function IceCube() {
  const mesh = useRef<THREE.Mesh>(null!)
  const side = useMemo(() => (getLayouts().byId.get('11')?.params.width ?? 0.8) * SIZE_RATIO, [])

  useFrame((state, delta) => {
    const node = mesh.current
    const { mode } = useAppStore.getState()
    const { track, playing } = useSimulatorStore.getState()
    const show = mode === 'destroy' && track === 'ice'
    const bite = show && playing ? iceBiteCycle(state.clock.elapsedTime) : 0
    const scale = THREE.MathUtils.damp(node.scale.x, show ? 1 : 0, APPEAR_EASE, delta)
    node.visible = scale > 0.02
    if (!node.visible) return

    if (!averagePosition(UPPER_INCISORS, upperCenter) || !averagePosition(LOWER_INCISORS, lowerCenter)) return
    const gapCenter = upperCenter.lerp(lowerCenter, 0.5)
    node.position.copy(lowerCenter).lerp(gapCenter, RESTING_DROP + (1 - RESTING_DROP) * bite)
    node.scale.set(scale, scale * (1 - SQUASH_AT_BITE * bite), scale)
    node.rotation.y = 0.35 + bite * 0.05
  })

  return (
    <mesh ref={mesh} visible={false} scale={0} raycast={noRaycast as never}>
      <boxGeometry args={[side, side, side]} />
      <meshPhysicalMaterial color="#a9dcf3" emissive="#6fc3ea" emissiveIntensity={0.35} transparent opacity={0.85} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} ior={1.31} depthWrite={false} />
    </mesh>
  )
}
