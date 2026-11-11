'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import type * as THREE from 'three'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import { applyClipping, clipRaycast, noRaycast } from '@/lib/three/clip'
import type { ToothInfo } from '@/lib/three/layout'
import { sceneRegistry } from '@/lib/three/registry'
import { getInnerGeometry, getOuterGeometry, getSupportGeometry } from '@/lib/three/toothGeometry'
import { crackMaterial, createToothMaterials } from '@/lib/three/toothMaterial'
import type { CrownMetrics } from '@/lib/three/toothEffects'
import { useToothEffects } from './useToothEffects'
import { useToothHighlight } from './useToothHighlight'

const pickable = (enabled: boolean) => (enabled ? (clipRaycast as never) : (noRaycast as never))

const SECTIONED_CUTAWAY = 1
const PEELED_CUTAWAY = 0.4
const CUTAWAY_EASE = 6

export function Tooth({ info }: { info: ToothInfo }) {
  const id = info.id
  const group = useRef<THREE.Group>(null!)
  const layers = useAppStore((state) => state.layers)
  const highDetail = useAppStore((state) => state.selectedToothId === id && state.lod !== 'macro')
  const sectioned = useAppStore((state) => sectionedToothOf(state) === id)

  const peeled = !layers.enamel || !layers.cementum
  const showInner = sectioned || peeled
  const rootsExposed = sectioned || (!layers.gingiva && !layers.alveolar_bone)
  const showLigament = layers.pd_ligament && rootsExposed
  const showJunction = layers.cej && (sectioned || !layers.gingiva)

  const outer = useMemo(() => getOuterGeometry(info, highDetail ? 'high' : 'low'), [info, highDetail])
  const inner = useMemo(() => (showInner ? getInnerGeometry(info) : null), [info, showInner])
  const support = useMemo(() => (showLigament || showJunction ? getSupportGeometry(info) : null), [info, showLigament, showJunction])
  const materials = useMemo(() => createToothMaterials(info.params), [info])
  const cutawayTarget = sectioned ? SECTIONED_CUTAWAY : peeled ? PEELED_CUTAWAY : 0

  useEffect(() => () => materials.clippable.forEach((material) => material.dispose()), [materials])

  useLayoutEffect(() => {
    const node = group.current
    node.userData.crownHeight = info.params.crownHeight
    node.userData.rootLength = info.params.rootLength
    sceneRegistry.teeth.set(id, node)
    return () => {
      if (sceneRegistry.teeth.get(id) === node) sceneRegistry.teeth.delete(id)
    }
  }, [id, info])

  useEffect(() => applyClipping(materials.clippable, sectioned), [sectioned, materials])

  useEffect(() => {
    materials.uniforms.outer.uShowBand.value.set(Number(layers.enamel), Number(layers.cementum))
    materials.uniforms.pulp.uShowBand.value.set(Number(layers.pulp_chamber), Number(layers.root_canal))
  }, [layers, materials])

  const animateHighlight = useToothHighlight(id, materials)
  const effects = useToothEffects(info, materials, outer.userData as CrownMetrics)
  useFrame((state, delta) => {
    animateHighlight(state.clock.elapsedTime, delta)
    effects.animate(state.clock.elapsedTime)
    const cutaway = materials.anatomy.uCutaway
    cutaway.value = MathUtils.damp(cutaway.value, cutawayTarget, CUTAWAY_EASE, delta)
  })

  const showOuter = layers.enamel || layers.cementum
  const showPulp = layers.pulp && (layers.pulp_chamber || layers.root_canal)

  return (
    <group ref={group} position={info.position} quaternion={info.quaternion}>
      <mesh
        geometry={outer}
        material={materials.outer}
        visible={showOuter}
        raycast={pickable(showOuter)}
        userData={{ kind: 'tooth', toothId: id }}
      />
      {inner && (
        <>
          <mesh
            geometry={inner.dentin}
            material={materials.dentin}
            visible={layers.dentin}
            raycast={pickable(layers.dentin)}
            userData={{ kind: 'dentin', toothId: id }}
          />
          <mesh
            geometry={inner.pulp}
            material={materials.pulp}
            visible={showPulp}
            raycast={pickable(showPulp)}
            userData={{ kind: 'pulp', toothId: id }}
          />
          {inner.vessels.map((geometry, index) => (
            <mesh
              key={index}
              geometry={geometry}
              material={materials.vessels[index]}
              visible={layers.pulp}
              raycast={pickable(layers.pulp)}
              userData={{ kind: 'vessel', toothId: id }}
            />
          ))}
        </>
      )}
      {support && showLigament && (
        <mesh geometry={support.ligament} material={materials.ligament} raycast={pickable(true)} userData={{ kind: 'ligament', toothId: id }} />
      )}
      {effects.cracks?.map((geometry, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            effects.crackMeshes.current[index] = mesh
          }}
          geometry={geometry}
          material={crackMaterial}
          raycast={noRaycast as never}
          visible={false}
        />
      ))}
      {support && showJunction && (
        <mesh geometry={support.junction} material={materials.junction} raycast={pickable(true)} userData={{ kind: 'junction', toothId: id }} />
      )}
    </group>
  )
}
