import * as THREE from 'three'

export const clipState = {
  planes: [new THREE.Plane(), new THREE.Plane(), new THREE.Plane()],
  active: false,
  toothId: null as string | null,
  offset: 0,
}

export function isClipped(point: THREE.Vector3) {
  if (!clipState.active) return false
  return clipState.planes.every((plane) => plane.distanceToPoint(point) < 0)
}

const clippedHits: THREE.Intersection[] = []

export const clipRaycast = function (this: THREE.Mesh, raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
  const material = this.material as THREE.Material
  if (!clipState.active || !material.clippingPlanes?.length) {
    THREE.Mesh.prototype.raycast.call(this, raycaster, intersects)
    return
  }
  clippedHits.length = 0
  THREE.Mesh.prototype.raycast.call(this, raycaster, clippedHits)
  for (const hit of clippedHits) if (!isClipped(hit.point)) intersects.push(hit)
}

export const noRaycast = () => undefined

export function applyClipping(materials: THREE.Material[], enabled: boolean) {
  for (const material of materials) {
    material.clippingPlanes = enabled ? clipState.planes : null
    material.clipIntersection = true
    material.needsUpdate = true
  }
}
