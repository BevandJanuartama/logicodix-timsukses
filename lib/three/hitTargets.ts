import * as THREE from 'three'
import { toothSide } from '@/lib/data/dentition'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import type { LayerVisibility } from '@/lib/store'
import { getLayouts } from '@/lib/three/layout'
import type { OralRegionId, SceneTargetId } from '@/lib/types'

export type MeshKind =
  | 'tooth'
  | 'dentin'
  | 'pulp'
  | 'vessel'
  | 'ligament'
  | 'junction'
  | 'gum'
  | 'papilla'
  | 'bone'
  | 'palate'
  | 'floor'
  | 'tongue'

export interface MeshTag {
  kind: MeshKind
  toothId?: string
}

export interface SceneHit {
  key: string
  label: string
  toothId: string | null
  objectId: SceneTargetId
  kind: MeshKind
}

const localPoint = new THREE.Vector3()

function tongueRegion(local: THREE.Vector3): OralRegionId {
  if (local.z > 0.62) return 'tongue_tip'
  if (local.z < -0.45) return 'tongue_base'
  if (Math.abs(local.x) > 0.62) return 'tongue_lateral'
  return 'tongue_dorsum'
}

const TISSUE_TARGETS: Partial<Record<MeshKind, SceneTargetId>> = {
  gum: 'gingiva',
  papilla: 'interdental_papilla',
  bone: 'alveolar_bone',
  palate: 'palate',
  floor: 'mouth_floor',
}

function toothLayerAt(kind: MeshKind, isCrown: boolean, layers: LayerVisibility): SceneTargetId | null {
  switch (kind) {
    case 'tooth': {
      const layer = isCrown ? 'enamel' : 'cementum'
      return layers[layer] ? layer : null
    }
    case 'pulp': {
      const layer = isCrown ? 'pulp_chamber' : 'root_canal'
      return layers[layer] ? layer : null
    }
    case 'dentin':
      return 'dentin'
    case 'vessel':
      return 'pulp'
    case 'ligament':
      return 'pd_ligament'
    case 'junction':
      return 'cej'
    default:
      return null
  }
}

export function resolveHit(
  object: THREE.Object3D,
  point: THREE.Vector3,
  layers: LayerVisibility,
  selectedToothId: string | null,
): SceneHit | null {
  const tag = object.userData as Partial<MeshTag>
  if (!tag.kind) return null
  object.worldToLocal(localPoint.copy(point))

  if (tag.toothId) {
    const info = getLayouts().byId.get(tag.toothId)
    if (!info) return null
    const layer = toothLayerAt(tag.kind, localPoint.y >= 0, layers)
    if (!layer) return null
    const isSelected = selectedToothId === info.id
    return {
      key: `${info.id}-${isSelected ? layer : 'tooth'}`,
      label: isSelected ? `${sceneTargetLabels[layer]} · ${info.name.toLowerCase()}` : `${info.name} ${toothSide(info)}`,
      toothId: info.id,
      objectId: layer,
      kind: tag.kind,
    }
  }

  const objectId = tag.kind === 'tongue' ? tongueRegion(localPoint) : TISSUE_TARGETS[tag.kind]
  if (!objectId) return null
  return { key: objectId, label: sceneTargetLabels[objectId], toothId: null, objectId, kind: tag.kind }
}
