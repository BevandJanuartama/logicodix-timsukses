import * as THREE from 'three'
import type { SimulationTrack } from '@/lib/simulatorStore'
import type { ToothInfo } from '@/lib/three/layout'
import { clamp01, hash01, smoothstep } from '@/lib/three/math'
import { CHIP_DIRECTION } from '@/lib/three/toothGeometry'

export interface ToothEffects {
  flatNormal: THREE.Vector3
  flatDistance: number
  flatExposure: number
  decay: number
  decayCenter: THREE.Vector3
  decayRadius: number
  decayDepth: number
  stain: number
  inflammation: number
  crack: number
}

export interface CrownMetrics {
  crownTop: number
  chipReach: number
}

const UP = new THREE.Vector3(0, 1, 0)
const CARIES_FOCUS_TEETH = new Set(['36', '46'])

export const createToothEffects = (): ToothEffects => ({
  flatNormal: new THREE.Vector3(0, 1, 0),
  flatDistance: 99,
  flatExposure: 0,
  decay: 0,
  decayCenter: new THREE.Vector3(0, 99, 0),
  decayRadius: 0.2,
  decayDepth: 0,
  stain: 0,
  inflammation: 0,
  crack: 0,
})

function resetEffects(out: ToothEffects) {
  out.flatNormal.copy(UP)
  out.flatDistance = 99
  out.flatExposure = 0
  out.decay = 0
  out.decayDepth = 0
  out.stain = 0
  out.inflammation = 0
  out.crack = 0
}

function applyClinicalCaries(out: ToothEffects, progress: number, info: ToothInfo) {
  if (!CARIES_FOCUS_TEETH.has(info.id)) return
  out.decay = clamp01(progress * 1.05)
  out.decayCenter.set(0, info.params.crownHeight * 0.9, 0)
  out.decayRadius = 0.36 * info.params.width
  out.decayDepth = 0.19
  out.inflammation = 0.55 * smoothstep(0.75, 1, progress)
}

function applyIce(out: ToothEffects, progress: number, info: ToothInfo, crown: CrownMetrics, delay: number) {
  if (info.index <= 4) out.crack = smoothstep(0.12 + delay * 0.8, 0.85 + delay * 0.3, progress)
  if (info.fdi !== 11 && info.fdi !== 31) return
  const chip = smoothstep(0.62, 0.92, progress) * (info.fdi === 11 ? 1 : 0.6)
  if (chip <= 0) return
  out.flatNormal.copy(CHIP_DIRECTION)
  out.flatDistance = crown.chipReach - 0.17 * chip
  out.flatExposure = 0.3 * chip
}

function applyBruxism(out: ToothEffects, progress: number, info: ToothInfo, crown: CrownMetrics, delay: number) {
  const maxWear = { molar: 0.2, premolar: 0.19, canine: 0.3, incisor: 0.22 }[info.params.kind]
  out.flatDistance = crown.crownTop - maxWear * smoothstep(0.04, 1, progress) * (0.85 + 0.6 * delay)
  out.flatExposure = smoothstep(0.35, 0.8, progress)
}

function applyBoba(out: ToothEffects, progress: number, info: ToothInfo, delay: number) {
  const { kind, width, depth, crownHeight } = info.params
  if (kind === 'molar' && info.index <= 7) {
    out.decay = clamp01((progress - 0.04 - delay * 0.5) / 0.78)
    out.decayCenter.set(0, crownHeight * 0.9, 0)
    out.decayRadius = 0.36 * width
    out.decayDepth = 0.17
    if (info.index === 6) out.inflammation = smoothstep(0.72, 1.0, out.decay)
  } else if (kind === 'premolar' && info.index === 5) {
    out.decay = clamp01((progress - 0.2 - delay * 0.5) / 0.75)
    out.decayCenter.set(-width * 0.48, crownHeight * 0.55, 0)
    out.decayRadius = 0.24
    out.decayDepth = 0.1
  } else if (kind === 'incisor' && info.index === 1) {
    out.decay = 0.32 * smoothstep(0.1, 0.7, progress)
    out.decayCenter.set(0, 0.24, depth * 0.42)
    out.decayRadius = 0.2
  }
}

function applyNeglect(out: ToothEffects, progress: number, info: ToothInfo, delay: number) {
  out.stain = smoothstep(0.05, 0.9, progress) * (0.75 + 0.35 * delay) * (info.index <= 3 ? 1.1 : 0.9)
  if (info.params.kind !== 'molar' || info.index !== 6) return
  out.decay = 0.45 * smoothstep(0.55, 1, progress)
  out.decayCenter.set(0, 0.22, info.params.depth * 0.45)
  out.decayRadius = 0.22
  out.decayDepth = 0.04
}

export function computeToothEffects(
  out: ToothEffects,
  track: SimulationTrack | null,
  progress: number,
  info: ToothInfo,
  crown: CrownMetrics,
) {
  resetEffects(out)
  const delay = hash01(info.fdi) * 0.25
  switch (track) {
    case 'DIS-001':
      applyClinicalCaries(out, progress, info)
      break
    case 'ice':
      applyIce(out, progress, info, crown, delay)
      break
    case 'bruxism':
      applyBruxism(out, progress, info, crown, delay)
      break
    case 'boba':
      applyBoba(out, progress, info, delay)
      break
    case 'neglect':
      applyNeglect(out, progress, info, delay)
      break
  }
  return out
}

export interface PeriodontalState {
  swelling: number
  recession: number
  boneLoss: number
  inflammation: number
  tongueCoat: number
}

export function computePeriodontalState(track: SimulationTrack | null, progress: number): PeriodontalState {
  if (track === 'DIS-003') {
    return {
      swelling: smoothstep(0.1, 0.5, progress) * (1 - smoothstep(0.6, 0.95, progress)),
      recession: 0.2 * smoothstep(0.55, 1, progress),
      boneLoss: 0.24 * smoothstep(0.55, 1, progress),
      inflammation: smoothstep(0.15, 0.5, progress),
      tongueCoat: 0,
    }
  }
  if (track === 'neglect') {
    return {
      swelling: smoothstep(0.25, 0.5, progress) * (1 - smoothstep(0.6, 0.9, progress)),
      recession: 0.2 * smoothstep(0.55, 1, progress),
      boneLoss: 0.18 * smoothstep(0.65, 1, progress),
      inflammation: smoothstep(0.3, 0.6, progress),
      tongueCoat: smoothstep(0.1, 0.7, progress) * 0.6,
    }
  }
  return { swelling: 0, recession: 0, boneLoss: 0, inflammation: 0, tongueCoat: 0 }
}
