import * as THREE from 'three'
import { CEJ_CURVATURE } from '@/lib/three/cejContour'
import type { ToothParams } from '@/lib/three/layout'
import {
  FRAGMENT_CLEARCOAT_MASK,
  FRAGMENT_EMISSIVE,
  FRAGMENT_MICRO_RELIEF,
  FRAGMENT_OPTICS,
  FRAGMENT_ROUGHNESS,
} from '@/lib/three/toothOptics'
import {
  FRAGMENT_BAND_DISCARD,
  FRAGMENT_COLOR,
  FRAGMENT_DECLARATIONS,
  VERTEX_DECLARATIONS,
  VERTEX_NORMAL,
  VERTEX_POSITION,
} from '@/lib/three/toothShader'

export type ToothLayerKind = 'outer' | 'dentin' | 'pulp'

export interface LayerUniforms {
  [uniform: string]: THREE.IUniform
  uHighlightBand: { value: THREE.Vector2 }
  uRimGlow: { value: number }
  uShowBand: { value: THREE.Vector2 }
  uCrownHeight: { value: number }
}

export interface EffectUniforms {
  [uniform: string]: THREE.IUniform
  uFlatNormal: { value: THREE.Vector3 }
  uFlatDistance: { value: number }
  uFlatExposure: { value: number }
  uDecay: { value: number }
  uDecayCenter: { value: THREE.Vector3 }
  uDecayRadius: { value: number }
  uDecayDepth: { value: number }
  uStain: { value: number }
  uInflammation: { value: number }
  uTime: { value: number }
}

export interface AnatomyUniforms {
  [uniform: string]: THREE.IUniform
  uCejCurve: { value: number }
  uToothSpan: { value: THREE.Vector2 }
  uRootLength: { value: number }
  uCutaway: { value: number }
}

function createAnatomyUniforms(params: ToothParams): AnatomyUniforms {
  return {
    uCejCurve: { value: CEJ_CURVATURE[params.kind] },
    uToothSpan: { value: new THREE.Vector2(params.width, params.depth) },
    uRootLength: { value: params.rootLength },
    uCutaway: { value: 0 },
  }
}

function createEffectUniforms(): EffectUniforms {
  return {
    uFlatNormal: { value: new THREE.Vector3(0, 1, 0) },
    uFlatDistance: { value: 99 },
    uFlatExposure: { value: 0 },
    uDecay: { value: 0 },
    uDecayCenter: { value: new THREE.Vector3(0, 99, 0) },
    uDecayRadius: { value: 0.2 },
    uDecayDepth: { value: 0 },
    uStain: { value: 0 },
    uInflammation: { value: 0 },
    uTime: { value: 0 },
  }
}

interface LayerLook {
  color: string
  roughness: number
  define: string
  clearcoat: number
  clearcoatRoughness: number
  ior: number
  specularIntensity: number
}

const LAYER_LOOK: Record<ToothLayerKind, LayerLook> = {
  outer: { color: '#f5f2ea', roughness: 0.24, define: 'TOOTH_OUTER', clearcoat: 0.55, clearcoatRoughness: 0.14, ior: 1.62, specularIntensity: 0.75 },
  dentin: { color: '#e6c78a', roughness: 0.62, define: 'TOOTH_DENTIN', clearcoat: 0, clearcoatRoughness: 0, ior: 1.54, specularIntensity: 0.45 },
  pulp: { color: '#d4505f', roughness: 0.5, define: 'TOOTH_PULP', clearcoat: 0, clearcoatRoughness: 0, ior: 1.4, specularIntensity: 0.6 },
}

function createLayerUniforms(): LayerUniforms {
  return {
    uHighlightBand: { value: new THREE.Vector2(0, 0) },
    uRimGlow: { value: 0 },
    uShowBand: { value: new THREE.Vector2(1, 1) },
    uCrownHeight: { value: 0.8 },
  }
}

function createLayerMaterial(
  kind: ToothLayerKind,
  uniforms: LayerUniforms,
  effects: EffectUniforms,
  anatomy: AnatomyUniforms,
) {
  const look = LAYER_LOOK[kind]
  const material = new THREE.MeshPhysicalMaterial({
    color: look.color,
    roughness: look.roughness,
    metalness: 0,
    clearcoat: look.clearcoat,
    clearcoatRoughness: look.clearcoatRoughness,
    ior: look.ior,
    specularIntensity: look.specularIntensity,
    side: THREE.DoubleSide,
  })
  const shaderDefines = material as unknown as { defines: Record<string, string> }
  shaderDefines.defines = { ...shaderDefines.defines, [look.define]: '' }
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, effects, anatomy)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
      .replace('#include <beginnormal_vertex>', VERTEX_NORMAL)
      .replace('#include <begin_vertex>', VERTEX_POSITION)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLARATIONS}`)
      .replace('#include <clipping_planes_fragment>', FRAGMENT_BAND_DISCARD)
      .replace('#include <color_fragment>', FRAGMENT_COLOR)
      .replace('#include <roughnessmap_fragment>', FRAGMENT_ROUGHNESS)
      .replace('#include <normal_fragment_maps>', FRAGMENT_MICRO_RELIEF)
      .replace('#include <emissivemap_fragment>', FRAGMENT_EMISSIVE)
      .replace('#include <lights_physical_fragment>', FRAGMENT_CLEARCOAT_MASK)
      .replace('#include <opaque_fragment>', FRAGMENT_OPTICS)
  }
  material.customProgramCacheKey = () => `tooth-${kind}`
  return material
}

export interface ToothMaterials {
  effects: EffectUniforms
  anatomy: AnatomyUniforms
  uniforms: Record<ToothLayerKind, LayerUniforms>
  outer: THREE.MeshPhysicalMaterial
  dentin: THREE.MeshPhysicalMaterial
  pulp: THREE.MeshPhysicalMaterial
  vessels: THREE.MeshStandardMaterial[]
  ligament: THREE.MeshStandardMaterial
  junction: THREE.MeshStandardMaterial
  clippable: THREE.Material[]
}

export function createToothMaterials(params: ToothParams): ToothMaterials {
  const uniforms = {
    outer: createLayerUniforms(),
    dentin: createLayerUniforms(),
    pulp: createLayerUniforms(),
  }
  for (const layer of Object.values(uniforms)) layer.uCrownHeight.value = params.crownHeight
  const effects = createEffectUniforms()
  const anatomy = createAnatomyUniforms(params)
  const outer = createLayerMaterial('outer', uniforms.outer, effects, anatomy)
  const dentin = createLayerMaterial('dentin', uniforms.dentin, effects, anatomy)
  const pulp = createLayerMaterial('pulp', uniforms.pulp, effects, anatomy)
  const vessels = ['#e5383b', '#3d6fd9', '#f4c84a'].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, emissive: color, emissiveIntensity: 0.25 }),
  )
  const ligament = new THREE.MeshStandardMaterial({
    color: '#d98a7e',
    roughness: 0.7,
    emissive: '#0c566f',
    emissiveIntensity: 0,
    side: THREE.DoubleSide,
  })
  const junction = new THREE.MeshStandardMaterial({
    color: '#b8874a',
    roughness: 0.5,
    emissive: '#0c566f',
    emissiveIntensity: 0,
  })
  return {
    effects,
    anatomy,
    uniforms,
    outer,
    dentin,
    pulp,
    vessels,
    ligament,
    junction,
    clippable: [outer, dentin, pulp, ...vessels, ligament, junction],
  }
}

export const crackMaterial = new THREE.MeshBasicMaterial({ color: '#4a3b2e' })
