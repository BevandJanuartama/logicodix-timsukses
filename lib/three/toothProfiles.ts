import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { ToothParams } from '@/lib/three/layout'
import { clamp01, smoothstep } from '@/lib/three/math'

export const BASE_RADIUS = 0.5
export const DENTIN_CROWN_RATIO = 0.8
export const PULP_CROWN_RATIO = 0.52
export const PULP_ROOT_RATIO = 0.93

const PROFILE_OVERSAMPLING = 10

export function outerRadius(y: number, p: ToothParams): number {
  if (y <= 0) {
    const t = clamp01(-y / p.rootLength)
    return BASE_RADIUS * p.neck * (1 - 0.86 * Math.pow(t, 1.7))
  }
  const t = clamp01(y / p.crownHeight)
  // Primary crowns bulge out faster above a narrower neck (pronounced cervical constriction).
  const bulgeAt = p.primary ? 0.4 : 0.6
  let radius = BASE_RADIUS * (p.neck + (1 - p.neck) * Math.sin((Math.min(t / bulgeAt, 1) * Math.PI) / 2))
  if (t > 1 - p.tip) {
    const s = (t - (1 - p.tip)) / p.tip
    radius *= p.kind === 'canine' ? Math.pow(Math.max(0, 1 - s), 0.8) : Math.sqrt(Math.max(0, 1 - s * s))
  }
  return radius
}

export function dentinRadius(y: number, p: ToothParams): number {
  if (y <= 0) return outerRadius(y, p) * 0.95
  const dentinHeight = p.crownHeight * DENTIN_CROWN_RATIO
  const t = y / dentinHeight
  if (t >= 1) return 0
  const crown = outerRadius((y * p.crownHeight) / dentinHeight, p) * 0.8
  const root = BASE_RADIUS * p.neck * 0.95
  return root + (crown - root) * smoothstep(0, 0.22, t)
}

export function pulpRadius(y: number, p: ToothParams): number {
  if (y <= 0) {
    const t = -y / (p.rootLength * PULP_ROOT_RATIO)
    if (t >= 1) return 0
    return BASE_RADIUS * 0.16 * (1 - 0.78 * t)
  }
  const t = y / (p.crownHeight * PULP_CROWN_RATIO)
  if (t >= 1) return 0
  let radius = BASE_RADIUS * 0.3 * (0.65 + 0.35 * Math.sin((Math.min(t / 0.5, 1) * Math.PI) / 2))
  if (t > 0.7) {
    const s = (t - 0.7) / 0.3
    radius *= Math.sqrt(Math.max(0, 1 - s * s))
  }
  const base = BASE_RADIUS * 0.16
  return base + (radius - base) * smoothstep(0, 0.3, t)
}

function arcLengthProfile(radiusAt: (y: number) => number, yMin: number, yMax: number, rows: number, capTop: boolean) {
  const denseCount = rows * PROFILE_OVERSAMPLING
  const dense: THREE.Vector2[] = [new THREE.Vector2(0, yMin)]
  for (let i = 1; i < denseCount; i++) {
    const y = yMin + ((yMax - yMin) * i) / denseCount
    dense.push(new THREE.Vector2(Math.max(0, radiusAt(y)), y))
  }
  dense.push(new THREE.Vector2(capTop ? 0 : radiusAt(yMax), yMax))
  const cumulative = [0]
  for (let i = 1; i < dense.length; i++) cumulative.push(cumulative[i - 1] + dense[i].distanceTo(dense[i - 1]))
  const total = cumulative[cumulative.length - 1]
  const points = [dense[0].clone()]
  let cursor = 1
  for (let row = 1; row < rows; row++) {
    const target = (total * row) / rows
    while (cursor < dense.length - 1 && cumulative[cursor] < target) cursor++
    const span = cumulative[cursor] - cumulative[cursor - 1]
    const blend = span > 0 ? (target - cumulative[cursor - 1]) / span : 0
    const point = dense[cursor - 1].clone().lerp(dense[cursor], blend)
    if (point.x > 0.002) points.push(point)
  }
  points.push(dense[dense.length - 1].clone())
  return points
}

export function buildLathe(
  radiusAt: (y: number) => number,
  yMin: number,
  yMax: number,
  rows: number,
  segments: number,
  capTop = true,
) {
  const geometry = new THREE.LatheGeometry(arcLengthProfile(radiusAt, yMin, yMax, rows, capTop), segments)
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')
  return mergeVertices(geometry)
}

export function transformPositions(geometry: THREE.BufferGeometry, transform: (vertex: THREE.Vector3) => void) {
  const position = geometry.attributes.position as THREE.BufferAttribute
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    transform(vertex)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }
  position.needsUpdate = true
  return geometry
}
