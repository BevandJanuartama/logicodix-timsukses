'use client'

import * as THREE from 'three'
import { noRaycast } from '@/lib/three/clip'

const toolMaterials = {
  handle: new THREE.MeshStandardMaterial({ color: '#0b8f8c', roughness: 0.35 }),
  bristle: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 }),
  accent: new THREE.MeshStandardMaterial({ color: '#12b886', roughness: 0.4 }),
  thread: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
}

const ignoreRaycast = noRaycast as never

const BRISTLE_TUFTS: [number, number][] = Array.from({ length: 21 }, (_, i) => [-0.15 + (i % 7) * 0.05, -0.05 + Math.floor(i / 7) * 0.05])

export function BrushModel() {
  return (
    <group>
      {BRISTLE_TUFTS.map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, 0.055]}
          rotation={[Math.PI / 2, 0, 0]}
          material={index % 4 === 0 ? toolMaterials.accent : toolMaterials.bristle}
          raycast={ignoreRaycast}
        >
          <cylinderGeometry args={[0.017, 0.017, 0.11, 6]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.13]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={[0.42, 0.18, 0.05]} />
      </mesh>
      <mesh position={[0.95, 0, 0.2]} rotation={[0, -0.12, 0]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={[1.5, 0.1, 0.06]} />
      </mesh>
    </group>
  )
}

export function FlosserModel() {
  return (
    <group>
      <mesh material={toolMaterials.thread} raycast={ignoreRaycast}>
        <cylinderGeometry args={[0.006, 0.006, 0.62, 5]} />
      </mesh>
      {[0.31, -0.31].map((y) => (
        <mesh key={y} position={[0, y, 0.14]} material={toolMaterials.accent} raycast={ignoreRaycast}>
          <boxGeometry args={[0.05, 0.05, 0.3]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.28]} material={toolMaterials.accent} raycast={ignoreRaycast}>
        <boxGeometry args={[0.05, 0.67, 0.05]} />
      </mesh>
      <mesh position={[0, 0, 0.85]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={[0.07, 0.09, 1.1]} />
      </mesh>
    </group>
  )
}

export function ScraperModel() {
  return (
    <group>
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} material={toolMaterials.accent} raycast={ignoreRaycast}>
        <torusGeometry args={[0.24, 0.025, 8, 28, Math.PI]} />
      </mesh>
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[0.35, 0.14 * side, 0.05]}
          rotation={[0, 0, Math.atan2(-0.2 * side, 0.7) - Math.PI / 2]}
          material={toolMaterials.accent}
          raycast={ignoreRaycast}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.73, 6]} />
        </mesh>
      ))}
      <mesh position={[1.2, 0, 0.07]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={[1.0, 0.12, 0.06]} />
      </mesh>
    </group>
  )
}
