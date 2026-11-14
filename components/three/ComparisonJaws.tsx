'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import type { ComparisonPlacement } from '@/lib/three/comparison'
import { getLayouts } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import { retainToothGeometries } from '@/lib/three/toothGeometry'
import type { ComparisonMode } from '@/lib/types'
import { JawContent } from './JawContent'
import { HINGE_Z, JAW_OFFSET_Y, LOWER_OPEN_ANGLE, UPPER_OPEN_ANGLE, sharedJawPose } from './jawRig'
import type { TissueMaterials } from './useTissueMaterials'

/** Height of the jaw labels above each jaw pair's origin (clears the open upper jaw). */
const LABEL_RISE = 4.2

function JawLabel({ position, children }: { position: [number, number, number]; children: string }) {
  return (
    <Html center position={position} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <span className="whitespace-nowrap rounded-full bg-surface-raised px-3 py-1 text-caption font-semibold text-fg shadow-float">
        {children}
      </span>
    </Html>
  )
}

interface ComparisonJawsProps {
  mode: Exclude<ComparisonMode, 'off'>
  placement: ComparisonPlacement
  materials: TissueMaterials
}

/**
 * The primary dentition as a look-only comparison layer next to (or through) the permanent jaws.
 * Mirrors the main jaws' animated hinge pose; registers its jaws only for framing (pedestal, camera bounds).
 */
export function ComparisonJaws({ mode, placement, materials }: ComparisonJawsProps) {
  const layouts = useMemo(() => getLayouts('primary'), [])
  const overlayOpacity = useAppStore((state) => state.overlayOpacity)
  const upperHinge = useRef<THREE.Group>(null!)
  const lowerHinge = useRef<THREE.Group>(null!)
  const upperJaw = useRef<THREE.Group>(null!)
  const lowerJaw = useRef<THREE.Group>(null!)
  const variant = mode === 'overlay' ? 'ghost' : 'compare'

  useLayoutEffect(() => {
    sceneRegistry.compareJaws.upper = upperJaw.current
    sceneRegistry.compareJaws.lower = lowerJaw.current
    return () => {
      sceneRegistry.compareJaws = {}
    }
  }, [])

  // Teeth dispose their own materials on unmount; this frees the cached primary geometry once nothing shows it.
  useEffect(() => retainToothGeometries(layouts, () => layouts.byId.keys()), [layouts])

  useFrame(() => {
    upperHinge.current.rotation.x = sharedJawPose.upper
    lowerHinge.current.rotation.x = sharedJawPose.lower
    lowerJaw.current.position.x = sharedJawPose.shift
    lowerJaw.current.position.z = -HINGE_Z + sharedJawPose.forward + placement.compareJawZ.lower
  })

  const [cx, cy, cz] = placement.compare
  const [mx, my, mz] = placement.main

  return (
    <>
      <group position={placement.compare}>
        <group ref={upperHinge} position={[0, 0, HINGE_Z]} rotation={[UPPER_OPEN_ANGLE, 0, 0]}>
          <group ref={upperJaw} position={[0, JAW_OFFSET_Y, -HINGE_Z + placement.compareJawZ.upper]} rotation={[0, 0, Math.PI]}>
            <JawContent layout={layouts.upper} materials={materials} variant={variant} ghostOpacity={overlayOpacity} />
          </group>
        </group>
        <group ref={lowerHinge} position={[0, 0, HINGE_Z]} rotation={[LOWER_OPEN_ANGLE, 0, 0]}>
          <group ref={lowerJaw} position={[0, -JAW_OFFSET_Y, -HINGE_Z + placement.compareJawZ.lower]}>
            <JawContent layout={layouts.lower} materials={materials} variant={variant} ghostOpacity={overlayOpacity} />
          </group>
        </group>
      </group>
      {mode === 'side-by-side' && (
        <>
          <JawLabel position={[cx, cy + LABEL_RISE, cz]}>Gigi Susu</JawLabel>
          <JawLabel position={[mx, my + LABEL_RISE, mz]}>Gigi Dewasa</JawLabel>
        </>
      )}
    </>
  )
}
