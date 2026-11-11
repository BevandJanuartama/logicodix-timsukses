import type * as THREE from 'three'
import { SURFACE_NOISE_GLSL } from '@/lib/three/shaderNoise'

export interface GingivaUniforms {
  [uniform: string]: THREE.IUniform
  uGumInflammation: { value: number }
}

export const createGingivaUniforms = (): GingivaUniforms => ({ uGumInflammation: { value: 0 } })

const VERTEX_DECLARATIONS = `
varying vec3 vGumPosition;
`

const VERTEX_POSITION = `
#include <begin_vertex>
vGumPosition = position;
`

const FRAGMENT_DECLARATIONS = `
uniform float uGumInflammation;
varying vec3 vGumPosition;
${SURFACE_NOISE_GLSL}
`

const FRAGMENT_COLOR = `
#include <color_fragment>
float gumMottle = valueNoise( vGumPosition * 7.0 );
float stipple = valueNoise( vGumPosition * 55.0 );
float stippleVisibility = detailVisibility( vGumPosition, 0.018 ) * ( 1.0 - 0.85 * uGumInflammation );
diffuseColor.rgb *= 0.95 + 0.08 * gumMottle;
diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * vec3( 0.9, 0.78, 0.94 ), uGumInflammation * gumMottle * 0.6 );
`

const FRAGMENT_ROUGHNESS = `
#include <roughnessmap_fragment>
roughnessFactor = mix( 0.4, 0.2, uGumInflammation ) * ( 0.85 + 0.3 * stipple * stippleVisibility );
`

const FRAGMENT_STIPPLING = `
#include <normal_fragment_maps>
normal = perturbSurfaceNormal( normal, - vViewPosition, stipple * stippleVisibility, 0.004, faceDirection );
`

const FRAGMENT_WETNESS = `
float gumFacing = saturate( dot( normal, geometryViewDir ) );
float salivaFilm = mix( 0.35, 0.75, uGumInflammation );
vec3 wetHighlight = vec3( 0.0 );
vec3 tissueScatter = vec3( 0.0 );
#if NUM_DIR_LIGHTS > 0
  #pragma unroll_loop_start
  for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
    wetHighlight += directionalLights[ i ].color * pow( saturate( dot( normal, normalize( directionalLights[ i ].direction + geometryViewDir ) ) ), 220.0 );
    tissueScatter += directionalLights[ i ].color * saturate( ( dot( normal, directionalLights[ i ].direction ) + 0.5 ) / 1.5 );
  }
  #pragma unroll_loop_end
#endif
outgoingLight += wetHighlight * schlickFresnel( gumFacing, 0.03 ) * salivaFilm * 2.2;
outgoingLight += tissueScatter * diffuseColor.rgb * vec3( 0.9, 0.22, 0.24 ) * 0.07;
#include <opaque_fragment>
`

export function applyGingivaSurface(material: THREE.MeshStandardMaterial, uniforms: GingivaUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
      .replace('#include <begin_vertex>', VERTEX_POSITION)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLARATIONS}`)
      .replace('#include <color_fragment>', FRAGMENT_COLOR)
      .replace('#include <roughnessmap_fragment>', FRAGMENT_ROUGHNESS)
      .replace('#include <normal_fragment_maps>', FRAGMENT_STIPPLING)
      .replace('#include <opaque_fragment>', FRAGMENT_WETNESS)
  }
  material.customProgramCacheKey = () => 'gingiva-surface'
  material.needsUpdate = true
}
