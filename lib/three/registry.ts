import type * as THREE from 'three'
import type { Jaw } from '@/lib/three/layout'

export const sceneRegistry = {
  teeth: new Map<string, THREE.Object3D>(),
  jaws: {} as Partial<Record<Jaw, THREE.Group>>,
  /** Jaws of the comparison layer (primary set while comparing); never interactive. */
  compareJaws: {} as Partial<Record<Jaw, THREE.Group>>,
}
