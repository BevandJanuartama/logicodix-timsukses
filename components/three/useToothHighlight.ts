'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import type { ToothMaterials } from '@/lib/three/toothMaterial'
import type { SceneTargetId } from '@/lib/types'

const HOVER_GLOW = 0.3
const VESSEL_BASE_GLOW = 0.25
const SELECTED_RIM_GLOW = 1.4
const EPSILON = 0.001

const approach = (current: number, target: number, rate: number) =>
  Math.abs(current - target) < EPSILON ? target : current + (target - current) * rate

export function useToothHighlight(toothId: string, materials: ToothMaterials) {
  return useCallback(
    (elapsed: number, delta: number) => {
      const { mode, selectedToothId, selectedObjectId, hover } = useAppStore.getState()
      const isSelected = selectedToothId === toothId
      const isHovered = hover?.toothId === toothId
      const outerBand = materials.uniforms.outer.uHighlightBand.value
      const rim = materials.uniforms.outer.uRimGlow
      const dentinBand = materials.uniforms.dentin.uHighlightBand.value
      const pulpBand = materials.uniforms.pulp.uHighlightBand.value

      if (
        !isSelected &&
        !isHovered &&
        outerBand.x === 0 &&
        outerBand.y === 0 &&
        rim.value === 0 &&
        dentinBand.x === 0 &&
        pulpBand.x === 0 &&
        pulpBand.y === 0 &&
        materials.ligament.emissiveIntensity === 0 &&
        materials.junction.emissiveIntensity === 0
      ) {
        return
      }

      const rimMode = mode === 'explore' || mode === 'diseases'
      const pulse = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(elapsed * 3.2))
      const focus = (...targets: (SceneTargetId | null)[]) => (isSelected && targets.includes(selectedObjectId) ? pulse : 0)
      const rate = Math.min(1, delta * 10)
      const hoverGlow = isHovered ? HOVER_GLOW : 0
      const wholeToothPulse = rimMode ? 0 : focus(null)

      outerBand.set(
        approach(outerBand.x, hoverGlow + focus('enamel') + wholeToothPulse, rate),
        approach(outerBand.y, hoverGlow + focus('cementum') + wholeToothPulse, rate),
      )

      rim.value = approach(rim.value, isSelected && rimMode ? SELECTED_RIM_GLOW : 0, rate)

      const dentinGlow = approach(dentinBand.x, focus('dentin'), rate)
      dentinBand.set(dentinGlow, dentinGlow)

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
