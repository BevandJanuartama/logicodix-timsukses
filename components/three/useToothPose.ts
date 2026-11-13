import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { activeConditionPose } from '@/lib/three/conditionPose'
import type { ToothMaterials } from '@/lib/three/toothMaterial'

const POSE_EASE = 5
const HIDDEN_SCALE = 0.001
const tintTarget = new THREE.Color()
const tintColor = new THREE.Color()
const tiltTarget = new THREE.Euler()
const tiltQuaternion = new THREE.Quaternion()

export function useToothPose(toothId: string, materials: ToothMaterials) {
  const poseGroup = useRef<THREE.Group>(null!)
  const base = useMemo(
    () => ({ color: materials.outer.color.clone(), roughness: materials.outer.roughness, clearcoat: materials.outer.clearcoat }),
    [materials],
  )

  const animatePose = (delta: number) => {
    const node = poseGroup.current
    const pose = activeConditionPose()
    const toothPose = pose?.teeth?.[toothId]
    const [sx, sy, sz] = toothPose?.shift ?? [0, 0, 0]
    const [tx, ty, tz] = toothPose?.tilt ?? [0, 0, 0]
    const scale = toothPose?.hidden ? HIDDEN_SCALE : 1

    node.position.set(
      THREE.MathUtils.damp(node.position.x, sx, POSE_EASE, delta),
      THREE.MathUtils.damp(node.position.y, sy, POSE_EASE, delta),
      THREE.MathUtils.damp(node.position.z, sz, POSE_EASE, delta),
    )
    tiltQuaternion.setFromEuler(tiltTarget.set(tx, ty, tz))
    node.quaternion.slerp(tiltQuaternion, 1 - Math.exp(-POSE_EASE * delta))
    node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, scale, POSE_EASE, delta))
    node.visible = node.scale.x > HIDDEN_SCALE * 2

    const tint = toothPose?.tint ?? pose?.tint
    const outer = materials.outer
    tintTarget.copy(base.color)
    if (tint) tintTarget.lerp(tintColor.set(tint.color), tint.amount)
    outer.color.lerp(tintTarget, 1 - Math.exp(-POSE_EASE * delta))
    outer.roughness = THREE.MathUtils.damp(outer.roughness, tint?.roughness ?? base.roughness, POSE_EASE, delta)
    const clearcoat = tint ? base.clearcoat * (1 - tint.roughness) : base.clearcoat
    outer.clearcoat = THREE.MathUtils.damp(outer.clearcoat, clearcoat, POSE_EASE, delta)
  }

  return { poseGroup, animatePose }
}
