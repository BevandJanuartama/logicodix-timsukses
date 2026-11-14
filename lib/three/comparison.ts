import * as THREE from 'three'
import { getLayouts, type Jaw } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import type { ComparisonMode } from '@/lib/types'

type Vec3 = [number, number, number]

/** Half the distance between jaw centres when side by side (each jaw is ~6.4 wide incl. gum). */
const SIDE_GAP = 3.3
/** Vertical spacing when stacked (portrait screens), clears an open upper jaw + label. */
const STACK_GAP = 8.4
/** Overlay: primary incisors sit just inside the permanent ones, as they do before exfoliation. */
const OVERLAY_INSET = 0.1
/** Below this aspect the two jaws are stacked instead of placed side by side. */
export const STACK_ASPECT = 0.8

export interface ComparisonPlacement {
  /** Offset of the interactive (permanent) jaws. */
  main: Vec3
  /** Offset of the comparison (primary) jaws. */
  compare: Vec3
  /** Extra per-jaw z shift of the comparison jaws (overlay front alignment). */
  compareJawZ: Record<Jaw, number>
  stacked: boolean
}

const NO_SHIFT: Record<Jaw, number> = { upper: 0, lower: 0 }

export function comparisonPlacement(mode: ComparisonMode, aspect: number): ComparisonPlacement {
  if (mode === 'side-by-side') {
    const stacked = aspect < STACK_ASPECT
    return stacked
      ? { main: [0, 0, 0], compare: [0, STACK_GAP, 0], compareJawZ: NO_SHIFT, stacked }
      : { main: [SIDE_GAP, 0, 0], compare: [-SIDE_GAP, 0, 0], compareJawZ: NO_SHIFT, stacked }
  }
  if (mode === 'overlay') {
    const permanent = getLayouts('permanent')
    const primary = getLayouts('primary')
    const align = (jaw: Jaw) => permanent[jaw].inner.zFront - primary[jaw].inner.zFront - OVERLAY_INSET
    return { main: [0, 0, 0], compare: [0, 0, 0], compareJawZ: { upper: align('upper'), lower: align('lower') }, stacked: false }
  }
  return { main: [0, 0, 0], compare: [0, 0, 0], compareJawZ: NO_SHIFT, stacked: false }
}

const partBox = new THREE.Box3()

/** World bounds of every jaw on screen (main + comparison layer). */
export function sceneJawBounds(jaws: 'all' | 'lower' = 'all') {
  const box = new THREE.Box3()
  const pick = (set: Partial<Record<Jaw, THREE.Group>>) => (jaws === 'lower' ? [set.lower] : [set.upper, set.lower])
  for (const jaw of [...pick(sceneRegistry.jaws), ...pick(sceneRegistry.compareJaws)]) {
    if (!jaw) continue
    jaw.updateWorldMatrix(true, true)
    box.union(partBox.setFromObject(jaw))
  }
  return box
}
