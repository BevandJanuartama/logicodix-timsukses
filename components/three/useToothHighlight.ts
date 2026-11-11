'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import type { ToothMaterials } from '@/lib/three/toothMaterial'
import type { SceneTargetId } from '@/lib/types'

const HOVER_GLOW = 0.3
const VESSEL_BASE_GLOW = 0.25

const approach = (current: number, target: number, rate: number) => current + (target - current) * rate

export function useToothHighlight(toothId: string, materials: ToothMaterials) {
  return useCallback(
    (elapsed: number, delta: number) => {
      const { selectedToothId, selectedObjectId, hover } = useAppStore.getState()
      const isSelected = selectedToothId === toothId
      const isHovered = hover?.toothId === toothId
      const pulse = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(elapsed * 3.2))
      const focus = (...targets: (SceneTargetId | null)[]) => (isSelected && targets.includes(selectedObjectId) ? pulse : 0)
      const rate = Math.min(1, delta * 10)
      const hoverGlow = isHovered ? HOVER_GLOW : 0

      const outerBand = materials.uniforms.outer.uHighlightBand.value
      outerBand.set(
        approach(outerBand.x, hoverGlow + focus(null, 'enamel'), rate),
        approach(outerBand.y, hoverGlow + focus(null, 'cementum'), rate),
      )

      const dentinBand = materials.uniforms.dentin.uHighlightBand.value
      const dentinGlow = approach(dentinBand.x, focus('dentin'), rate)
      dentinBand.set(dentinGlow, dentinGlow)

      const pulpBand = materials.uniforms.pulp.uHighlightBand.value
      pulpBand.set(
        approach(pulpBand.x, focus('pulp_chamber', 'pulp'), rate),
        approach(pulpBand.y, focus('root_canal', 'pulp'), rate),
      )

      for (const vessel of materials.vessels) {
        vessel.emissiveIntensity = approach(vessel.emissiveIntensity, VESSEL_BASE_GLOW + focus('pulp') * 2, rate)
      }
      materials.ligament.emissiveIntensity = approach(materials.ligament.emissiveIntensity, focus('pd_ligament') * 2.4, rate)
      materials.junction.emissiveIntensity = approach(materials.junction.emissiveIntensity, focus('cej') * 3, rate)
    },
    [toothId, materials],
  )
}
