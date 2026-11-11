import * as THREE from 'three'
import type { ArchSample, JawLayout } from '@/lib/three/layout'
import { smoothstep } from '@/lib/three/math'

const PROFILE_SEGMENTS = 40
const CREST_BAND = 0.3
const ARCH_SUBDIVISIONS = 4

interface ContourSample extends ArchSample {
  interdental: number
}

interface CrestShape {
  papillaRise: number
  midToothDip: number
  socketDepth: number
}

function nearestHorizontalDistance(point: THREE.Vector3, targets: THREE.Vector3[]) {
  let nearest = Infinity
  for (const target of targets) nearest = Math.min(nearest, Math.hypot(point.x - target.x, point.z - target.z))
  return nearest
}

function subdivideArch(arch: ArchSample[]) {
  const dense: ArchSample[] = []
  for (let i = 0; i < arch.length - 1; i++) {
    const from = arch[i]
    const to = arch[i + 1]
    for (let k = 0; k < ARCH_SUBDIVISIONS; k++) {
      const t = k / ARCH_SUBDIVISIONS
      dense.push({
        point: from.point.clone().lerp(to.point, t),
        outward: from.outward.clone().lerp(to.outward, t).normalize(),
        halfDepth: from.halfDepth + (to.halfDepth - from.halfDepth) * t,
      })
    }
  }
  dense.push(arch[arch.length - 1])
  return dense
}

function contourSamples(layout: JawLayout): ContourSample[] {
  const toothCenters = layout.teeth.map((tooth) => tooth.position)
  const contactPoints = layout.contacts.map((contact) => contact.position)
  return subdivideArch(layout.arch).map((sample) => {
    const toToothCenter = nearestHorizontalDistance(sample.point, toothCenters)
    const toContact = nearestHorizontalDistance(sample.point, contactPoints)
    const phase = toToothCenter / Math.max(toToothCenter + toContact, 1e-5)
    return { ...sample, interdental: smoothstep(0.35, 1, phase) }
  })
}

function crestOffset(shape: CrestShape, interdental: number, crestWeight: number, innerWeight: number) {
  const scallop = interdental * shape.papillaRise - (1 - interdental) * shape.midToothDip
  const socket = (1 - interdental) * innerWeight * shape.socketDepth
  return crestWeight * (scallop - socket)
}

const GINGIVAL_MARGIN: CrestShape = { papillaRise: 0.1, midToothDip: 0.07, socketDepth: 0 }
const ALVEOLAR_CREST: CrestShape = { papillaRise: 0.04, midToothDip: 0.03, socketDepth: 0.05 }

function superellipse(halfWidth: number, halfHeight: number, centerY: number, exponent: number) {
  const points: THREE.Vector2[] = []
  for (let j = 0; j < PROFILE_SEGMENTS; j++) {
    const theta = (j / PROFILE_SEGMENTS) * Math.PI * 2
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    points.push(
      new THREE.Vector2(
        halfWidth * Math.sign(cos) * Math.pow(Math.abs(cos), exponent),
        centerY + halfHeight * Math.sign(sin) * Math.pow(Math.abs(sin), exponent),
      ),
    )
  }
  return points
}

interface SweepOptions {
  halfWidth: number
  halfHeight: number
  centerY: number
  top: number
  inset: number
  crest: CrestShape
}

function sweepArch(arch: ContourSample[], options: SweepOptions) {
  const profile = superellipse(options.halfWidth, options.halfHeight, options.centerY, 0.55)
  const positions: number[] = []
  const indices: number[] = []
  const rings = arch.map((sample) =>
    profile.map((point) => {
      const hug = smoothstep(-0.55, options.top, point.y)
      const halfDepth = Math.max(0.12, sample.halfDepth - options.inset)
      const u = point.x * (1 + (halfDepth / options.halfWidth - 1) * hug)
      const crestWeight = smoothstep(options.top - CREST_BAND, options.top, point.y)
      const innerWeight = 1 - smoothstep(0.5, 0.8, Math.abs(point.x) / options.halfWidth)
      const crest = crestOffset(options.crest, sample.interdental, crestWeight, innerWeight)
      return new THREE.Vector3(
        sample.point.x + sample.outward.x * u,
        sample.point.y + point.y + crest,
        sample.point.z + sample.outward.z * u,
      )
    }),
  )
  for (const ring of rings) for (const vertex of ring) positions.push(vertex.x, vertex.y, vertex.z)
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < PROFILE_SEGMENTS; j++) {
      const a = i * PROFILE_SEGMENTS + j
      const b = i * PROFILE_SEGMENTS + ((j + 1) % PROFILE_SEGMENTS)
      const c = (i + 1) * PROFILE_SEGMENTS + j
      const d = (i + 1) * PROFILE_SEGMENTS + ((j + 1) % PROFILE_SEGMENTS)
      indices.push(a, c, b, b, c, d)
    }
  }
  const capTriangles = THREE.ShapeUtils.triangulateShape(profile, [])
  for (const ring of [rings[0], rings[rings.length - 1]]) {
    const start = positions.length / 3
    for (const vertex of ring) positions.push(vertex.x, vertex.y, vertex.z)
    for (const triangle of capTriangles) indices.push(start + triangle[0], start + triangle[1], start + triangle[2])
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

export const gumGeometry = (layout: JawLayout) =>
  sweepArch(contourSamples(layout), {
    halfWidth: 0.66,
    halfHeight: 1.0,
    centerY: -0.86,
    top: 0.14,
    inset: 0,
    crest: GINGIVAL_MARGIN,
  })

export const boneGeometry = (layout: JawLayout) =>
  sweepArch(contourSamples(layout), {
    halfWidth: 0.58,
    halfHeight: 0.88,
    centerY: -0.94,
    top: -0.06,
    inset: 0.06,
    crest: ALVEOLAR_CREST,
  })

const hash = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453
  return h - Math.floor(h)
}

export function domeGeometry(withRugae: boolean) {
  const geometry = new THREE.SphereGeometry(1, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2)
  if (withRugae) {
    const position = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const rugae = z > 0.25 && y < 0.85 ? 0.05 * Math.max(0, Math.sin(z * 26)) * (1 - Math.abs(x) * 1.2) : 0
      const raphe = 0.035 * Math.exp(-(x * x) / 0.004)
      position.setY(i, y + Math.max(0, rugae + raphe))
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

export function tongueGeometry() {
  const geometry = new THREE.SphereGeometry(1, 56, 36)
  const position = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < position.count; i++) {
    let x = position.getX(i)
    let y = position.getY(i)
    const z = position.getZ(i)
    if (y < 0) y *= 0.55
    if (z > 0.25) x *= 1 - 0.38 * ((z - 0.25) / 0.75)
    if (y > 0) {
      y -= 0.16 * Math.exp(-(x * x) / 0.03) * (0.4 + 0.6 * (1 - Math.abs(z)))
      y += (hash(x, y, z) - 0.5) * 0.025
    }
    position.setXYZ(i, x, y, z)
  }
  geometry.computeVertexNormals()
  return geometry
}
