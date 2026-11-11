import type * as THREE from 'three'
import type { Jaw } from '@/lib/three/layout'

export const sceneRegistry = {
  teeth: new Map<string, THREE.Object3D>(),
  jaws: {} as Partial<Record<Jaw, THREE.Group>>,
}
