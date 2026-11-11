import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { ToothInfo, ToothParams } from '@/lib/three/layout'
import { clamp01, smoothstep } from '@/lib/three/math'
import { buildLathe, outerRadius, transformPositions } from '@/lib/three/toothProfiles'

export const FURCATION_ROOF = 0.04
const ROOT_OVERLAP = 0.1
const GROOVE_SPREAD = 0.12

interface RootBranch {
  direction: THREE.Vector2
  offset: number
  along: number
  across: number
  splay: number
}

export interface RootPlan {
  branches: RootBranch[]
  furcation: number
  grooveAngles: number[]
  grooveDepth: number
}

export interface BranchSpec {
  scale: number
  inflate: number
  apexY: number
  uniform: boolean
}

export interface ShellSpec {
  radiusAt: (y: number) => number
  top: number
  singleBottom: number
  trunkBottom: number
  capTop: boolean
  rows: number
  segments: number
  carveGrooves: boolean
  branch: BranchSpec
}

const branch = (x: number, z: number, offset: number, along: number, across: number, splay: number): RootBranch => ({
  direction: new THREE.Vector2(x, z).normalize(),
  offset,
  along,
  across,
  splay,
})

const LOWER_MOLAR_BRANCHES = [branch(1, 0, 0.5, 0.62, 1, 0.16), branch(-1, 0, 0.5, 0.62, 1, 0.16)]

const UPPER_MOLAR_BRANCHES = [
  branch(0.62, 0.78, 0.5, 0.62, 0.62, 0.1),
  branch(-0.62, 0.78, 0.5, 0.62, 0.62, 0.1),
  branch(0, -1, 0.5, 0.7, 0.8, 0.14),
]

const angleOf = (direction: THREE.Vector2) => Math.atan2(direction.x, direction.y)

const furcationGrooves = (branches: RootBranch[]) =>
  branches.length === 2
    ? [0, Math.PI]
    : branches.map((current, i) => angleOf(current.direction.clone().add(branches[(i + 1) % branches.length].direction)))

export function rootPlanFor(info: ToothInfo): RootPlan {
  const p = info.params
  if (p.kind === 'molar') {
    const branches = info.jaw === 'upper' ? UPPER_MOLAR_BRANCHES : LOWER_MOLAR_BRANCHES
    return { branches, furcation: -p.rootLength * 0.3, grooveAngles: furcationGrooves(branches), grooveDepth: 0.18 }
  }
  if (p.kind === 'premolar') {
    return { branches: [], furcation: -p.rootLength, grooveAngles: [Math.PI / 2, -Math.PI / 2], grooveDepth: 0.1 }
  }
  return { branches: [], furcation: -p.rootLength, grooveAngles: [], grooveDepth: 0 }
}

const angularGap = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b))

function carveRootGrooves(geometry: THREE.BufferGeometry, plan: RootPlan, p: ToothParams) {
  if (plan.grooveAngles.length === 0) return geometry
  const fullDepthAt = plan.branches.length > 0 ? plan.furcation : -p.rootLength * 0.2
  return transformPositions(geometry, (vertex) => {
    if (vertex.y >= 0 || Math.hypot(vertex.x, vertex.z) < 1e-5) return
    const angle = Math.atan2(vertex.x, vertex.z)
    const groove = Math.max(...plan.grooveAngles.map((target) => Math.exp(-(angularGap(angle, target) ** 2) / GROOVE_SPREAD)))
    const scale = 1 - plan.grooveDepth * groove * smoothstep(0, fullDepthAt, vertex.y)
    vertex.x *= scale
    vertex.z *= scale
  })
}

function branchCenter(plan: RootPlan, root: RootBranch, trunkRadius: number, y: number, out: THREE.Vector2) {
  const start = plan.furcation + ROOT_OVERLAP
  const distance = root.offset * trunkRadius + Math.tan(root.splay) * Math.max(0, start - y)
  return out.copy(root.direction).multiplyScalar(distance)
}

function buildBranch(plan: RootPlan, root: RootBranch, p: ToothParams, spec: BranchSpec, rows: number, segments: number) {
  const trunkRadius = outerRadius(plan.furcation, p)
  const start = plan.furcation + ROOT_OVERLAP
  const span = start - spec.apexY
  const radiusAt = (y: number) => trunkRadius * spec.scale * (1 - 0.82 * Math.pow(clamp01((start - y) / span), 1.5))
  const alongScale = root.along
  const acrossScale = spec.uniform ? root.along : root.across
  const center = new THREE.Vector2()
  const { x: dx, y: dz } = root.direction
  return transformPositions(buildLathe(radiusAt, spec.apexY, start, rows, segments), (vertex) => {
    const radial = Math.hypot(vertex.x, vertex.z)
    const unitX = radial > 1e-6 ? vertex.x / radial : 0
    const unitZ = radial > 1e-6 ? vertex.z / radial : 0
    const along = unitX * (radial * alongScale + spec.inflate)
    const across = unitZ * (radial * acrossScale + spec.inflate)
    branchCenter(plan, root, trunkRadius, vertex.y, center)
    vertex.x = center.x + along * dx - across * dz
    vertex.z = center.y + along * dz + across * dx
  })
}

export function buildRootedShell(plan: RootPlan, p: ToothParams, spec: ShellSpec) {
  const multiRooted = plan.branches.length > 0
  const bottom = multiRooted ? spec.trunkBottom : spec.singleBottom
  const trunk = buildLathe(spec.radiusAt, bottom, spec.top, spec.rows, spec.segments, spec.capTop)
  if (spec.carveGrooves) carveRootGrooves(trunk, plan, p)
  if (!multiRooted) return trunk
  const branchRows = Math.max(10, Math.round(spec.rows * 0.45))
  const branchSegments = Math.max(10, Math.round(spec.segments * 0.6))
  const roots = plan.branches.map((root) => buildBranch(plan, root, p, spec.branch, branchRows, branchSegments))
  return mergeGeometries([trunk, ...roots]) ?? trunk
}

export function buildVessels(plan: RootPlan, p: ToothParams) {
  const trunkRadius = outerRadius(plan.furcation, p)
  const start = plan.furcation + ROOT_OVERLAP
  const center = new THREE.Vector2()
  return [-0.03, 0, 0.03].map((offset, k) => {
    const root = plan.branches.length > 0 ? plan.branches[k % plan.branches.length] : null
    const points: THREE.Vector3[] = []
    for (let s = 0; s <= 14; s++) {
      const t = s / 14
      const y = -p.rootLength * 0.9 + (p.crownHeight * 0.42 + p.rootLength * 0.9) * t
      const narrow = y < 0 ? 1 - 0.75 * (-y / p.rootLength) : 1
      if (root) branchCenter(plan, root, trunkRadius, y, center).multiplyScalar(1 - smoothstep(start - 0.05, start + 0.2, y))
      else center.set(0, 0)
      const spread = root ? 0.4 : 1
      points.push(
        new THREE.Vector3(
          (center.x + offset * narrow * 1.3 * spread) * p.width + Math.sin(t * 9 + k * 2) * 0.006,
          y,
          center.y * p.depth + (k - 1) * 0.012 * narrow * spread,
        ),
      )
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, k === 1 ? 0.012 : 0.0095, 6)
  })
}
