'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { clipRaycast, noRaycast } from '@/lib/three/clip'
import { getLayouts, type JawLayout } from '@/lib/three/layout'
import { boneGeometry, domeGeometry, gumGeometry, papillaScale, tongueGeometry } from '@/lib/three/softTissue'
import { PlaqueLayer } from './cleaning/PlaqueLayer'
import { TartarLayer } from './simulation/TartarLayer'
import { Tooth } from './Tooth'
import { periodontalFrame } from './periodontalFrame'
import type { TissueMaterials } from './useTissueMaterials'

const UP = new THREE.Vector3(0, 1, 0)
const PAPILLA_SIZE = new THREE.Vector3(0.085, 0.13, 0.09)
const PAPILLA_RISE = 0.17

function Papillae({ layout, material, visible }: { layout: JawLayout; material: THREE.Material; visible: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 12, 8), [])
  const count = layout.contacts.length * 2

  useLayoutEffect(() => {
    const { byId } = getLayouts(layout.dentition)
    const k = papillaScale(layout.dentition)
    const matrix = new THREE.Matrix4()
    const rotation = new THREE.Quaternion()
    const scale = PAPILLA_SIZE.clone().multiplyScalar(k)
    let index = 0
    for (const contact of layout.contacts) {
      const depth = Math.min(byId.get(contact.toothA)!.params.depth, byId.get(contact.toothB)!.params.depth)
      const xAxis = new THREE.Vector3().crossVectors(UP, contact.outward).normalize()
      rotation.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, UP, contact.outward))
      for (const side of [1, -1]) {
        const position = contact.position.clone().addScaledVector(contact.outward, side * depth * 0.36)
        position.y += PAPILLA_RISE * k
        matrix.compose(position, rotation, scale)
        mesh.current.setMatrixAt(index++, matrix)
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [layout])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, count]}
      visible={visible}
      raycast={visible ? THREE.InstancedMesh.prototype.raycast : (noRaycast as never)}
      userData={{ kind: 'papilla' }}
    />
  )
}

/**
 * main    – the interactive jaw (all tissue, plaque & tartar layers)
 * compare – comparison jaw shown beside it (tissue, no cleaning/simulation layers)
 * ghost   – comparison overlay: translucent teeth only
 */
export type JawVariant = 'main' | 'compare' | 'ghost'

interface JawContentProps {
  layout: JawLayout
  materials: TissueMaterials
  variant?: JawVariant
  ghostOpacity?: number
}

export function JawContent({ layout, materials, variant = 'main', ghostOpacity }: JawContentProps) {
  const ghost = variant === 'ghost'
  const showGum = useAppStore((state) => state.layers.gingiva) && !ghost
  const showBone = useAppStore((state) => state.layers.alveolar_bone) && !ghost
  const isUpper = layout.jaw === 'upper'
  const gum = useMemo(() => gumGeometry(layout), [layout])
  const bone = useMemo(() => boneGeometry(layout), [layout])
  const dome = useMemo(() => domeGeometry(isUpper), [isUpper])
  const tongue = useMemo(() => (isUpper ? null : tongueGeometry()), [isUpper])

  useEffect(
    () => () => {
      for (const geometry of [gum, bone, dome, tongue]) geometry?.dispose()
    },
    [gum, bone, dome, tongue],
  )

  const gumGroup = useRef<THREE.Group>(null!)
  const boneGroup = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    const { swelling, recession, boneLoss } = periodontalFrame.state
    const rate = Math.min(1, delta * 6)
    gumGroup.current.position.y += (0.03 * swelling - recession - gumGroup.current.position.y) * rate
    boneGroup.current.position.y += (-boneLoss - boneGroup.current.position.y) * rate
  })

  const { halfX, zFront, zBack } = layout.inner
  const centerZ = (zFront + zBack) / 2
  const halfDepth = (zFront - zBack) / 2 + 0.1

  return (
    <>
      {layout.teeth.map((tooth) => (
        <Tooth key={tooth.id} info={tooth} ghostOpacity={ghost ? ghostOpacity : undefined} />
      ))}
      <group ref={gumGroup}>
        <mesh
          geometry={gum}
          material={materials.gum[layout.jaw]}
          visible={showGum}
          raycast={showGum ? (clipRaycast as never) : (noRaycast as never)}
          userData={{ kind: 'gum' }}
        />
        <Papillae layout={layout} material={materials.papilla} visible={showGum} />
      </group>
      <group ref={boneGroup}>
        <mesh
          geometry={bone}
          material={materials.bone[layout.jaw]}
          visible={showBone}
          raycast={showBone ? (clipRaycast as never) : (noRaycast as never)}
          userData={{ kind: 'bone' }}
        />
      </group>
      {variant === 'main' && (
        <>
          <TartarLayer layout={layout} />
          <PlaqueLayer jaw={layout.jaw} />
        </>
      )}
      {ghost ? null : isUpper ? (
        <mesh
          geometry={dome}
          material={materials.palate}
          position={[0, 0.12, centerZ]}
          scale={[halfX + 0.28, -1.0, halfDepth]}
          raycast={clipRaycast as never}
          userData={{ kind: 'palate' }}
        />
      ) : (
        <>
          <mesh
            geometry={dome}
            material={materials.floor}
            position={[0, 0.02, centerZ]}
            scale={[halfX + 0.28, -0.6, halfDepth]}
            raycast={clipRaycast as never}
            userData={{ kind: 'floor' }}
          />
          <mesh
            geometry={tongue!}
            material={materials.tongue}
            position={[0, -0.1, centerZ - 0.12]}
            scale={[halfX * 0.92, 0.5, halfDepth * 0.98]}
            raycast={clipRaycast as never}
            userData={{ kind: 'tongue' }}
          />
        </>
      )}
    </>
  )
}
