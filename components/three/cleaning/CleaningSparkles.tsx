'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cleaningState } from '@/lib/three/cleaning'
import { noRaycast } from '@/lib/three/clip'

const SPARKLE_POOL = 48
const BURST_SIZE = 4
const FADE_RATE = 1.8
const DRAG = 0.92
const SPARKLE_SIZE = 0.05
const SPIN_RATE = 4

const matrix = new THREE.Matrix4()
const rotation = new THREE.Quaternion()
const scale = new THREE.Vector3()

interface Sparkle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
}

export function CleaningSparkles() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), [])
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#8fd0ff', transparent: true, opacity: 0.95, toneMapped: false }), [])
  const pool = useMemo<Sparkle[]>(
    () => Array.from({ length: SPARKLE_POOL }, () => ({ position: new THREE.Vector3(), velocity: new THREE.Vector3(), life: 0 })),
    [],
  )
  const cursor = useRef(0)

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state, delta) => {
    while (cleaningState.sparkles.length) {
      const source = cleaningState.sparkles.pop()!
      for (let burst = 0; burst < BURST_SIZE; burst++) {
        const sparkle = pool[cursor.current++ % SPARKLE_POOL]
        sparkle.position.copy(source)
        sparkle.velocity.set((Math.random() - 0.5) * 1.4, Math.random() * 1.4 + 0.4, (Math.random() - 0.5) * 1.4)
        sparkle.life = 1
      }
    }
    const elapsed = state.clock.elapsedTime
    for (let index = 0; index < SPARKLE_POOL; index++) {
      const sparkle = pool[index]
      if (sparkle.life > 0) {
        sparkle.life -= delta * FADE_RATE
        sparkle.position.addScaledVector(sparkle.velocity, delta)
        sparkle.velocity.multiplyScalar(DRAG)
      }
      rotation.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, elapsed * SPIN_RATE + index)
      matrix.compose(sparkle.position, rotation, scale.setScalar(Math.max(0, sparkle.life) * SPARKLE_SIZE))
      mesh.current.setMatrixAt(index, matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={mesh} args={[geometry, material, SPARKLE_POOL]} raycast={noRaycast as never} frustumCulled={false} />
}
