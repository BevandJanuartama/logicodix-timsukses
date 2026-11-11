'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import type { Jaw } from '@/lib/three/layout'
import type { SceneTargetId } from '@/lib/types'

const HIGHLIGHT = new THREE.Color('#0c8fa8')

interface TissueLook {
  color: string
  roughness: number
  emissive?: string
  emissiveIntensity?: number
  doubleSided?: boolean
}

function createTissueMaterial(look: TissueLook) {
  const material = new THREE.MeshStandardMaterial({
    color: look.color,
    roughness: look.roughness,
    side: look.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
  })
  const baseEmissive = new THREE.Color(look.emissive ?? '#000000').multiplyScalar(look.emissiveIntensity ?? 0)
  material.emissive.copy(baseEmissive)
  material.userData.baseEmissive = baseEmissive
  return material
}

const GUM: TissueLook = { color: '#ec8f9b', roughness: 0.48, emissive: '#5a0d1a', emissiveIntensity: 0.22, doubleSided: true }
const BONE: TissueLook = { color: '#efe5cf', roughness: 0.9, doubleSided: true }

export function useTissueMaterials() {
  const materials = useMemo(() => {
    const tissues = {
      gum: { upper: createTissueMaterial(GUM), lower: createTissueMaterial(GUM) } as Record<Jaw, THREE.MeshStandardMaterial>,
      bone: { upper: createTissueMaterial(BONE), lower: createTissueMaterial(BONE) } as Record<Jaw, THREE.MeshStandardMaterial>,
      palate: createTissueMaterial({ color: '#e9919b', roughness: 0.55, doubleSided: true }),
      floor: createTissueMaterial({ color: '#c96a78', roughness: 0.6, doubleSided: true }),
      tongue: createTissueMaterial({ color: '#e27482', roughness: 0.7, emissive: '#3a0a12', emissiveIntensity: 0.15 }),
      papilla: createTissueMaterial({ color: '#ef97a3', roughness: 0.5 }),
    }
    const highlightGroups: [SceneTargetId[], THREE.MeshStandardMaterial[]][] = [
      [['gingiva'], [tissues.gum.upper, tissues.gum.lower]],
      [['alveolar_bone'], [tissues.bone.upper, tissues.bone.lower]],
      [['palate'], [tissues.palate]],
      [['mouth_floor'], [tissues.floor]],
      [['interdental_papilla'], [tissues.papilla]],
      [['tongue_tip', 'tongue_dorsum', 'tongue_lateral', 'tongue_base'], [tissues.tongue]],
    ]
    return { ...tissues, highlightGroups }
  }, [])

  useEffect(
    () => () => {
      for (const [, group] of materials.highlightGroups) for (const material of group) material.dispose()
    },
    [materials],
  )

  return materials
}

export type TissueMaterials = ReturnType<typeof useTissueMaterials>

const blended = new THREE.Color()

export function animateTissueHighlight(materials: TissueMaterials, elapsed: number, delta: number) {
  const { selectedObjectId, hover } = useAppStore.getState()
  const pulse = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(elapsed * 3.2))
  const rate = Math.min(1, delta * 10)
  for (const [targets, group] of materials.highlightGroups) {
    const selected = selectedObjectId !== null && targets.includes(selectedObjectId)
    const hovered = hover !== null && hover.toothId === null && targets.some((target) => target === hover.key)
    const amount = selected ? pulse : hovered ? 0.16 : 0
    for (const material of group) {
      const current = material.userData.highlight ?? 0
      const next = current + (amount - current) * rate
      material.userData.highlight = next
      blended.copy(material.userData.baseEmissive as THREE.Color).lerp(HIGHLIGHT, next)
      material.emissive.copy(blended)
    }
  }
}
