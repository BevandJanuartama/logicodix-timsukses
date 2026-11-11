'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { cleaningState } from '@/lib/three/cleaning'
import { noRaycast } from '@/lib/three/clip'
import type { Jaw } from '@/lib/three/layout'

const MAX_DEPOSITS = 260

function blobGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 1)
  const position = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    const wobble = 1 + 0.22 * Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.3)
    position.setXYZ(i, x * wobble, y * wobble * 0.7, z * wobble)
  }
  geometry.computeVertexNormals()
  return geometry
}

const matrix = new THREE.Matrix4()
const rotation = new THREE.Quaternion()
const scale = new THREE.Vector3()

export function PlaqueLayer({ jaw }: { jaw: Jaw }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const visible = useAppStore((state) => state.mode === 'clean')
  const geometry = useMemo(() => blobGeometry(), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 }), [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useEffect(() => {
    if (visible) cleaningState.dirty[jaw] = true
  }, [visible, jaw])

  useFrame(() => {
    if (!visible || !cleaningState.dirty[jaw]) return
    cleaningState.dirty[jaw] = false
    let index = 0
    for (const item of cleaningState.items) {
      if (item.jaw !== jaw || index >= MAX_DEPOSITS) continue
      const size = item.health <= 0 ? 0 : item.scale * (0.35 + 0.65 * Math.sqrt(item.health))
      rotation.setFromEuler(item.rotation)
      matrix.compose(item.position, rotation, scale.setScalar(size))
      mesh.current.setMatrixAt(index, matrix)
      mesh.current.setColorAt(index, item.color)
      index++
    }
    mesh.current.count = index
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, MAX_DEPOSITS]}
      visible={visible}
      raycast={noRaycast as never}
      frustumCulled={false}
    />
  )
}
