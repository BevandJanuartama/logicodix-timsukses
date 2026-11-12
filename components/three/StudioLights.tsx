'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import type * as THREE from 'three'
import type CameraControlsImpl from 'camera-controls'

const SKY_COLOR = '#FFF7EE'
const GROUND_COLOR = '#E8CDB9'
const KEY_COLOR = '#FFF1E0'
const RIM_COLOR = '#FFE2CF'
const FILL_COLOR = '#ffd9bd'
const RIG_FOLLOW_SPEED = 2.4

export function StudioLights() {
  const rig = useRef<THREE.Group>(null!)
  const controls = useThree((state) => state.controls) as CameraControlsImpl | null

  useFrame((_, delta) => {
    if (!controls) return
    const azimuth = controls.azimuthAngle
    const current = rig.current.rotation.y
    const wrapped = MathUtils.euclideanModulo(azimuth - current + Math.PI, Math.PI * 2) - Math.PI
    rig.current.rotation.y = MathUtils.damp(current, current + wrapped, RIG_FOLLOW_SPEED, delta)
  })

  return (
    <>
      <hemisphereLight args={[SKY_COLOR, GROUND_COLOR, 0.6]} />
      <group ref={rig}>
        <directionalLight position={[4.5, 7, 9]} intensity={2.0} color={KEY_COLOR} />
        <directionalLight position={[-6.5, 3.5, -7]} intensity={1.0} color={RIM_COLOR} />
        <directionalLight position={[-5, -3, 7]} intensity={0.8} color={FILL_COLOR} />
      </group>
    </>
  )
}
