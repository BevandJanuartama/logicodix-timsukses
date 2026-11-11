'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import { simulationClock, useSimulatorStore } from '@/lib/simulatorStore'
import { cleaningState } from '@/lib/three/cleaning'
import { iceBiteCycle } from '@/lib/three/math'
import { computePeriodontalState } from '@/lib/three/toothEffects'
import { applyClipping, clipState } from '@/lib/three/clip'
import { applyGingivaSurface, createGingivaUniforms } from '@/lib/three/gingivaShader'
import { getLayouts } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import { JawContent } from './JawContent'
import { periodontalFrame } from './periodontalFrame'
import { bindGlobalToolRelease, useMouthHandlers } from './useMouthHandlers'
import { animateTissueHighlight, useTissueMaterials } from './useTissueMaterials'

const JAW_OFFSET_Y = 0.78
const HINGE_Z = -3.0
const UPPER_OPEN_ANGLE = -0.32
const LOWER_OPEN_ANGLE = 0.18
const SECTION_SPLIT_SPEED = 3.2
const GUM_HEALTHY = new THREE.Color('#ec8f9b')
const GUM_INFLAMED = new THREE.Color('#c63d4f')
const TONGUE_HEALTHY = new THREE.Color('#e27482')
const TONGUE_COATED = new THREE.Color('#efe4d6')

interface JawPose {
  upper: number
  lower: number
  shift: number
}

function targetJawPose(elapsed: number): JawPose {
  const neutral = { upper: UPPER_OPEN_ANGLE, lower: LOWER_OPEN_ANGLE, shift: 0 }
  const { track, playing } = useSimulatorStore.getState()
  if (useAppStore.getState().mode !== 'destroy' || !playing) return neutral
  if (track === 'ice') {
    const bite = iceBiteCycle(elapsed)
    return { upper: UPPER_OPEN_ANGLE + 0.25 * bite, lower: LOWER_OPEN_ANGLE - 0.15 * bite, shift: 0 }
  }
  if (track === 'bruxism' && elapsed % 4.5 < 3) return { upper: -0.05, lower: 0.04, shift: Math.sin(elapsed * 7) * 0.07 }
  return neutral
}

const xAxis = new THREE.Vector3()
const zAxis = new THREE.Vector3()
const origin = new THREE.Vector3()
const anchor = new THREE.Vector3()
const inverted = new THREE.Vector3()

function updateSectionPlanes(delta: number) {
  if (!clipState.active || !clipState.toothId) return
  const tooth = sceneRegistry.teeth.get(clipState.toothId)
  const info = getLayouts().byId.get(clipState.toothId)
  if (!tooth || !info) return
  tooth.updateWorldMatrix(true, false)
  const e = tooth.matrixWorld.elements
  xAxis.set(e[0], e[1], e[2]).normalize()
  zAxis.set(e[8], e[9], e[10]).normalize()
  origin.setFromMatrixPosition(tooth.matrixWorld)
  clipState.offset = THREE.MathUtils.damp(clipState.offset, 0, SECTION_SPLIT_SPEED, delta)
  const halfWindow = info.params.width * 0.62
  const [splitPlane, leftPlane, rightPlane] = clipState.planes
  splitPlane.setFromNormalAndCoplanarPoint(inverted.copy(zAxis).negate(), anchor.copy(origin).addScaledVector(zAxis, clipState.offset))
  leftPlane.setFromNormalAndCoplanarPoint(inverted.copy(xAxis).negate(), anchor.copy(origin).addScaledVector(xAxis, -halfWindow))
  rightPlane.setFromNormalAndCoplanarPoint(xAxis, anchor.copy(origin).addScaledVector(xAxis, halfWindow))
}

export function Mouth() {
  const layouts = useMemo(() => getLayouts(), [])
  const materials = useTissueMaterials()
  const gingivaUniforms = useMemo(() => createGingivaUniforms(), [])
  const handlers = useMouthHandlers()
  const sectionedTooth = useAppStore(sectionedToothOf)
  const sectionedJaw = sectionedTooth ? (layouts.byId.get(sectionedTooth)?.jaw ?? null) : null
  const upperHinge = useRef<THREE.Group>(null!)
  const lowerHinge = useRef<THREE.Group>(null!)
  const upperJaw = useRef<THREE.Group>(null!)
  const lowerJaw = useRef<THREE.Group>(null!)
  const pose = useRef<JawPose>({ upper: UPPER_OPEN_ANGLE, lower: LOWER_OPEN_ANGLE, shift: 0 })

  useLayoutEffect(() => {
    sceneRegistry.jaws.upper = upperJaw.current
    sceneRegistry.jaws.lower = lowerJaw.current
  }, [])

  useLayoutEffect(() => {
    for (const gingiva of [materials.gum.upper, materials.gum.lower, materials.papilla]) {
      applyGingivaSurface(gingiva, gingivaUniforms)
    }
  }, [materials, gingivaUniforms])

  useEffect(() => bindGlobalToolRelease(), [])

  useEffect(() => {
    for (const jaw of ['upper', 'lower'] as const) {
      applyClipping([materials.gum[jaw], materials.bone[jaw]], jaw === sectionedJaw)
    }
    clipState.active = sectionedTooth !== null
    clipState.toothId = sectionedTooth
    if (sectionedTooth) clipState.offset = (layouts.byId.get(sectionedTooth)?.params.depth ?? 0.8) * 0.65
  }, [sectionedTooth, sectionedJaw, materials, layouts])

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime
    updateSectionPlanes(delta)
    animateTissueHighlight(materials, elapsed, delta)

    const mode = useAppStore.getState().mode
    const track = mode === 'destroy' ? useSimulatorStore.getState().track : null
    const periodontal = computePeriodontalState(track, simulationClock.progress)
    periodontalFrame.state = periodontal
    gingivaUniforms.uGumInflammation.value = periodontal.inflammation
    for (const jaw of ['upper', 'lower'] as const) {
      materials.gum[jaw].color.copy(GUM_HEALTHY).lerp(GUM_INFLAMED, periodontal.inflammation)
    }
    const tongueCoat = mode === 'clean' ? cleaningState.tongueCoat * 0.85 : periodontal.tongueCoat
    materials.tongue.color.copy(TONGUE_HEALTHY).lerp(TONGUE_COATED, tongueCoat)

    const target = targetJawPose(elapsed)
    const current = pose.current
    current.upper = THREE.MathUtils.damp(current.upper, target.upper, 9, delta)
    current.lower = THREE.MathUtils.damp(current.lower, target.lower, 9, delta)
    current.shift = THREE.MathUtils.damp(current.shift, target.shift, 14, delta)
    upperHinge.current.rotation.x = current.upper
    lowerHinge.current.rotation.x = current.lower
    lowerJaw.current.position.x = current.shift
  })

  return (
    <group {...handlers}>
      <group ref={upperHinge} position={[0, 0, HINGE_Z]} rotation={[UPPER_OPEN_ANGLE, 0, 0]}>
        <group ref={upperJaw} position={[0, JAW_OFFSET_Y, -HINGE_Z]} rotation={[0, 0, Math.PI]}>
          <JawContent layout={layouts.upper} materials={materials} />
        </group>
      </group>
      <group ref={lowerHinge} position={[0, 0, HINGE_Z]} rotation={[LOWER_OPEN_ANGLE, 0, 0]}>
        <group ref={lowerJaw} position={[0, -JAW_OFFSET_Y, -HINGE_Z]}>
          <JawContent layout={layouts.lower} materials={materials} />
        </group>
      </group>
    </group>
  )
}
