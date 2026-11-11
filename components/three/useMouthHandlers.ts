'use client'

import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useCleaningStore } from '@/lib/cleaningStore'
import { useAppStore } from '@/lib/store'
import { applyTool, cleaningState } from '@/lib/three/cleaning'
import { resolveHit } from '@/lib/three/hitTargets'
import { sceneRegistry } from '@/lib/three/registry'

const CLICK_DRAG_TOLERANCE = 8
const SECONDARY_BUTTON = 2

const prefersTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

const isCleaning = () => useAppStore.getState().mode === 'clean'

function hitFromEvent(event: ThreeEvent<PointerEvent | MouseEvent>) {
  const state = useAppStore.getState()
  return resolveHit(event.object, event.point, state.layers, state.selectedToothId)
}

const surfaceNormal = new THREE.Vector3()
const lastToolPoint = new THREE.Vector3()

function trackTool(event: ThreeEvent<PointerEvent>) {
  cleaningState.toolPoint.copy(event.point)
  if (event.face) {
    surfaceNormal.copy(event.face.normal).transformDirection(event.object.matrixWorld)
    if (surfaceNormal.dot(event.ray.direction) > 0) surfaceNormal.negate()
    cleaningState.toolNormal.lerp(surfaceNormal, 0.5).normalize()
  }
  cleaningState.toolVisible = true
  if (!cleaningState.pressed) return
  const movement = cleaningState.lastPoint ? Math.min(0.3, event.point.distanceTo(cleaningState.lastPoint)) : 0
  cleaningState.lastPoint = lastToolPoint.copy(event.point)
  cleaningState.scrub = Math.min(1, cleaningState.scrub + movement * 6)
  const store = useCleaningStore.getState()
  const hitKind = (event.object.userData as { kind?: string }).kind ?? ''
  applyTool(store.tool, event.point, movement, hitKind, sceneRegistry.jaws)
  store.markStarted()
}

export function useMouthHandlers() {
  return {
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      if (isCleaning()) {
        event.stopPropagation()
        trackTool(event)
        return
      }
      if (prefersTouch()) return
      const hit = hitFromEvent(event)
      if (!hit) return
      event.stopPropagation()
      const { hover, setHover } = useAppStore.getState()
      if (hover?.key !== hit.key) setHover({ key: hit.key, label: hit.label, toothId: hit.toothId })
    },
    onPointerOut: () => {
      const { hover, setHover } = useAppStore.getState()
      if (hover) setHover(null)
      if (isCleaning() && !cleaningState.pressed) cleaningState.toolVisible = false
    },
    onPointerDown: (event: ThreeEvent<PointerEvent>) => {
      if (!isCleaning() || event.nativeEvent.button === SECONDARY_BUTTON) return
      event.stopPropagation()
      cleaningState.pressed = true
      cleaningState.lastPoint = null
      trackTool(event)
    },
    onClick: (event: ThreeEvent<MouseEvent>) => {
      if (isCleaning() || event.delta > CLICK_DRAG_TOLERANCE) return
      const hit = hitFromEvent(event)
      if (!hit) return
      event.stopPropagation()
      const state = useAppStore.getState()
      if (hit.toothId) {
        if (state.selectedToothId !== hit.toothId) {
          state.selectTarget(hit.toothId, null)
          state.requestCamera({ kind: 'tooth', toothId: hit.toothId })
        } else {
          state.selectTarget(hit.toothId, hit.objectId)
        }
        return
      }
      const keepsSection = (hit.kind === 'bone' || hit.kind === 'gum') && (state.cutaway || state.lod === 'micro')
      state.selectTarget(keepsSection ? state.selectedToothId : null, hit.objectId)
    },
  }
}

export function bindGlobalToolRelease() {
  const release = (event: PointerEvent) => {
    cleaningState.pressed = false
    cleaningState.lastPoint = null
    if (event.pointerType === 'touch') cleaningState.toolVisible = false
  }
  window.addEventListener('pointerup', release)
  window.addEventListener('pointercancel', release)
  return () => {
    window.removeEventListener('pointerup', release)
    window.removeEventListener('pointercancel', release)
  }
}
