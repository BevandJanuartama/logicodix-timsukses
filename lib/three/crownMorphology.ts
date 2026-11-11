import * as THREE from 'three'
import type { ToothKind, ToothParams } from '@/lib/three/layout'
import { clamp01, smoothstep } from '@/lib/three/math'
import { BASE_RADIUS } from '@/lib/three/toothProfiles'

interface CrownPoint {
  xn: number
  zn: number
  radial: number
  heightRatio: number
}

interface AnteriorShape {
  incisalTaper: (heightRatio: number) => number
  cingulum: number
  fossa: number
  marginalRidge: number
  lingualRidge: number
  labialRidge: number
}

const ANTERIOR_SHAPES: Partial<Record<ToothKind, AnteriorShape>> = {
  incisor: {
    incisalTaper: (h) => 1 - 0.7 * Math.pow(clamp01((h - 0.35) / 0.65), 1.25),
    cingulum: 0.18,
    fossa: 0.2,
    marginalRidge: 0.07,
    lingualRidge: 0,
    labialRidge: 0,
  },
  canine: {
    incisalTaper: (h) => 1 - 0.28 * clamp01((h - 0.45) / 0.55),
    cingulum: 0.22,
    fossa: 0.14,
    marginalRidge: 0.06,
    lingualRidge: 0.1,
    labialRidge: 0.06,
  },
}

const gaussian = (x: number, spread: number) => Math.exp(-(x * x) / spread)

function anteriorDepthScale(shape: AnteriorShape, point: CrownPoint) {
  const { xn, zn, radial, heightRatio } = point
  const safeRadial = Math.max(radial, 1e-4)
  const facing = zn / safeRadial
  const sideways = Math.abs(xn) / safeRadial
  let scale = shape.incisalTaper(heightRatio)
  if (facing < 0) {
    const lingualCenter = Math.pow(-facing, 4)
    const cingulumBand = gaussian(heightRatio - 0.22, 0.008)
    const fossaBand = smoothstep(0.32, 0.5, heightRatio) * (1 - smoothstep(0.82, 0.96, heightRatio))
    const ridgeBand = gaussian(sideways - 0.75, 0.025) * fossaBand
    const lingualRidgeBand = gaussian(xn / safeRadial, 0.02) * fossaBand
    scale *=
      1 +
      lingualCenter * (shape.cingulum * cingulumBand - shape.fossa * fossaBand) +
      shape.marginalRidge * ridgeBand +
      shape.lingualRidge * lingualRidgeBand
  } else {
    scale *= 1 + shape.labialRidge * Math.pow(facing, 8) * smoothstep(0.15, 0.6, heightRatio)
  }
  return scale
}

function occlusalRelief(kind: ToothKind, point: CrownPoint, height: number) {
  const { xn, zn, radial, heightRatio } = point
  const ramp = clamp01((heightRatio - 0.55) / 0.45)
  if (ramp <= 0) return 0
  const isMolar = kind === 'molar'
  const amplitude = (isMolar ? 0.085 : 0.1) * height
  const safeRadialSq = Math.max(radial * radial, 1e-6)
  const cosDouble = (zn * zn - xn * xn) / safeRadialSq
  const cuspPattern = isMolar ? 1 - 2 * cosDouble * cosDouble : cosDouble
  const cusps = 0.45 * radial + 0.55 * cuspPattern * radial
  const centralFossa = 1.1 * Math.pow(1 - radial, 2)
  const absX = Math.abs(xn)
  const centralGroove = gaussian(zn, 0.008) * (1 - smoothstep(0.42, 0.7, absX))
  const transverseGroove = isMolar ? gaussian(xn, 0.008) * (1 - 0.5 * smoothstep(0.75, 1, Math.abs(zn))) : 0
  const fissures = Math.max(centralGroove, transverseGroove)
  const marginalRidges = gaussian(absX - 0.6, 0.012) * (1 - smoothstep(0.25, 0.55, Math.abs(zn)))
  return amplitude * ramp * (cusps - centralFossa - 0.4 * fissures + 0.35 * marginalRidges)
}

export function deformToothVertex(
  x0: number,
  y0: number,
  z0: number,
  p: ToothParams,
  height: number,
  crownRelief: boolean,
  out: THREE.Vector3,
) {
  let y = y0
  let z = z0 * p.depth
  if (y0 > 0) {
    const xn = x0 / BASE_RADIUS
    const zn = z0 / BASE_RADIUS
    const point = { xn, zn, radial: Math.min(1, Math.hypot(xn, zn)), heightRatio: y0 / height }
    const anterior = ANTERIOR_SHAPES[p.kind]
    if (anterior) z *= crownRelief ? anteriorDepthScale(anterior, point) : anterior.incisalTaper(point.heightRatio)
    else if (crownRelief) y += occlusalRelief(p.kind, point, height)
  }
  return out.set(x0 * p.width, y, z)
}

export function applyToothDeform(geometry: THREE.BufferGeometry, p: ToothParams, height: number, crownRelief: boolean) {
  const position = geometry.attributes.position as THREE.BufferAttribute
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    deformToothVertex(position.getX(i), position.getY(i), position.getZ(i), p, height, crownRelief, vertex)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }
  position.needsUpdate = true
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}
