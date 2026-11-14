import * as THREE from 'three'
import {
  PRIMARY_TOOTH_NAMES,
  TOOTH_NAMES,
  quadrantsOf,
  type Jaw,
  type Quadrant,
  type ToothIdentity,
  type ToothKind,
} from '@/lib/data/dentition'
import { renderedDentition, useAppStore } from '@/lib/store'
import { smoothstep } from '@/lib/three/math'
import type { Dentition } from '@/lib/types'

export type { Dentition, Jaw, ToothKind }

export interface ToothParams {
  kind: ToothKind
  width: number
  depth: number
  crownHeight: number
  rootLength: number
  tip: number
  /** Crown radius at the CEJ relative to the crown bulge (lower = stronger cervical constriction). */
  neck: number
  primary: boolean
}

const PERMANENT_NECK = 0.8
const PRIMARY_NECK = 0.68

const params = (
  kind: ToothKind,
  width: number,
  depth: number,
  crownHeight: number,
  rootLength: number,
  tip: number,
): ToothParams => ({ kind, width, depth, crownHeight, rootLength, tip, neck: PERMANENT_NECK, primary: false })

const primaryParams = (...args: Parameters<typeof params>): ToothParams => ({ ...params(...args), neck: PRIMARY_NECK, primary: true })

const UPPER_PARAMS: ToothParams[] = [
  params('incisor', 0.8, 0.6, 0.98, 1.25, 0.06),
  params('incisor', 0.64, 0.55, 0.86, 1.15, 0.08),
  params('canine', 0.74, 0.72, 0.98, 1.6, 0.45),
  params('premolar', 0.66, 0.82, 0.8, 1.3, 0.3),
  params('premolar', 0.64, 0.8, 0.76, 1.3, 0.3),
  params('molar', 0.98, 0.98, 0.7, 1.2, 0.22),
  params('molar', 0.92, 0.94, 0.66, 1.15, 0.22),
  params('molar', 0.84, 0.86, 0.6, 1.0, 0.24),
]

const LOWER_PARAMS: ToothParams[] = [
  params('incisor', 0.52, 0.54, 0.86, 1.1, 0.06),
  params('incisor', 0.57, 0.56, 0.88, 1.15, 0.06),
  params('canine', 0.68, 0.7, 0.95, 1.5, 0.45),
  params('premolar', 0.68, 0.74, 0.8, 1.3, 0.3),
  params('premolar', 0.7, 0.78, 0.78, 1.3, 0.3),
  params('molar', 1.06, 0.92, 0.7, 1.2, 0.22),
  params('molar', 0.98, 0.9, 0.66, 1.15, 0.22),
  params('molar', 0.9, 0.86, 0.6, 1.0, 0.24),
]

// Primary teeth: smaller, lower crowns, short slim roots (1 unit ~ 10 mm, from standard deciduous crown dimensions).
const UPPER_PRIMARY_PARAMS: ToothParams[] = [
  primaryParams('incisor', 0.62, 0.5, 0.62, 0.95, 0.06),
  primaryParams('incisor', 0.5, 0.44, 0.56, 0.9, 0.08),
  primaryParams('canine', 0.66, 0.62, 0.66, 1.15, 0.42),
  primaryParams('molar', 0.7, 0.8, 0.52, 0.9, 0.24),
  primaryParams('molar', 0.86, 0.92, 0.56, 0.95, 0.22),
]

const LOWER_PRIMARY_PARAMS: ToothParams[] = [
  primaryParams('incisor', 0.42, 0.4, 0.5, 0.85, 0.06),
  primaryParams('incisor', 0.46, 0.42, 0.54, 0.9, 0.06),
  primaryParams('canine', 0.55, 0.5, 0.6, 1.05, 0.42),
  primaryParams('molar', 0.74, 0.66, 0.52, 0.85, 0.24),
  primaryParams('molar', 0.94, 0.82, 0.56, 0.9, 0.22),
]

const TOOTH_PARAMS: Record<Dentition, Record<Jaw, ToothParams[]>> = {
  permanent: { upper: UPPER_PARAMS, lower: LOWER_PARAMS },
  primary: { upper: UPPER_PRIMARY_PARAMS, lower: LOWER_PRIMARY_PARAMS },
}

export interface ToothInfo extends Omit<ToothIdentity, 'kind'> {
  params: ToothParams
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  matrix: THREE.Matrix4
}

export interface Contact {
  position: THREE.Vector3
  outward: THREE.Vector3
  toothA: string
  toothB: string
}

export interface ArchSample {
  point: THREE.Vector3
  outward: THREE.Vector3
  halfDepth: number
  /** 1 along the dentition; shrinks toward 0 over the retromolar ridge so the gum sweep closes in a rounded end. */
  taper: number
}

export interface JawLayout {
  jaw: Jaw
  dentition: Dentition
  teeth: ToothInfo[]
  contacts: Contact[]
  arch: ArchSample[]
  inner: { halfX: number; zFront: number; zBack: number }
}

export interface Layouts {
  upper: JawLayout
  lower: JawLayout
  byId: Map<string, ToothInfo>
}

const ARCH_CURVE: [number, number][] = [
  [0, 2.0],
  [0.75, 1.86],
  [1.32, 1.5],
  [1.68, 0.9],
  [1.9, 0.15],
  [2.04, -0.7],
  [2.12, -1.6],
  [2.16, -2.5],
]
// Children's arch: rounder, near semicircular anterior segment that widens quickly behind the canine.
const PRIMARY_ARCH_CURVE: [number, number][] = [
  [0, 1.75],
  [0.78, 1.62],
  [1.38, 1.24],
  [1.76, 0.66],
  [1.98, 0.0],
  [2.08, -0.7],
  [2.12, -1.4],
]
const ARCH_CURVES: Record<Dentition, [number, number][]> = { permanent: ARCH_CURVE, primary: PRIMARY_ARCH_CURVE }
// Primary dentition: physiologic spacing between teeth and a compact arch.
const TOOTH_GAPS: Record<Dentition, number> = { permanent: 0.012, primary: 0.03 }
const ARCH_SCALE: Record<Dentition, number> = { permanent: 1, primary: 0.86 }
// Ridge kept behind the last tooth. Primary gets a longer, tapered retromolar pad instead of a flat cut.
const RETROMOLAR: Record<Dentition, { extension: number; taper: boolean }> = {
  permanent: { extension: 0.16, taper: false },
  primary: { extension: 0.75, taper: true },
}
const MIN_TAPER = 0.12
const UP = new THREE.Vector3(0, 1, 0)

const archSpan = (toothParams: ToothParams[], gap: number) => toothParams.reduce((sum, p) => sum + p.width + gap, gap / 2)
const toCurve = (points: [number, number][], scale = 1) =>
  new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x * scale, 0, z * scale)))
const PERMANENT_BASE_LENGTH = toCurve(ARCH_CURVE).getLength()

function archCurve(jaw: Jaw, dentition: Dentition) {
  const total = archSpan(TOOTH_PARAMS[dentition][jaw], TOOTH_GAPS[dentition])
  const permanentSpan = archSpan(TOOTH_PARAMS.permanent[jaw], TOOTH_GAPS.permanent)
  const scale = ((permanentSpan + 0.3) / PERMANENT_BASE_LENGTH) * ARCH_SCALE[dentition]
  const curve = toCurve(ARCH_CURVES[dentition], scale)
  const length = curve.getLength()
  const archEnd = Math.min(length, total + RETROMOLAR[dentition].extension)
  // Midpoint between the incisal front and the end of the ridge: the jaw's depth centre.
  const midZ = (curve.getPointAt(0).z + curve.getPointAt(archEnd / length).z) / 2
  return { curve, length, total, archEnd, midZ }
}

function buildJaw(jaw: Jaw, dentition: Dentition): JawLayout {
  const toothParams = TOOTH_PARAMS[dentition][jaw]
  const toothGap = TOOTH_GAPS[dentition]
  const { curve, length, total, archEnd, midZ } = archCurve(jaw, dentition)
  // Centre a smaller arch on the permanent one so it sits on the pedestal/hinge exactly like the adult jaw.
  const zShift = dentition === 'permanent' ? 0 : archCurve(jaw, 'permanent').midZ - midZ
  const curveOfSpee = (s: number) => 0.1 * smoothstep(total * 0.32, total * 0.66, s)

  const sampleArch = (s: number, side: 1 | -1) => {
    const u = Math.min(1, Math.max(0, s / length))
    const point = curve.getPointAt(u)
    const tangent = curve.getTangentAt(u)
    const outward = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
    point.y = curveOfSpee(s)
    point.z += zShift
    if (side === -1) {
      point.x *= -1
      outward.x *= -1
    }
    return { point, outward }
  }

  const intervals: { start: number; end: number; params: ToothParams }[] = []
  let cursor = toothGap / 2
  for (const p of toothParams) {
    intervals.push({ start: cursor, end: cursor + p.width, params: p })
    cursor += p.width + toothGap
  }
  const depthAt = (s: number) =>
    (intervals.find((interval) => s <= interval.end + toothGap) ?? intervals[intervals.length - 1]).params.depth
  const halfDepthAt = (s: number) => (depthAt(Math.max(0, s - 0.18)) + depthAt(s) + depthAt(s + 0.18)) / 6 + 0.07

  const quadrants = quadrantsOf(dentition)
  const names = dentition === 'primary' ? PRIMARY_TOOTH_NAMES : TOOTH_NAMES
  const teeth: ToothInfo[] = []
  const contacts: Contact[] = []

  for (const side of [1, -1] as const) {
    const quadrant: Quadrant = quadrants[jaw === 'lower' ? (side === 1 ? 2 : 3) : side === 1 ? 0 : 1]
    intervals.forEach((interval, i) => {
      const { point, outward } = sampleArch((interval.start + interval.end) / 2, side)
      const xAxis = new THREE.Vector3().crossVectors(UP, outward).normalize()
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, UP, outward))
      const labialTilt = interval.params.kind === 'incisor' ? 0.16 : interval.params.kind === 'canine' ? 0.07 : 0
      if (labialTilt) quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), labialTilt))
      const fdi = quadrant * 10 + i + 1
      teeth.push({
        id: String(fdi),
        fdi,
        quadrant,
        jaw,
        index: i + 1,
        name: names[i],
        params: interval.params,
        position: point,
        quaternion,
        matrix: new THREE.Matrix4().compose(point, quaternion, new THREE.Vector3(1, 1, 1)),
      })
    })
    for (let i = 0; i < intervals.length - 1; i++) {
      const { point, outward } = sampleArch(intervals[i].end + toothGap / 2, side)
      contacts.push({ position: point, outward, toothA: `${quadrant}${i + 1}`, toothB: `${quadrant}${i + 2}` })
    }
  }
  const midline = sampleArch(0, 1)
  contacts.push({
    position: midline.point,
    outward: midline.outward,
    toothA: `${jaw === 'lower' ? quadrants[2] : quadrants[0]}1`,
    toothB: `${jaw === 'lower' ? quadrants[3] : quadrants[1]}1`,
  })

  const samples = 46
  const taperStart = total + 0.05
  const taperAt = (s: number) => {
    if (!RETROMOLAR[dentition].taper || s <= taperStart) return 1
    const t = Math.min(1, (s - taperStart) / Math.max(1e-3, archEnd - taperStart))
    return Math.max(MIN_TAPER, Math.sqrt(1 - t * t))
  }
  const arch: ArchSample[] = []
  for (let j = samples; j >= 0; j--) {
    const s = (archEnd * j) / samples
    const { point, outward } = sampleArch(s, 1)
    arch.push({ point, outward, halfDepth: halfDepthAt(s), taper: taperAt(s) })
  }
  for (let j = 1; j <= samples; j++) {
    const s = (archEnd * j) / samples
    const { point, outward } = sampleArch(s, -1)
    arch.push({ point, outward, halfDepth: halfDepthAt(s), taper: taperAt(s) })
  }

  const positiveSide = teeth.filter((tooth) => tooth.quadrant === quadrants[jaw === 'lower' ? 2 : 0])
  // Inner width is taken at the largest molar (permanent first molar / primary second molar).
  const widthMolar = dentition === 'primary' ? positiveSide[positiveSide.length - 1] : positiveSide[5]
  const centralIncisor = positiveSide[0]
  const lastTooth = positiveSide[positiveSide.length - 1]
  const inner = {
    halfX: widthMolar.position.x - widthMolar.params.depth * 0.5 - 0.04,
    zFront: centralIncisor.position.z - centralIncisor.params.depth * 0.5 - 0.04,
    zBack: lastTooth.position.z - 0.25,
  }

  return { jaw, dentition, teeth, contacts, arch, inner }
}

const cachedLayouts: Partial<Record<Dentition, Layouts>> = {}

/** The dentition the scene currently renders (explore/clean follow the user's pick, other modes are permanent). */
export const activeDentition = (): Dentition => renderedDentition(useAppStore.getState())

/** Layouts are pure data (no GPU resources), built once per dentition and cached. */
export function getLayouts(dentition: Dentition = activeDentition()): Layouts {
  const cached = cachedLayouts[dentition]
  if (cached) return cached
  const upper = buildJaw('upper', dentition)
  const lower = buildJaw('lower', dentition)
  const byId = new Map([...upper.teeth, ...lower.teeth].map((tooth) => [tooth.id, tooth]))
  return (cachedLayouts[dentition] = { upper, lower, byId })
}
