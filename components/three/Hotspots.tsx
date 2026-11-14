'use client'

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import { activeComparison, jawSectionOn, renderedDentition, useAppStore } from '@/lib/store'
import {
  ANATOMY_HOTSPOTS,
  diseaseHotspot,
  resolveAnchor,
  type HotspotSpec,
  type HotspotTone,
  type ResolvedAnchor,
} from './hotspotAnchors'

const MAX_VISIBLE_HOTSPOTS = 8
const HOTSPOT_Z_RANGE = [10, 0]
const BREATH_DURATION = 2400
const BREATH_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)'

const TONE_CLASS: Record<HotspotTone, { dot: string; ring: string }> = {
  brand: { dot: 'bg-accent-mark', ring: 'border-accent-mark' },
  mild: { dot: 'bg-success', ring: 'border-success' },
  moderate: { dot: 'bg-warning', ring: 'border-warning' },
  urgent: { dot: 'bg-danger', ring: 'border-danger' },
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const stopCanvasGesture = (event: { stopPropagation: () => void }) => event.stopPropagation()

const isFocused = (focus: SceneFocus, toothId: string | null, objectId: string | null) =>
  focus.toothId ? toothId === focus.toothId : toothId === null && objectId === focus.objectId

const worldNormal = new THREE.Vector3()
const toCamera = new THREE.Vector3()

function useBreath(breathing: boolean) {
  const ring = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ring.current
    if (!element || !breathing || prefersReducedMotion()) return
    const animation = element.animate(
      [
        { transform: 'scale(1)', opacity: 0.6 },
        { transform: 'scale(2.6)', opacity: 0 },
      ],
      { duration: BREATH_DURATION, easing: BREATH_EASING, iterations: Infinity },
    )
    return () => animation.cancel()
  }, [breathing])

  return ring
}

interface MarkerProps {
  spec: HotspotSpec
  active: boolean
  breathing: boolean
  buttonRef?: RefObject<HTMLButtonElement | null>
}

const HotspotMarker = memo(function HotspotMarker({ spec, active, breathing, buttonRef }: MarkerProps) {
  const ring = useBreath(breathing)
  const tone = TONE_CLASS[spec.tone]

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={spec.ariaLabel}
      aria-pressed={active}
      onPointerDown={stopCanvasGesture}
      onPointerUp={stopCanvasGesture}
      onClick={(event) => {
        event.stopPropagation()
        useAppStore.getState().markHotspotTouched()
        focusScene(spec.focus)
      }}
      className="group pointer-events-auto relative grid size-11 cursor-pointer touch-manipulation place-items-center rounded-full transition-opacity duration-150"
    >
      <span ref={ring} aria-hidden className={`pointer-events-none absolute size-3.5 rounded-full border-2 opacity-0 ${tone.ring}`} />
      <span
        aria-hidden
        className={`relative size-3.5 rounded-full shadow-float ring-2 ring-[var(--p-paper)] transition-transform duration-150 ease-[var(--ease-out)] group-hover:scale-110 group-active:scale-[0.97] group-aria-pressed:scale-125 ${tone.dot}`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 mb-1 origin-bottom -translate-x-1/2 scale-[0.96] whitespace-nowrap rounded-[var(--radius-control)] bg-surface-raised px-2.5 py-1 text-[15px] leading-5 font-medium text-fg opacity-0 shadow-float transition-[opacity,scale] duration-[180ms] ease-[var(--ease-out)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
      >
        {spec.label}
      </span>
    </button>
  )
})

interface AnchoredHotspotProps extends MarkerProps {
  anchor: ResolvedAnchor
  overlay: RefObject<HTMLElement | null>
}

function AnchoredHotspot({ anchor, overlay, ...marker }: AnchoredHotspotProps) {
  const follower = useRef<THREE.Group>(null!)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const occludedRef = useRef(false)

  const syncPosition = () => {
    follower.current.position.copy(anchor.local).applyMatrix4(anchor.source.matrixWorld)
  }

  useLayoutEffect(() => {
    anchor.source.updateWorldMatrix(true, false)
    syncPosition()
  })

  useFrame((state) => {
    syncPosition()
    worldNormal.copy(anchor.localNormal).transformDirection(anchor.source.matrixWorld)
    toCamera.subVectors(state.camera.position, follower.current.position).normalize()
    const occluded = worldNormal.dot(toCamera) < anchor.minCosine
    if (occluded !== occludedRef.current && buttonRef.current) {
      occludedRef.current = occluded
      buttonRef.current.style.opacity = occluded ? '0' : '1'
      buttonRef.current.style.pointerEvents = occluded ? 'none' : 'auto'
    }
  })

  return (
    <group ref={follower}>
      <Html center portal={overlay as RefObject<HTMLElement>} zIndexRange={HOTSPOT_Z_RANGE}>
        <HotspotMarker {...marker} buttonRef={buttonRef} />
      </Html>
    </group>
  )
}

function useHotspotSpecs(): HotspotSpec[] {
  const mode = useAppStore((state) => state.mode)
  const intro = useAppStore((state) => state.intro)
  const selectedDiseaseId = useAppStore((state) => state.selectedDiseaseId)
  // Hotspots point at single permanent teeth; with two dentitions on screen they would be ambiguous.
  const comparing = useAppStore((state) => activeComparison(state) !== 'off')
  // A jaw cut removes the surfaces the markers sit on.
  const cutOpen = useAppStore(jawSectionOn)

  return useMemo(() => {
    if (intro || comparing || cutOpen) return []
    if (mode === 'explore') return ANATOMY_HOTSPOTS
    if (mode !== 'diseases' || !selectedDiseaseId) return []
    const spot = diseaseHotspot(selectedDiseaseId)
    return spot ? [spot] : []
  }, [mode, intro, selectedDiseaseId, comparing, cutOpen])
}

export function Hotspots({ overlay }: { overlay: RefObject<HTMLElement | null> }) {
  const specs = useHotspotSpecs()
  const [sceneReady, setSceneReady] = useState(false)
  const touched = useAppStore((state) => state.hotspotTouched)
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)

  const dentition = useAppStore(renderedDentition)

  useEffect(() => setSceneReady(true), [])

  // Resolve after commit: on a dentition swap the new Tooth groups register in sceneRegistry during their
  // layout effects, so resolving during render would bind hotspots to the old, already-detached teeth.
  const [placed, setPlaced] = useState<{ spec: HotspotSpec; anchor: ResolvedAnchor }[]>([])
  useEffect(() => {
    if (!sceneReady) return
    setPlaced(
      specs.slice(0, MAX_VISIBLE_HOTSPOTS).flatMap((spec) => {
        const anchor = resolveAnchor(spec.anchor)
        return anchor ? [{ spec, anchor }] : []
      }),
    )
  }, [specs, sceneReady, dentition])

  return (
    <>
      {placed.map(({ spec, anchor }) => {
        const active = isFocused(spec.focus, selectedToothId, selectedObjectId)
        return (
          <AnchoredHotspot
            key={spec.id}
            spec={spec}
            anchor={anchor}
            overlay={overlay}
            active={active}
            breathing={spec.tone === 'brand' ? !touched : !active}
          />
        )
      })}
    </>
  )
}
