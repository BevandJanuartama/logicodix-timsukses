'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { activeComparison, jawSectionOn, renderedDentition, useAppStore } from '@/lib/store'
import { jawClip } from '@/lib/three/clip'
import { STACK_ASPECT, sceneJawBounds } from '@/lib/three/comparison'
import type { SectionAxis } from '@/lib/types'

/** How fast the cut glides to the slider position (also the entry sweep when the cut opens). */
const SECTION_EASE = 7

const edgesOf = (box: THREE.Box3, axis: SectionAxis) =>
  axis === 'sagittal' ? ([box.min.x, box.max.x] as const) : ([box.min.z, box.max.z] as const)

function placePlane(axis: SectionAxis, at: number) {
  // Keep the side below `at` (patient's left / back): the cut face looks toward +x (right view) or +z (front view).
  const plane = jawClip.planes[0]
  plane.normal.set(axis === 'sagittal' ? -1 : 0, 0, axis === 'frontal' ? -1 : 0)
  plane.constant = at
}

/**
 * Drives the whole-jaw cross-section plane. The slider's 0..1 is calibrated to the bounding box of every jaw on
 * screen (so it fits permanent, primary and comparison layouts alike); the plane glides in from the far edge.
 */
export function JawSectionController() {
  const on = useAppStore(jawSectionOn)
  const axis = useAppStore((state) => state.jawSection.axis)
  const dentition = useAppStore(renderedDentition)
  const comparison = useAppStore(activeComparison)
  const stacked = useThree((state) => state.size.width / Math.max(1, state.size.height) < STACK_ASPECT)
  const bounds = useRef(new THREE.Box3())
  const current = useRef(0)

  // After commit, so the jaws being measured are the ones now on screen.
  useEffect(() => {
    jawClip.active = on
    if (!on) return
    bounds.current.copy(sceneJawBounds())
    const [, far] = edgesOf(bounds.current, axis)
    current.current = far
    placePlane(axis, far)
  }, [on, axis, dentition, comparison, stacked])

  useEffect(
    () => () => {
      jawClip.active = false
    },
    [],
  )

  useFrame((_, delta) => {
    if (!jawClip.active || bounds.current.isEmpty()) return
    const { axis: liveAxis, position } = useAppStore.getState().jawSection
    const [near, far] = edgesOf(bounds.current, liveAxis)
    const target = near + (far - near) * position
    current.current = THREE.MathUtils.damp(current.current, target, SECTION_EASE, delta)
    placePlane(liveAxis, current.current)
  })

  return null
}
