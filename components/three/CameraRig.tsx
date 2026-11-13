'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import CameraControlsImpl from 'camera-controls'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { sceneRegistry } from '@/lib/three/registry'
import type { CameraCommand, CameraPreset, Lod } from '@/lib/types'

const MIN_DISTANCE = 1.4
const MAX_DISTANCE = 40
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

const PRESETS: Record<CameraPreset, { direction: Vec3; target: Vec3 }> = {
  front: { direction: [0, 0.24, 1], target: DEFAULT_TARGET },
  top: { direction: [0, 0.62, 0.78], target: [0, -1.7, -0.9] },
  bottom: { direction: [0, -0.7, 0.75], target: [0, 0.6, -0.2] },
  left: { direction: [-1, 0.15, 0.25], target: [0, -0.1, -0.4] },
  right: { direction: [1, 0.15, 0.25], target: [0, -0.1, -0.4] },
}

const fitDistance = (aspect: number) => Math.max(FIT_HEIGHT_DISTANCE, FIT_WIDTH_SPAN / Math.max(aspect, 0.3))

const lodForDistance = (distance: number): Lod =>
  distance > LOD_MACRO_DISTANCE ? 'macro' : distance > LOD_MICRO_DISTANCE ? 'meso' : 'micro'

function lookAtPreset(controls: CameraControls, preset: CameraPreset, distance: number, animate: boolean) {
  const { direction, target } = PRESETS[preset]
  const offset = new THREE.Vector3(...direction).normalize().multiplyScalar(distance)
  controls.setLookAt(target[0] + offset.x, target[1] + offset.y, target[2] + offset.z, ...target, animate)
}

function focusTooth(controls: CameraControls, toothId: string, section: boolean, aspect: number, animate: boolean) {
  const tooth = sceneRegistry.teeth.get(toothId)
  if (!tooth) return
  tooth.updateWorldMatrix(true, false)
  const e = tooth.matrixWorld.elements
  const yAxis = new THREE.Vector3(e[4], e[5], e[6]).normalize()
  const zAxis = new THREE.Vector3(e[8], e[9], e[10]).normalize()
  const origin = new THREE.Vector3().setFromMatrixPosition(tooth.matrixWorld)
  const crownHeight = tooth.userData.crownHeight as number
  const rootLength = tooth.userData.rootLength as number
  const narrow = aspect < 0.85 ? 1.35 : 1
  const target = section
    ? origin.clone().addScaledVector(yAxis, (crownHeight - rootLength) * 0.5)
    : origin.clone().addScaledVector(yAxis, crownHeight * 0.4)
  const distance = (section ? 3.0 : 4.6) * narrow
  const position = target.clone().addScaledVector(zAxis, distance).add(new THREE.Vector3(0, distance * 0.16, 0))
  controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, animate)
}

const isGlide = (command: CameraCommand) => command.kind === 'tooth' || command.kind === 'preset'

function runCommand(controls: CameraControls, command: CameraCommand, aspect: number, animate: boolean) {
  controls.smoothTime = isGlide(command) ? GLIDE_SMOOTH_TIME : FOCUS_SMOOTH_TIME
  switch (command.kind) {
    case 'zoom':
      controls.dolly(command.direction * controls.distance * 0.28, animate)
      return
    case 'reset':
      lookAtPreset(controls, 'front', fitDistance(aspect), animate)
      return
    case 'preset': {
      const portraitBoost = aspect < 1 ? Math.min(1.8, 0.9 / Math.max(aspect, 0.5)) : 1
      const distance = command.distance ? command.distance * Math.max(1, portraitBoost) : fitDistance(aspect)
      lookAtPreset(controls, command.preset, distance, animate)
      return
    }
    case 'tooth':
      focusTooth(controls, command.toothId, command.section ?? false, aspect, animate)
  }
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
        if (previous.intro && !state.intro) lookAtPreset(controls, 'front', fitDistance(aspectRef.current), !reduceMotion)
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
    lookAtPreset(controls, 'front', fitDistance(aspect), !reduceMotion)
  }, [aspect, reduceMotion])

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
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      smoothTime={reduceMotion ? 0.01 : FOCUS_SMOOTH_TIME}
      draggingSmoothTime={0.08}
      dollySpeed={0.6}
    />
  )
}
