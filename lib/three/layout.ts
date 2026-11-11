import * as THREE from 'three'
import { smoothstep } from '@/lib/three/math'

export type ToothKind = 'incisor' | 'canine' | 'premolar' | 'molar'
export type Jaw = 'upper' | 'lower'

export interface ToothParams {
  kind: ToothKind
  width: number
  depth: number
  crownHeight: number
  rootLength: number
  tip: number
}

const params = (
  kind: ToothKind,
  width: number,
  depth: number,
  crownHeight: number,
  rootLength: number,
  tip: number,
): ToothParams => ({ kind, width, depth, crownHeight, rootLength, tip })

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

const TOOTH_NAMES = [
  'Gigi Seri Sentral',
  'Gigi Seri Lateral',
  'Gigi Taring',
  'Premolar Pertama',
  'Premolar Kedua',
  'Molar Pertama',
  'Molar Kedua',
  'Molar Ketiga (Bungsu)',
]

const QUADRANT_NAMES: Record<number, string> = {
  1: 'kanan atas',
  2: 'kiri atas',
  3: 'kiri bawah',
  4: 'kanan bawah',
}

export interface ToothInfo {
  id: string
  fdi: number
  quadrant: number
  jaw: Jaw
  index: number
  name: string
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
}

export interface JawLayout {
  jaw: Jaw
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
const TOOTH_GAP = 0.012
const UP = new THREE.Vector3(0, 1, 0)

function buildJaw(jaw: Jaw): JawLayout {
  const toothParams = jaw === 'upper' ? UPPER_PARAMS : LOWER_PARAMS
  const total = toothParams.reduce((sum, p) => sum + p.width + TOOTH_GAP, TOOTH_GAP / 2)
  const baseCurve = new THREE.CatmullRomCurve3(ARCH_CURVE.map(([x, z]) => new THREE.Vector3(x, 0, z)))
  const scale = (total + 0.3) / baseCurve.getLength()
  const curve = new THREE.CatmullRomCurve3(ARCH_CURVE.map(([x, z]) => new THREE.Vector3(x * scale, 0, z * scale)))
  const length = curve.getLength()
  const curveOfSpee = (s: number) => 0.1 * smoothstep(total * 0.32, total * 0.66, s)

  const sampleArch = (s: number, side: 1 | -1) => {
    const u = Math.min(1, Math.max(0, s / length))
    const point = curve.getPointAt(u)
    const tangent = curve.getTangentAt(u)
    const outward = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
    point.y = curveOfSpee(s)
    if (side === -1) {
      point.x *= -1
      outward.x *= -1
    }
    return { point, outward }
  }

  const intervals: { start: number; end: number; params: ToothParams }[] = []
  let cursor = TOOTH_GAP / 2
  for (const p of toothParams) {
    intervals.push({ start: cursor, end: cursor + p.width, params: p })
    cursor += p.width + TOOTH_GAP
  }
  const depthAt = (s: number) =>
    (intervals.find((interval) => s <= interval.end + TOOTH_GAP) ?? intervals[intervals.length - 1]).params.depth
  const halfDepthAt = (s: number) => (depthAt(Math.max(0, s - 0.18)) + depthAt(s) + depthAt(s + 0.18)) / 6 + 0.07

  const teeth: ToothInfo[] = []
  const contacts: Contact[] = []

  for (const side of [1, -1] as const) {
    const quadrant = jaw === 'lower' ? (side === 1 ? 3 : 4) : side === 1 ? 1 : 2
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
        name: TOOTH_NAMES[i],
        params: interval.params,
        position: point,
        quaternion,
        matrix: new THREE.Matrix4().compose(point, quaternion, new THREE.Vector3(1, 1, 1)),
      })
    })
    for (let i = 0; i < intervals.length - 1; i++) {
      const { point, outward } = sampleArch(intervals[i].end + TOOTH_GAP / 2, side)
      contacts.push({ position: point, outward, toothA: `${quadrant}${i + 1}`, toothB: `${quadrant}${i + 2}` })
    }
  }
  const midline = sampleArch(0, 1)
  contacts.push({
    position: midline.point,
    outward: midline.outward,
    toothA: jaw === 'lower' ? '31' : '11',
    toothB: jaw === 'lower' ? '41' : '21',
  })

  const archEnd = total + 0.16
  const samples = 46
  const arch: ArchSample[] = []
  for (let j = samples; j >= 0; j--) {
    const s = (archEnd * j) / samples
    const { point, outward } = sampleArch(s, 1)
    arch.push({ point, outward, halfDepth: halfDepthAt(s) })
  }
  for (let j = 1; j <= samples; j++) {
    const s = (archEnd * j) / samples
    const { point, outward } = sampleArch(s, -1)
    arch.push({ point, outward, halfDepth: halfDepthAt(s) })
  }

  const positiveSide = teeth.filter((tooth) => tooth.quadrant === (jaw === 'lower' ? 3 : 1))
  const firstMolar = positiveSide[5]
  const centralIncisor = positiveSide[0]
  const thirdMolar = positiveSide[7]
  const inner = {
    halfX: firstMolar.position.x - firstMolar.params.depth * 0.5 - 0.04,
    zFront: centralIncisor.position.z - centralIncisor.params.depth * 0.5 - 0.04,
    zBack: thirdMolar.position.z - 0.25,
  }

  return { jaw, teeth, contacts, arch, inner }
}

let cachedLayouts: Layouts | null = null

export function getLayouts(): Layouts {
  if (cachedLayouts) return cachedLayouts
  const upper = buildJaw('upper')
  const lower = buildJaw('lower')
  const byId = new Map([...upper.teeth, ...lower.teeth].map((tooth) => [tooth.id, tooth]))
  cachedLayouts = { upper, lower, byId }
  return cachedLayouts
}

export const toothLabel = (info: ToothInfo) => `${info.name} ${QUADRANT_NAMES[info.quadrant]}`
