'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { activeComparison, jawSectionOn, renderedDentition, sectionedToothOf, useAppStore } from '@/lib/store'
import { simulationClock, useSimulatorStore } from '@/lib/simulatorStore'
import { cleaningState } from '@/lib/three/cleaning'
import { iceBiteCycle } from '@/lib/three/math'
import { computePeriodontalState } from '@/lib/three/toothEffects'
import { clipPlanesFor, clipState, setClipPlanes } from '@/lib/three/clip'
import { comparisonPlacement } from '@/lib/three/comparison'
import { applyGingivaSurface, createGingivaUniforms } from '@/lib/three/gingivaShader'
import { getLayouts } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import { retainToothGeometries } from '@/lib/three/toothGeometry'
import { activeConditionPose } from '@/lib/three/conditionPose'
import { ComparisonJaws } from './ComparisonJaws'
import { JawSectionController } from './JawSectionController'
import { ConditionExtraTooth } from './ConditionExtraTooth'
import { IceCube } from './IceCube'
import { JawContent } from './JawContent'
import { HINGE_Z, JAW_OFFSET_Y, LOWER_OPEN_ANGLE, UPPER_OPEN_ANGLE, sharedJawPose, type JawPose } from './jawRig'
import { periodontalFrame } from './periodontalFrame'
import { bindGlobalToolRelease, useMouthHandlers } from './useMouthHandlers'
import { animateTissueHighlight, useTissueMaterials } from './useTissueMaterials'

const CLOSED_UPPER_ANGLE = -0.05
const CLOSED_LOWER_ANGLE = 0.04
const SECTION_SPLIT_SPEED = 3.2
const GUM_HEALTHY = new THREE.Color('#ec8f9b')
const GUM_INFLAMED = new THREE.Color('#c63d4f')
const TONGUE_HEALTHY = new THREE.Color('#e27482')
const TONGUE_COATED = new THREE.Color('#efe4d6')

function targetJawPose(elapsed: number): JawPose {
  const neutral = { upper: UPPER_OPEN_ANGLE, lower: LOWER_OPEN_ANGLE, shift: 0, forward: 0 }
  const condition = activeConditionPose()
  if (condition) {
    const forward = condition.lowerJawForward ?? 0
    return condition.closeBite ? { upper: CLOSED_UPPER_ANGLE, lower: CLOSED_LOWER_ANGLE, shift: 0, forward } : { ...neutral, forward }
  }
  const { track, playing } = useSimulatorStore.getState()
  if (useAppStore.getState().mode !== 'destroy' || !playing) return neutral
  if (track === 'ice') {
    const bite = iceBiteCycle(elapsed)
    return { upper: UPPER_OPEN_ANGLE + 0.25 * bite, lower: LOWER_OPEN_ANGLE - 0.15 * bite, shift: 0, forward: 0 }
  }
  if (track === 'bruxism' && elapsed % 4.5 < 3) return { upper: CLOSED_UPPER_ANGLE, lower: CLOSED_LOWER_ANGLE, shift: Math.sin(elapsed * 7) * 0.07, forward: 0 }
  return neutral
}

const tintColor = new THREE.Color()
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
  const dentition = useAppStore(renderedDentition)
  const layouts = useMemo(() => getLayouts(dentition), [dentition])
  const materials = useTissueMaterials()
  const gingivaUniforms = useMemo(() => createGingivaUniforms(), [])
  const handlers = useMouthHandlers()
  const sectionedTooth = useAppStore(sectionedToothOf)
  const sectionedJaw = sectionedTooth ? (layouts.byId.get(sectionedTooth)?.jaw ?? null) : null
  const jawCut = useAppStore(jawSectionOn)
  const upperHinge = useRef<THREE.Group>(null!)
  const lowerHinge = useRef<THREE.Group>(null!)
  const upperJaw = useRef<THREE.Group>(null!)
  const lowerJaw = useRef<THREE.Group>(null!)
  const pose = useRef<JawPose>(sharedJawPose)
  const comparison = useAppStore(activeComparison)
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height))
  const placement = useMemo(() => comparisonPlacement(comparison, aspect), [comparison, aspect])

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

  // Swapping dentition unmounts every Tooth (their materials dispose themselves); free the outgoing cached geometry too.
  useEffect(() => retainToothGeometries(layouts, () => layouts.byId.keys()), [layouts])

  useEffect(() => {
    for (const jaw of ['upper', 'lower'] as const) {
      setClipPlanes([materials.gum[jaw], materials.bone[jaw]], clipPlanesFor(jaw === sectionedJaw, jawCut))
    }
    setClipPlanes([materials.papilla, materials.palate, materials.floor, materials.tongue], clipPlanesFor(false, jawCut))
    // Gum/bone/palate/floor are already double-sided; the tongue is not, so its cut would look hollow.
    const tongueSide = jawCut ? THREE.DoubleSide : THREE.FrontSide
    if (materials.tongue.side !== tongueSide) {
      materials.tongue.side = tongueSide
      materials.tongue.needsUpdate = true
    }
    clipState.active = sectionedTooth !== null
    clipState.toothId = sectionedTooth
    if (sectionedTooth) clipState.offset = (layouts.byId.get(sectionedTooth)?.params.depth ?? 0.8) * 0.65
  }, [sectionedTooth, sectionedJaw, jawCut, materials, layouts])

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

    const conditionPose = activeConditionPose()
    if (conditionPose?.gumTint) {
      tintColor.set(conditionPose.gumTint.color)
      for (const jaw of ['upper', 'lower'] as const) materials.gum[jaw].color.lerp(tintColor, conditionPose.gumTint.amount)
    }
    if (conditionPose?.tongueTint) {
      materials.tongue.color.lerp(tintColor.set(conditionPose.tongueTint.color), conditionPose.tongueTint.amount)
    }

    const target = targetJawPose(elapsed)
    const current = pose.current
    current.upper = THREE.MathUtils.damp(current.upper, target.upper, 9, delta)
    current.lower = THREE.MathUtils.damp(current.lower, target.lower, 9, delta)
    current.shift = THREE.MathUtils.damp(current.shift, target.shift, 14, delta)
    upperHinge.current.rotation.x = current.upper
    lowerHinge.current.rotation.x = current.lower
    current.forward = THREE.MathUtils.damp(current.forward, target.forward, 5, delta)
    lowerJaw.current.position.x = current.shift
    lowerJaw.current.position.z = -HINGE_Z + current.forward
  })

  return (
    <>
      <group {...handlers}>
        <ConditionExtraTooth />
        <IceCube />
        <group position={placement.main}>
          <group ref={upperHinge} position={[0, 0, HINGE_Z]} rotation={[UPPER_OPEN_ANGLE, 0, 0]}>
            <group ref={upperJaw} position={[0, JAW_OFFSET_Y, -HINGE_Z]} rotation={[0, 0, Math.PI]}>
              <JawContent key={`upper-${dentition}`} layout={layouts.upper} materials={materials} />
            </group>
          </group>
          <group ref={lowerHinge} position={[0, 0, HINGE_Z]} rotation={[LOWER_OPEN_ANGLE, 0, 0]}>
            <group ref={lowerJaw} position={[0, -JAW_OFFSET_Y, -HINGE_Z]}>
              <JawContent key={`lower-${dentition}`} layout={layouts.lower} materials={materials} />
            </group>
          </group>
        </group>
      </group>
      {/* Outside the handler group: the comparison layer is look-only (no picking, hover or cleaning). */}
      {comparison !== 'off' && <ComparisonJaws mode={comparison} placement={placement} materials={materials} />}
      <JawSectionController />
    </>
  )
}
