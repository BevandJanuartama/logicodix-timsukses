'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLEAN_TARGET, useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { cleaningState, computeCleanStats, generatePlaque, rinseWithMouthwash } from '@/lib/three/cleaning'
import { noRaycast } from '@/lib/three/clip'
import { getLayouts } from '@/lib/three/layout'

const STATS_INTERVAL = 0.15
const SPARKLE_POOL = 40

const matrix = new THREE.Matrix4()
const rotation = new THREE.Quaternion()
const scale = new THREE.Vector3()

function Sparkles() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), [])
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#7ef3e1', transparent: true, opacity: 0.95, toneMapped: false }),
    [],
  )
  const pool = useMemo(
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
      for (let burst = 0; burst < 4; burst++) {
        const sparkle = pool[cursor.current++ % SPARKLE_POOL]
        sparkle.position.copy(source)
        sparkle.velocity.set((Math.random() - 0.5) * 1.4, Math.random() * 1.4 + 0.4, (Math.random() - 0.5) * 1.4)
        sparkle.life = 1
      }
    }
    pool.forEach((sparkle, index) => {
      if (sparkle.life > 0) {
        sparkle.life -= delta * 1.8
        sparkle.position.addScaledVector(sparkle.velocity, delta)
        sparkle.velocity.multiplyScalar(0.92)
      }
      rotation.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, state.clock.elapsedTime * 4 + index)
      matrix.compose(sparkle.position, rotation, scale.setScalar(Math.max(0, sparkle.life) * 0.05))
      mesh.current.setMatrixAt(index, matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={mesh} args={[geometry, material, SPARKLE_POOL]} raycast={noRaycast as never} frustumCulled={false} />
}

export function CleaningController() {
  const resetNonce = useCleaningStore((state) => state.resetNonce)
  const mouthwashNonce = useCleaningStore((state) => state.mouthwashNonce)
  const lastSync = useRef(0)

  useEffect(() => {
    generatePlaque(getLayouts())
  }, [resetNonce])

  useEffect(() => {
    if (mouthwashNonce > 0) rinseWithMouthwash()
  }, [mouthwashNonce])

  useFrame((state) => {
    if (useAppStore.getState().mode !== 'clean') return
    cleaningState.scrub *= 0.9
    const elapsed = state.clock.elapsedTime
    if (elapsed - lastSync.current < STATS_INTERVAL) return
    lastSync.current = elapsed
    const stats = computeCleanStats()
    const store = useCleaningStore.getState()
    if (store.stats.overall !== stats.overall || store.stats.tongue !== stats.tongue) store.setStats(stats)
    if (stats.overall >= CLEAN_TARGET) store.markFinished()
  })

  return <Sparkles />
}
