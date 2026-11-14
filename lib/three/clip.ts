import * as THREE from 'three'

/** Single-tooth section: three planes, clipped where all three agree (a wedge window into one tooth). */
export const clipState = {
  planes: [new THREE.Plane(), new THREE.Plane(), new THREE.Plane()],
  active: false,
  toothId: null as string | null,
  offset: 0,
}

/** Whole-jaw cross-section: one plane through every jaw on screen (JawSectionController keeps it in place). */
export const jawClip = {
  planes: [new THREE.Plane(new THREE.Vector3(0, 0, -1), 99)],
  active: false,
}

export function isClipped(point: THREE.Vector3) {
  if (clipState.active) return clipState.planes.every((plane) => plane.distanceToPoint(point) < 0)
  if (jawClip.active) return jawClip.planes[0].distanceToPoint(point) < 0
  return false
}

const clippedHits: THREE.Intersection[] = []

export const clipRaycast = function (this: THREE.Mesh, raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
  const material = this.material as THREE.Material
  if ((!clipState.active && !jawClip.active) || !material.clippingPlanes?.length) {
    THREE.Mesh.prototype.raycast.call(this, raycaster, intersects)
    return
  }
  clippedHits.length = 0
  THREE.Mesh.prototype.raycast.call(this, raycaster, clippedHits)
  for (const hit of clippedHits) if (!isClipped(hit.point)) intersects.push(hit)
}

export const noRaycast = () => undefined

export function setClipPlanes(materials: THREE.Material[], planes: THREE.Plane[] | null) {
  for (const material of materials) {
    if (material.clippingPlanes === planes) continue
    material.clippingPlanes = planes
    material.clipIntersection = true
    material.needsUpdate = true
  }
}

export function applyClipping(materials: THREE.Material[], enabled: boolean) {
  setClipPlanes(materials, enabled ? clipState.planes : null)
}

/** Planes for a material: its own tooth section wins, otherwise the jaw cut, otherwise none. */
export const clipPlanesFor = (toothSectioned: boolean, jawSection: boolean) =>
  toothSectioned ? clipState.planes : jawSection ? jawClip.planes : null
