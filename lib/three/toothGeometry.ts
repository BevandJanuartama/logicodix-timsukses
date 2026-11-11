import * as THREE from 'three'
import type { ToothInfo, ToothParams } from '@/lib/three/layout'
import { seededRandom } from '@/lib/three/math'
import { cejHeightAt } from '@/lib/three/cejContour'
import { applyToothDeform, deformToothVertex } from '@/lib/three/crownMorphology'
import {
  DENTIN_CROWN_RATIO,
  PULP_CROWN_RATIO,
  PULP_ROOT_RATIO,
  dentinRadius,
  outerRadius,
  pulpRadius,
} from '@/lib/three/toothProfiles'
import { FURCATION_ROOF, buildRootedShell, buildVessels, rootPlanFor } from '@/lib/three/toothRoots'

export { outerRadius }

const PDL_THICKNESS = 0.028
const PDL_CREST = -0.1

export const CHIP_DIRECTION = new THREE.Vector3(Math.SQRT1_2, Math.SQRT1_2, 0)

export type Detail = 'low' | 'high'

const DETAIL_LEVELS: Record<Detail, { rows: number; segments: number }> = {
  low: { rows: 28, segments: 18 },
  high: { rows: 84, segments: 56 },
}

export interface InnerGeometry {
  dentin: THREE.BufferGeometry
  pulp: THREE.BufferGeometry
  vessels: THREE.BufferGeometry[]
}

export interface SupportGeometry {
  ligament: THREE.BufferGeometry
  junction: THREE.BufferGeometry
}

const outerCache = new Map<string, THREE.BufferGeometry>()
const innerCache = new Map<string, InnerGeometry>()
const supportCache = new Map<string, SupportGeometry>()

export function getOuterGeometry(info: ToothInfo, detail: Detail) {
  const key = `${info.id}-${detail}`
  const cached = outerCache.get(key)
  if (cached) return cached
  const p = info.params
  const plan = rootPlanFor(info)
  const { rows, segments } = DETAIL_LEVELS[detail]
  const shell = buildRootedShell(plan, p, {
    radiusAt: (y) => outerRadius(y, p),
    top: p.crownHeight,
    singleBottom: -p.rootLength,
    trunkBottom: plan.furcation - FURCATION_ROOF,
    capTop: true,
    rows,
    segments,
    carveGrooves: true,
    branch: { scale: 1, inflate: 0, apexY: -p.rootLength, uniform: false },
  })
  const geometry = applyToothDeform(shell, p, p.crownHeight, true)
  const position = geometry.attributes.position as THREE.BufferAttribute
  let crownTop = 0
  let chipReach = -Infinity
  for (let i = 0; i < position.count; i++) {
    crownTop = Math.max(crownTop, position.getY(i))
    chipReach = Math.max(chipReach, position.getX(i) * CHIP_DIRECTION.x + position.getY(i) * CHIP_DIRECTION.y)
  }
  geometry.userData = { crownTop, chipReach }
  outerCache.set(key, geometry)
  return geometry
}

export function getInnerGeometry(info: ToothInfo) {
  const cached = innerCache.get(info.id)
  if (cached) return cached
  const p = info.params
  const plan = rootPlanFor(info)
  const dentinTop = p.crownHeight * DENTIN_CROWN_RATIO
  const pulpTop = p.crownHeight * PULP_CROWN_RATIO
  const dentin = buildRootedShell(plan, p, {
    radiusAt: (y) => dentinRadius(y, p),
    top: dentinTop,
    singleBottom: -p.rootLength * 0.995,
    trunkBottom: plan.furcation - FURCATION_ROOF * 0.5,
    capTop: true,
    rows: 52,
    segments: 36,
    carveGrooves: true,
    branch: { scale: 0.93, inflate: 0, apexY: -p.rootLength * 0.995, uniform: false },
  })
  const pulp = buildRootedShell(plan, p, {
    radiusAt: (y) => pulpRadius(y, p),
    top: pulpTop,
    singleBottom: -p.rootLength * PULP_ROOT_RATIO,
    trunkBottom: plan.furcation + 0.06,
    capTop: true,
    rows: 44,
    segments: 24,
    carveGrooves: false,
    branch: { scale: 0.3, inflate: 0, apexY: -p.rootLength * PULP_ROOT_RATIO, uniform: true },
  })
  const inner = {
    dentin: applyToothDeform(dentin, p, dentinTop, true),
    pulp: applyToothDeform(pulp, p, pulpTop, false),
    vessels: buildVessels(plan, p),
  }
  innerCache.set(info.id, inner)
  return inner
}

export function getSupportGeometry(info: ToothInfo) {
  const cached = supportCache.get(info.id)
  if (cached) return cached
  const p = info.params
  const plan = rootPlanFor(info)
  const ligament = buildRootedShell(plan, p, {
    radiusAt: (y) => outerRadius(Math.max(y, -p.rootLength), p) + PDL_THICKNESS,
    top: PDL_CREST,
    singleBottom: -p.rootLength - PDL_THICKNESS,
    trunkBottom: plan.furcation - FURCATION_ROOF - PDL_THICKNESS,
    capTop: false,
    rows: 30,
    segments: 24,
    carveGrooves: true,
    branch: { scale: 1, inflate: PDL_THICKNESS, apexY: -p.rootLength - PDL_THICKNESS, uniform: false },
  })
  const support = {
    ligament: applyToothDeform(ligament, p, p.crownHeight, false),
    junction: buildJunction(p),
  }
  supportCache.set(info.id, support)
  return support
}

function buildJunction(p: ToothParams) {
  const points: THREE.Vector3[] = []
  const normal = new THREE.Vector3()
  for (let i = 0; i < 48; i++) {
    const phi = (i / 48) * Math.PI * 2
    const cervicalY = cejHeightAt(p.kind, phi)
    const point = surfacePoint(p, phi, cervicalY)
    surfaceNormal(p, phi, cervicalY, normal)
    points.push(point.addScaledVector(normal, 0.006))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), 96, 0.014, 6, true)
}

export function surfacePoint(p: ToothParams, phi: number, y: number, out = new THREE.Vector3()) {
  const radius = outerRadius(y, p)
  return deformToothVertex(radius * Math.sin(phi), y, radius * Math.cos(phi), p, p.crownHeight, true, out)
}

export function surfaceNormal(p: ToothParams, phi: number, y: number, out = new THREE.Vector3()) {
  const step = 0.02
  const tangentPhi = surfacePoint(p, phi + step, y).sub(surfacePoint(p, phi - step, y))
  const tangentY = surfacePoint(p, phi, y + step).sub(surfacePoint(p, phi, y - step))
  out.crossVectors(tangentPhi, tangentY).normalize()
  const center = surfacePoint(p, phi, y)
  if (out.x * center.x + out.z * center.z < 0) out.negate()
  return out
}

export function buildCracks(p: ToothParams, seed: number) {
  const random = seededRandom(seed * 7919)
  const count = p.kind === 'incisor' ? 3 : 2
  const normal = new THREE.Vector3()
  return Array.from({ length: count }, () => {
    let phi = (random() - 0.5) * 0.9
    const yStart = p.crownHeight * (0.9 - random() * 0.06)
    const yEnd = p.crownHeight * (0.12 + random() * 0.28)
    const points: THREE.Vector3[] = []
    for (let step = 0; step <= 10; step++) {
      const y = yStart + ((yEnd - yStart) * step) / 10
      phi += (random() - 0.5) * 0.16
      surfaceNormal(p, phi, y, normal)
      points.push(surfacePoint(p, phi, y).addScaledVector(normal, 0.007))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 30, 0.0065, 4)
  })
}
