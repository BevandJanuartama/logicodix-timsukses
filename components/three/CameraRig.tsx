'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import CameraControlsImpl from 'camera-controls'
import * as THREE from 'three'
import { toDentitionToothId } from '@/lib/data/dentition'
import { activeComparison, renderedDentition, useAppStore } from '@/lib/store'
import { STACK_ASPECT, sceneJawBounds } from '@/lib/three/comparison'
import { activeDentition, getLayouts } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import type { CameraCommand, CameraPreset, Lod } from '@/lib/types'

const MIN_DISTANCE = 1.4
const MAX_DISTANCE = 40
// Overview pivot sits inside the mouth (~2.7 behind the incisors): stop dolly before it tunnels through them.
const OVERVIEW_MIN_DISTANCE = 3.4
// Gingiva / lingual pivots sit on the tissue surface, so the camera may come much closer.
const GINGIVA_MIN_DISTANCE = 0.6
const LINGUAL_MIN_DISTANCE = 0.9
const MIN_POLAR_ANGLE = 0.12
const MAX_POLAR_ANGLE = 2.45
const BOUNDARY_MARGIN = 1.2
const GINGIVA_DISTANCE = 2.4
const GINGIVA_ROOTWARD = 0.1
const GINGIVA_SURFACE_OFFSET = 0.08
const GINGIVA_CROWN_TILT = 0.3
const LINGUAL_DISTANCE = 3.0
const LINGUAL_RISE = 0.6
const LINGUAL_ANCHOR_TOOTH = '31'
// "Gusi" overview: the default front view, pulled in a little and aimed down toward the lower anterior gum.
const GUM_OVERVIEW_ZOOM = 0.72
const GUM_OVERVIEW_AIM = 0.65
const GUM_OVERVIEW_MIN_DISTANCE = 2.0
const LOD_MACRO_DISTANCE = 6.6
const LOD_MICRO_DISTANCE = 3.4
const INTRO_SWAY_SPEED = 0.35
const INTRO_SWAY_ANGLE = 0.5
const FOCUS_SMOOTH_TIME = 0.42
const GLIDE_SMOOTH_TIME = 0.26
const FIT_HEIGHT_DISTANCE = 18
const FIT_WIDTH_SPAN = 14.8

type Vec3 = [number, number, number]

const DEFAULT_TARGET: Vec3 = [0, -0.6, -0.2]

type OrbitPreset = Exclude<CameraPreset, 'lingual'>

const PRESETS: Record<OrbitPreset, { direction: Vec3; target: Vec3 }> = {
  front: { direction: [0, 0.24, 1], target: DEFAULT_TARGET },
  top: { direction: [0, 0.62, 0.78], target: [0, -1.7, -0.9] },
  bottom: { direction: [0, -0.7, 0.75], target: [0, 0.6, -0.2] },
  left: { direction: [-1, 0.15, 0.25], target: [0, -0.1, -0.4] },
  right: { direction: [1, 0.15, 0.25], target: [0, -0.1, -0.4] },
}

const MIN_ARCH_FIT = 0.8

/**
 * Presets were tuned on the permanent arch. For the (smaller, more anterior) primary arch, shift the pivot
 * by the difference in arch centre and pull the overview in by the arch-width ratio.
 */
function archFit() {
  const active = getLayouts().lower.inner
  const permanent = getLayouts('permanent').lower.inner
  const center = (inner: typeof active) => (inner.zFront + inner.zBack) / 2
  return {
    dz: center(active) - center(permanent),
    scale: THREE.MathUtils.clamp(active.halfX / permanent.halfX, MIN_ARCH_FIT, 1),
  }
}

const fitDistance = (aspect: number) =>
  Math.max(FIT_HEIGHT_DISTANCE, FIT_WIDTH_SPAN / Math.max(aspect, 0.3)) * archFit().scale

/** Tooth ids in commands/anchors are written for the permanent dentition; resolve them onto what is rendered. */
const resolveTooth = (toothId: string) => toDentitionToothId(toothId, activeDentition())

const lodForDistance = (distance: number): Lod =>
  distance > LOD_MACRO_DISTANCE ? 'macro' : distance > LOD_MICRO_DISTANCE ? 'meso' : 'micro'

interface ToothFrame {
  origin: THREE.Vector3
  yAxis: THREE.Vector3
  zAxis: THREE.Vector3
}

/** World frame of a tooth: origin at the CEJ, +y toward the crown, +z labial/buccal. */
function toothFrame(toothId: string): ToothFrame | null {
  const tooth = sceneRegistry.teeth.get(toothId)
  if (!tooth) return null
  tooth.updateWorldMatrix(true, false)
  const e = tooth.matrixWorld.elements
  return {
    origin: new THREE.Vector3().setFromMatrixPosition(tooth.matrixWorld),
    yAxis: new THREE.Vector3(e[4], e[5], e[6]).normalize(),
    zAxis: new THREE.Vector3(e[8], e[9], e[10]).normalize(),
  }
}

/** Central incisors are framed on the midline (between the pair), everything else on the tooth itself. */
function archFrame(toothId: string): ToothFrame | null {
  const frame = toothFrame(toothId)
  if (!frame || toothId[1] !== '1') return frame
  const quadrant = Number(toothId[0])
  const mirror = toothFrame(`${quadrant % 2 ? quadrant + 1 : quadrant - 1}1`)
  if (!mirror) return frame
  frame.origin.lerp(mirror.origin, 0.5)
  frame.yAxis.add(mirror.yAxis).normalize()
  frame.zAxis.add(mirror.zAxis).normalize()
  return frame
}

const setLookAt = (controls: CameraControls, position: THREE.Vector3, target: THREE.Vector3, animate: boolean) =>
  controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, animate)

/** Camera inside the arch, above the tongue, looking at the lingual surface of the lower anterior teeth. */
function lookLingual(controls: CameraControls, animate: boolean) {
  const anchor = resolveTooth(LINGUAL_ANCHOR_TOOTH)
  const frame = archFrame(anchor)
  const info = getLayouts().byId.get(anchor)
  if (!frame || !info) return false
  const target = frame.origin
    .clone()
    .addScaledVector(frame.yAxis, info.params.crownHeight * 0.35)
    .addScaledVector(frame.zAxis, -info.params.depth * 0.5)
  const view = frame.zAxis.clone().negate().addScaledVector(frame.yAxis, LINGUAL_RISE).normalize()
  controls.minDistance = LINGUAL_MIN_DISTANCE
  setLookAt(controls, target.clone().addScaledVector(view, LINGUAL_DISTANCE), target, animate)
  return true
}

function lookAtPreset(controls: CameraControls, preset: CameraPreset, distance: number, animate: boolean) {
  if (preset === 'lingual' && lookLingual(controls, animate)) return
  const { direction, target: base } = PRESETS[preset === 'lingual' ? 'front' : preset]
  const target = new THREE.Vector3(...base)
  target.z += archFit().dz
  controls.minDistance = OVERVIEW_MIN_DISTANCE
  setLookAt(controls, target.clone().addScaledVector(new THREE.Vector3(...direction).normalize(), distance), target, animate)
}

function focusTooth(controls: CameraControls, toothId: string, section: boolean, aspect: number, animate: boolean) {
  const frame = toothFrame(toothId)
  const tooth = sceneRegistry.teeth.get(toothId)
  if (!frame || !tooth) return
  const crownHeight = tooth.userData.crownHeight as number
  const rootLength = tooth.userData.rootLength as number
  const narrow = aspect < 0.85 ? 1.35 : 1
  const target = frame.origin.clone().addScaledVector(frame.yAxis, section ? (crownHeight - rootLength) * 0.5 : crownHeight * 0.4)
  const distance = (section ? 3.0 : 4.6) * narrow
  const position = target.clone().addScaledVector(frame.zAxis, distance).add(new THREE.Vector3(0, distance * 0.16, 0))
  controls.minDistance = MIN_DISTANCE
  setLookAt(controls, position, target, animate)
}

/** Pivot on the labial gum surface just rootward of the CEJ, viewed slightly from the crown side so the margin reads. */
function focusGingiva(controls: CameraControls, toothId: string, aspect: number, animate: boolean) {
  const frame = archFrame(toothId)
  const info = getLayouts().byId.get(toothId)
  if (!frame || !info) return
  const target = frame.origin
    .clone()
    .addScaledVector(frame.yAxis, -GINGIVA_ROOTWARD)
    .addScaledVector(frame.zAxis, info.params.depth * 0.5 + GINGIVA_SURFACE_OFFSET)
  const view = frame.zAxis.clone().addScaledVector(frame.yAxis, GINGIVA_CROWN_TILT).normalize()
  const distance = GINGIVA_DISTANCE * (aspect < 0.85 ? 1.3 : 1)
  controls.minDistance = GINGIVA_MIN_DISTANCE
  setLookAt(controls, target.clone().addScaledVector(view, distance), target, animate)
}

/** Default front framing, slightly closer, with the pivot lowered toward the lower anterior gum line. */
function lookGumOverview(controls: CameraControls, aspect: number, animate: boolean) {
  const anchor = resolveTooth(LINGUAL_ANCHOR_TOOTH)
  const frame = archFrame(anchor)
  const info = getLayouts().byId.get(anchor)
  if (!frame || !info) {
    lookAtPreset(controls, 'front', fitDistance(aspect) * GUM_OVERVIEW_ZOOM, animate)
    return
  }
  const lowerGum = frame.origin
    .clone()
    .addScaledVector(frame.yAxis, -GINGIVA_ROOTWARD)
    .addScaledVector(frame.zAxis, info.params.depth * 0.5 + GINGIVA_SURFACE_OFFSET)
  const center = new THREE.Vector3(...DEFAULT_TARGET)
  center.z += archFit().dz
  const target = center.lerp(lowerGum, GUM_OVERVIEW_AIM)
  const view = new THREE.Vector3(...PRESETS.front.direction).normalize()
  controls.minDistance = GUM_OVERVIEW_MIN_DISTANCE
  setLookAt(controls, target.clone().addScaledVector(view, fitDistance(aspect) * GUM_OVERVIEW_ZOOM), target, animate)
}

const isGlide = (command: CameraCommand) => command.kind !== 'zoom' && command.kind !== 'reset'

// Comparison framing: fit the union of both jaw sets (+ room for the labels above them).
const COMPARE_FIT_MARGIN = 1.12
const COMPARE_LABEL_ALLOWANCE = 0.9

function lookComparison(controls: CameraControls, aspect: number, animate: boolean) {
  const box = sceneJawBounds()
  if (box.isEmpty()) {
    lookAtPreset(controls, 'front', fitDistance(aspect), animate)
    return
  }
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const fov = (controls.camera as THREE.PerspectiveCamera).fov ?? 38
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov / 2))
  center.y += COMPARE_LABEL_ALLOWANCE / 2
  const fitHeight = (size.y / 2 + COMPARE_LABEL_ALLOWANCE) / tanHalf
  const fitWidth = size.x / 2 / (tanHalf * Math.max(aspect, 0.3))
  const distance = Math.min(MAX_DISTANCE, Math.max(fitHeight, fitWidth) * COMPARE_FIT_MARGIN + size.z / 2)
  const view = new THREE.Vector3(...PRESETS.front.direction).normalize()
  controls.minDistance = OVERVIEW_MIN_DISTANCE
  setLookAt(controls, center.clone().addScaledVector(view, distance), center, animate)
}

/** The "home" view: the front overview, or the two-jaw framing while comparing. */
function lookOverview(controls: CameraControls, aspect: number, animate: boolean) {
  if (activeComparison(useAppStore.getState()) !== 'off') lookComparison(controls, aspect, animate)
  else lookAtPreset(controls, 'front', fitDistance(aspect), animate)
}

function runCommand(controls: CameraControls, command: CameraCommand, aspect: number, animate: boolean) {
  controls.smoothTime = isGlide(command) ? GLIDE_SMOOTH_TIME : FOCUS_SMOOTH_TIME
  switch (command.kind) {
    case 'zoom':
      controls.dolly(command.direction * controls.distance * 0.28, animate)
      return
    case 'reset':
      lookOverview(controls, aspect, animate)
      return
    case 'preset': {
      const portraitBoost = aspect < 1 ? Math.min(1.8, 0.9 / Math.max(aspect, 0.5)) : 1
      const distance = command.distance ? command.distance * Math.max(1, portraitBoost) : fitDistance(aspect)
      lookAtPreset(controls, command.preset, distance, animate)
      return
    }
    case 'tooth':
      focusTooth(controls, resolveTooth(command.toothId), command.section ?? false, aspect, animate)
      return
    case 'gingiva':
      if (command.toothId) focusGingiva(controls, resolveTooth(command.toothId), aspect, animate)
      else lookGumOverview(controls, aspect, animate)
  }
}

/** Keep the orbit pivot inside the jaws on screen (plus margin) so panning can never lose the model. */
function applyBoundary(controls: CameraControls) {
  const box = sceneJawBounds()
  if (box.isEmpty()) return
  controls.setBoundary(box.expandByScalar(BOUNDARY_MARGIN))
}

export function CameraRig() {
  const controlsRef = useRef<CameraControls>(null)
  const size = useThree((state) => state.size)
  const aspectRef = useRef(1)
  aspectRef.current = size.width / Math.max(1, size.height)
  const framedAspect = useRef<number | null>(null)
  const lastZoom = useRef(-1)
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    controls.minPolarAngle = MIN_POLAR_ANGLE
    controls.maxPolarAngle = MAX_POLAR_ANGLE
    applyBoundary(controls)
    lookAtPreset(controls, 'front', fitDistance(aspectRef.current), false)
    const restoreSmoothTime = () => {
      controls.smoothTime = reduceMotion ? 0.01 : FOCUS_SMOOTH_TIME
    }
    controls.addEventListener('rest', restoreSmoothTime)
    return () => {
      controls.removeEventListener('rest', restoreSmoothTime)
      controls.stop()
    }
  }, [reduceMotion])

  useEffect(
    () =>
      useAppStore.subscribe((state, previous) => {
        const controls = controlsRef.current
        if (!controls) return
        if (previous.intro && !state.intro) lookOverview(controls, aspectRef.current, !reduceMotion)
        if (state.cameraCommand && state.cameraCommand !== previous.cameraCommand) {
          runCommand(controls, state.cameraCommand, aspectRef.current, !reduceMotion)
        }
      }),
    [reduceMotion],
  )

  const aspect = size.width / Math.max(1, size.height)
  useEffect(() => {
    const previous = framedAspect.current
    framedAspect.current = aspect
    const controls = controlsRef.current
    if (previous === null || !controls || Math.abs(previous - aspect) < 0.05) return
    const state = useAppStore.getState()
    if (state.selectedToothId || state.selectedObjectId) return
    lookOverview(controls, aspect, !reduceMotion)
  }, [aspect, reduceMotion])

  // Runs after the commit that swapped the teeth / comparison layer, so the new jaws are measured, not the old ones.
  const dentition = useAppStore(renderedDentition)
  const comparison = useAppStore(activeComparison)
  const stacked = aspect < STACK_ASPECT
  const sceneKey = `${dentition}|${comparison}|${comparison === 'side-by-side' && stacked}`
  const framedScene = useRef(sceneKey)
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || framedScene.current === sceneKey) return
    framedScene.current = sceneKey
    applyBoundary(controls)
    controls.smoothTime = reduceMotion ? 0.01 : FOCUS_SMOOTH_TIME
    const { mode, selectedToothId } = useAppStore.getState()
    if (selectedToothId) focusTooth(controls, selectedToothId, false, aspectRef.current, !reduceMotion)
    else if (mode === 'explore') lookOverview(controls, aspectRef.current, !reduceMotion)
  }, [sceneKey, reduceMotion])

  const mode = useAppStore((state) => state.mode)
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const actions = CameraControlsImpl.ACTION
    const cleaning = mode === 'clean'
    controls.mouseButtons.left = cleaning ? actions.NONE : actions.ROTATE
    controls.mouseButtons.right = cleaning ? actions.ROTATE : actions.TRUCK
    controls.mouseButtons.middle = cleaning ? actions.TRUCK : actions.DOLLY
    controls.touches.one = cleaning ? actions.NONE : actions.TOUCH_ROTATE
    controls.touches.two = cleaning ? actions.TOUCH_DOLLY_ROTATE : actions.TOUCH_DOLLY_TRUCK
  }, [mode])

  useFrame(({ clock }) => {
    const controls = controlsRef.current
    if (!controls) return
    const state = useAppStore.getState()
    if (state.intro && !reduceMotion) {
      const sway = Math.sin(clock.elapsedTime * INTRO_SWAY_SPEED) * INTRO_SWAY_ANGLE
      controls.rotateTo(sway, controls.polarAngle, false)
    }
    const distance = controls.distance
    const lod = lodForDistance(distance)
    if (lod !== state.lod) state.setLod(lod)
    const zoom =
      1 - (Math.log(distance) - Math.log(MIN_DISTANCE)) / (Math.log(MAX_DISTANCE) - Math.log(MIN_DISTANCE))
    if (Math.abs(zoom - lastZoom.current) > 0.01) {
      lastZoom.current = zoom
      state.setZoomLevel(THREE.MathUtils.clamp(zoom, 0, 1))
    }
  })

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      maxDistance={MAX_DISTANCE}
      smoothTime={reduceMotion ? 0.01 : FOCUS_SMOOTH_TIME}
      draggingSmoothTime={0.08}
      dollySpeed={0.6}
    />
  )
}
