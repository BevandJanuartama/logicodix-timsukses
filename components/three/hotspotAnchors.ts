import * as THREE from 'three'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { diseases } from '@/lib/data/diseases'
import type { SceneFocus } from '@/lib/sceneFocus'
import { getLayouts } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import { severityOf, type SeverityLevel } from '@/components/ui/diseases/diseaseSeverity'

export type HotspotTone = 'coral' | SeverityLevel

export type HotspotAnchor = { kind: 'tooth'; toothId: string } | { kind: 'gum' } | { kind: 'tongue' }

export interface HotspotSpec {
  id: string
  label: string
  ariaLabel: string
  tone: HotspotTone
  anchor: HotspotAnchor
  focus: SceneFocus
}

const GUM_ANCHOR_TOOTH = '31'
const CROWN_RISE = 0.62
const SURFACE_CLEARANCE = 0.16
const GUM_DROP = 0.35
const GUM_CLEARANCE = 0.78
const TONGUE_DORSUM_Y = 0.4
const TONGUE_FORWARD = 0.2

export const ANATOMY_HOTSPOTS: HotspotSpec[] = [
  {
    id: '11',
    label: 'Gigi seri',
    ariaLabel: 'Lihat gigi seri, gigi depan untuk menggigit',
    tone: 'coral',
    anchor: { kind: 'tooth', toothId: '11' },
    focus: { toothId: '11' },
  },
  {
    id: '13',
    label: 'Taring',
    ariaLabel: 'Lihat gigi taring, gigi runcing untuk merobek',
    tone: 'coral',
    anchor: { kind: 'tooth', toothId: '13' },
    focus: { toothId: '13' },
  },
  {
    id: '24',
    label: 'Geraham kecil',
    ariaLabel: 'Lihat geraham kecil',
    tone: 'coral',
    anchor: { kind: 'tooth', toothId: '24' },
    focus: { toothId: '24' },
  },
  {
    id: '36',
    label: 'Geraham',
    ariaLabel: 'Lihat geraham, gigi besar untuk mengunyah',
    tone: 'coral',
    anchor: { kind: 'tooth', toothId: '36' },
    focus: { toothId: '36' },
  },
  {
    id: 'gingiva',
    label: 'Gusi',
    ariaLabel: 'Lihat gusi',
    tone: 'coral',
    anchor: { kind: 'gum' },
    focus: { objectId: 'gingiva', preset: 'front' },
  },
  {
    id: 'tongue_dorsum',
    label: 'Lidah',
    ariaLabel: 'Lihat lidah',
    tone: 'coral',
    anchor: { kind: 'tongue' },
    focus: { objectId: 'tongue_dorsum', preset: 'top' },
  },
]

export function diseaseHotspot(diseaseId: string): HotspotSpec | null {
  const link = diseaseLinks[diseaseId]
  const disease = diseases.find((entry) => entry.id === diseaseId)
  if (!link || !disease) return null
  const { toothId, objectId } = link.focus
  const anchor: HotspotAnchor | null = toothId ? { kind: 'tooth', toothId } : objectId === 'gingiva' ? { kind: 'gum' } : null
  if (!anchor) return null
  return {
    id: diseaseId,
    label: disease.displayName,
    ariaLabel: `Lihat bagian yang terkena ${disease.displayName.toLowerCase()}`,
    tone: severityOf(diseaseId),
    anchor,
    focus: link.focus,
  }
}

export interface ResolvedAnchor {
  source: THREE.Object3D
  local: THREE.Vector3
  localNormal: THREE.Vector3
  minCosine: number
}

function toothAnchor(
  toothId: string,
  offset: (crownHeight: number, depth: number) => [number, number],
  minCosine = -0.1,
): ResolvedAnchor | null {
  const source = sceneRegistry.teeth.get(toothId)
  const info = getLayouts().byId.get(toothId)
  if (!source || !info) return null
  const [rise, clearance] = offset(info.params.crownHeight, info.params.depth)
  return {
    source,
    local: new THREE.Vector3(0, rise, clearance),
    localNormal: new THREE.Vector3(0, 0.18, 1).normalize(),
    minCosine,
  }
}

function tongueAnchor(): ResolvedAnchor | null {
  const source = sceneRegistry.jaws.lower
  if (!source) return null
  const { zFront, zBack } = getLayouts().lower.inner
  const centerZ = (zFront + zBack) / 2
  const halfDepth = (zFront - zBack) / 2 + 0.1
  return {
    source,
    local: new THREE.Vector3(0, TONGUE_DORSUM_Y, centerZ - 0.12 + TONGUE_FORWARD * halfDepth * 0.98),
    localNormal: new THREE.Vector3(0, 0.86, 0.5).normalize(),
    minCosine: 0.08,
  }
}

export function resolveAnchor(anchor: HotspotAnchor): ResolvedAnchor | null {
  switch (anchor.kind) {
    case 'tooth':
      return toothAnchor(anchor.toothId, (crown, depth) => [crown * CROWN_RISE, depth * 0.5 + SURFACE_CLEARANCE])
    case 'gum':
      return toothAnchor(GUM_ANCHOR_TOOTH, () => [-GUM_DROP, GUM_CLEARANCE], -0.05)
    case 'tongue':
      return tongueAnchor()
  }
}
