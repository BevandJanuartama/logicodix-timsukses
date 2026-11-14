'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { noRaycast } from '@/lib/three/clip'
import { renderedDentition, useAppStore } from '@/lib/store'
import { getToolDimensions, type ToolDimensions } from '@/lib/three/toolDimensions'

/*
 * Local frame shared by every tool (set by ToolCursor):
 *   origin = working point on the surface, +z = surface normal (away from tissue), +x = toward the handle.
 */

const toolMaterials = {
  handle: new THREE.MeshStandardMaterial({ color: '#0b8f8c', roughness: 0.35 }),
  bristle: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 }),
  accent: new THREE.MeshStandardMaterial({ color: '#12b886', roughness: 0.4 }),
  thread: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
}

const ignoreRaycast = noRaycast as never

/** Tool shapes are rebuilt only when the rendered dentition (and therefore the reference sizes) changes. */
function useToolShape<T>(build: (dims: ToolDimensions) => T) {
  const dentition = useAppStore(renderedDentition)
  return useMemo(() => build(getToolDimensions(dentition)), [build, dentition])
}

/* ── Toothbrush: bristle tips at the origin, head spans ~2.2 molars along the arch ── */

function brushShape(dims: ToolDimensions) {
  const { headLength, headWidth, bristleLength } = dims.brush
  const cols = 9
  const rows = 3
  const tuftRadius = (headWidth / rows) * 0.3
  const pitchX = (headLength - tuftRadius * 4) / (cols - 1)
  const pitchY = (headWidth - tuftRadius * 4) / (rows - 1)
  const tufts = Array.from({ length: cols * rows }, (_, i): [number, number] => [
    -headLength / 2 + tuftRadius * 2 + (i % cols) * pitchX,
    -headWidth / 2 + tuftRadius * 2 + Math.floor(i / cols) * pitchY,
  ])
  const plate = headWidth * 0.17
  const plateZ = bristleLength + plate / 2
  const tilt = 0.12
  const dir = new THREE.Vector3(Math.cos(tilt), 0, Math.sin(tilt))
  const neckLength = headLength * 0.7
  const handleLength = headLength * 1.5
  const neckStart = new THREE.Vector3(headLength / 2, 0, plateZ)
  const neckCenter = neckStart.clone().addScaledVector(dir, neckLength / 2)
  const handleCenter = neckStart.clone().addScaledVector(dir, neckLength + handleLength / 2)
  return {
    tufts,
    tuftRadius,
    bristleLength,
    plate: { size: [headLength, headWidth, plate] as const, z: plateZ },
    neck: { size: [neckLength, headWidth * 0.26, plate * 0.9] as const, center: neckCenter.toArray() },
    handle: { size: [handleLength, headWidth * 0.42, plate * 1.6] as const, center: handleCenter.toArray() },
    rotationY: -tilt,
  }
}

export function BrushModel() {
  const BRUSH = useToolShape(brushShape)
  return (
    <group>
      {BRUSH.tufts.map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, BRUSH.bristleLength / 2]}
          rotation={[Math.PI / 2, 0, 0]}
          material={index % 4 === 0 ? toolMaterials.accent : toolMaterials.bristle}
          raycast={ignoreRaycast}
        >
          <cylinderGeometry args={[BRUSH.tuftRadius, BRUSH.tuftRadius, BRUSH.bristleLength, 6]} />
        </mesh>
      ))}
      <mesh position={[0, 0, BRUSH.plate.z]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={BRUSH.plate.size} />
      </mesh>
      <mesh position={BRUSH.neck.center} rotation={[0, BRUSH.rotationY, 0]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={BRUSH.neck.size} />
      </mesh>
      <mesh position={BRUSH.handle.center} rotation={[0, BRUSH.rotationY, 0]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={BRUSH.handle.size} />
      </mesh>
    </group>
  )
}

/* ── Floss pick: thread midpoint at the origin, thread spans crown + gum margin + sulcus ── */

function flossShape(dims: ToolDimensions) {
  const { threadLength } = dims.floss
  const prong = threadLength * 0.08
  const prongLength = threadLength * 0.45
  const handleLength = threadLength * 1.8
  return {
    threadLength,
    prong,
    prongLength,
    handle: { size: [prong * 2, prong * 2.6, handleLength] as const, z: prongLength + handleLength / 2 },
  }
}

export function FlosserModel() {
  const { threadLength, prong, prongLength, handle } = useToolShape(flossShape)
  return (
    <group>
      <mesh material={toolMaterials.thread} raycast={ignoreRaycast}>
        <cylinderGeometry args={[0.012, 0.012, threadLength, 5]} />
      </mesh>
      {[threadLength / 2, -threadLength / 2].map((y) => (
        <mesh key={y} position={[0, y, prongLength / 2 - prong / 2]} material={toolMaterials.accent} raycast={ignoreRaycast}>
          <boxGeometry args={[prong, prong, prongLength]} />
        </mesh>
      ))}
      <mesh position={[0, 0, prongLength - prong / 2]} material={toolMaterials.accent} raycast={ignoreRaycast}>
        <boxGeometry args={[prong, threadLength + prong, prong]} />
      </mesh>
      <mesh position={[0, 0, handle.z]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={handle.size} />
      </mesh>
    </group>
  )
}

/* ── Tongue scraper: blade apex at the origin, U-blade as wide as the inner molar arch ── */

function scraperShape(dims: ToolDimensions) {
  const { width, depth } = dims.scraper
  const halfWidth = width / 2
  const tube = width * 0.017
  const blade = new THREE.CatmullRomCurve3(
    Array.from({ length: 25 }, (_, i) => {
      const t = -Math.PI / 2 + (i / 24) * Math.PI
      return new THREE.Vector3(depth - depth * Math.cos(t), halfWidth * Math.sin(t), tube)
    }),
  )
  const armLength = width * 0.55
  const grip = tube * 2.4
  const arms = [1, -1].map((side) => {
    const from = new THREE.Vector2(depth, halfWidth * side)
    const to = new THREE.Vector2(depth + armLength, grip * side)
    const delta = to.clone().sub(from)
    return {
      side,
      position: [(from.x + to.x) / 2, (from.y + to.y) / 2, tube] as const,
      angle: Math.atan2(delta.y, delta.x) - Math.PI / 2,
      length: delta.length(),
    }
  })
  const handleLength = width * 0.75
  return {
    blade,
    tube,
    arms,
    handle: { size: [handleLength, grip * 2.6, tube * 2] as const, x: depth + armLength + handleLength / 2 },
  }
}

export function ScraperModel() {
  const { blade, tube, arms, handle } = useToolShape(scraperShape)
  return (
    <group>
      <mesh material={toolMaterials.accent} raycast={ignoreRaycast}>
        <tubeGeometry args={[blade, 48, tube, 8, false]} />
      </mesh>
      {arms.map((arm) => (
        <mesh key={arm.side} position={arm.position} rotation={[0, 0, arm.angle]} material={toolMaterials.accent} raycast={ignoreRaycast}>
          <cylinderGeometry args={[tube * 0.8, tube * 0.8, arm.length, 6]} />
        </mesh>
      ))}
      <mesh position={[handle.x, 0, tube]} material={toolMaterials.handle} raycast={ignoreRaycast}>
        <boxGeometry args={handle.size} />
      </mesh>
    </group>
  )
}
