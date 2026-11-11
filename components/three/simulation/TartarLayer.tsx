'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { simulationClock, useSimulatorStore } from '@/lib/simulatorStore'
import { noRaycast } from '@/lib/three/clip'
import type { JawLayout } from '@/lib/three/layout'
import { seededRandom, smoothstep } from '@/lib/three/math'
import { surfaceNormal, surfacePoint } from '@/lib/three/toothGeometry'

interface TartarDeposit {
  position: THREE.Vector3
  size: number
  rotation: THREE.Euler
  delay: number
}

function tartarDeposits(layout: JawLayout) {
  const random = seededRandom(layout.jaw === 'upper' ? 7 : 11)
  const deposits: TartarDeposit[] = []
  const point = new THREE.Vector3()
  const normal = new THREE.Vector3()
  for (const tooth of layout.teeth) {
    const lowerFront = layout.jaw === 'lower' && tooth.index <= 3
    const upperMolar = layout.jaw === 'upper' && (tooth.index === 6 || tooth.index === 7)
    const hotspot = lowerFront || upperMolar
    const angles = lowerFront
      ? [Math.PI - 0.5, Math.PI, Math.PI + 0.5]
      : upperMolar
        ? [-0.4, 0.1, 0.5]
        : tooth.index <= 7
          ? [random() - 0.5]
          : []
    for (const phi of angles) {
      const y = 0.18 + random() * 0.05
      surfacePoint(tooth.params, phi, y, point)
      surfaceNormal(tooth.params, phi, y, normal)
      deposits.push({
        position: point.clone().addScaledVector(normal, 0.015).applyMatrix4(tooth.matrix),
        size: (hotspot ? 0.1 : 0.06) + random() * 0.03,
        rotation: new THREE.Euler(random() * 3, random() * 3, random() * 3),
        delay: hotspot ? 0 : 0.25 + random() * 0.3,
      })
    }
  }
  return deposits
}

const matrix = new THREE.Matrix4()
const rotation = new THREE.Quaternion()
const scale = new THREE.Vector3()

export function TartarLayer({ layout }: { layout: JawLayout }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const deposits = useMemo(() => tartarDeposits(layout), [layout])
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 1).scale(1, 0.55, 1), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d6c38f', roughness: 0.95 }), [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame(() => {
    const active = useAppStore.getState().mode === 'destroy' && useSimulatorStore.getState().track === 'neglect'
    mesh.current.visible = active
    if (!active) return
    deposits.forEach((deposit, index) => {
      const size =
        deposit.size * smoothstep(0.15 + deposit.delay, 0.75 + deposit.delay * 0.5, simulationClock.progress)
      rotation.setFromEuler(deposit.rotation)
      matrix.compose(deposit.position, rotation, scale.setScalar(size))
      mesh.current.setMatrixAt(index, matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, deposits.length]}
      raycast={noRaycast as never}
      frustumCulled={false}
      visible={false}
    />
  )
}
