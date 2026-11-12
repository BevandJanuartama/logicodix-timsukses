export const FRAGMENT_ROUGHNESS = `
#include <roughnessmap_fragment>
#ifdef TOOTH_OUTER
  roughnessFactor = mix( roughnessFactor, 0.62, rootMix ) * ( 0.82 + 0.36 * microNoise );
  roughnessFactor = clamp( roughnessFactor + 0.25 * uStain + 0.3 * vFlattened * uFlatExposure, 0.08, 1.0 );
#endif
#ifdef TOOTH_DENTIN
  roughnessFactor *= 0.9 + 0.2 * microNoise;
#endif
#ifdef TOOTH_PULP
  roughnessFactor *= 0.75 + 0.25 * microNoise;
#endif
`

export const FRAGMENT_MICRO_RELIEF = `
#include <normal_fragment_maps>
float surfaceRelief = 0.0;
float reliefStrength = 0.0;
#ifdef TOOTH_OUTER
  float perikymata = 0.5 + 0.5 * sin( vLocalPos.y * 260.0 + microNoise * 1.5 );
  float enamelRelief = mix( microNoise, perikymata, 0.6 * detailVisibility( vLocalPos, 0.024 ) );
  surfaceRelief = mix( cementumLamellae * lamellaeVisibility, enamelRelief, enamelMask );
  reliefStrength = mix( 0.003, 0.0022, enamelMask );
#endif
#ifdef TOOTH_DENTIN
  surfaceRelief = tubuleLines * tubuleVisibility;
  reliefStrength = 0.0025;
#endif
normal = perturbSurfaceNormal( normal, - vViewPosition, surfaceRelief, reliefStrength, faceDirection );
`

export const FRAGMENT_CLEARCOAT_MASK = `
#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
  material.clearcoat *= enamelMask * ( 1.0 - 0.7 * clamp( uStain, 0.0, 1.0 ) );
#endif
`

export const FRAGMENT_OPTICS = `
float opticsFacing = saturate( dot( normal, geometryViewDir ) );
#ifdef TOOTH_OUTER
  float translucency = enamelMask * mix( 0.35, 1.0, smoothstep( 0.45, 1.0, crownT ) );
  vec3 scatteredLight = vec3( 0.0 );
  #if NUM_DIR_LIGHTS > 0
    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      scatteredLight += directionalLights[ i ].color * ( 0.1 * saturate( ( dot( normal, directionalLights[ i ].direction ) + 0.6 ) / 1.6 ) + 0.5 * pow( saturate( dot( geometryViewDir, - normalize( directionalLights[ i ].direction + normal * 0.4 ) ) ), 3.0 ) );
    }
    #pragma unroll_loop_end
  #endif
  outgoingLight += scatteredLight * diffuseColor.rgb * vec3( 1.0, 0.8, 0.6 ) * translucency;
  vec3 opalescentRim = mix( vec3( 1.0, 0.93, 0.84 ), vec3( 0.74, 0.86, 1.0 ), smoothstep( 0.55, 1.0, crownT ) );
  outgoingLight += opalescentRim * pow( 1.0 - opticsFacing, 4.0 ) * ( 0.05 + 0.2 * enamelMask );
  outgoingLight += vec3( 0.76, 0.13, 0.05 ) * uRimGlow * pow( 1.0 - opticsFacing, 1.8 );
#endif
#ifdef TOOTH_DENTIN
  outgoingLight += vec3( 0.9, 0.68, 0.42 ) * pow( 1.0 - opticsFacing, 3.0 ) * ( 0.04 + 0.06 * uCutaway );
#endif
#ifdef TOOTH_PULP
  outgoingLight += vec3( 1.0, 0.72, 0.72 ) * schlickFresnel( opticsFacing, 0.02 ) * 0.14;
#endif
#include <opaque_fragment>
`

export const FRAGMENT_EMISSIVE = `
#include <emissivemap_fragment>
totalEmissiveRadiance += mix( uHighlightBand.y, uHighlightBand.x, upperBand ) * vec3( 0.05, 0.34, 0.44 );
#ifdef TOOTH_PULP
  float cardiacPhase = fract( uTime * 1.15 - vLocalPos.y * 0.45 );
  float heartbeat = smoothstep( 0.0, 0.04, cardiacPhase ) * ( exp( -14.0 * cardiacPhase ) + 0.4 * exp( -40.0 * abs( cardiacPhase - 0.24 ) ) );
  float apicalGlow = 1.0 - smoothstep( -uRootLength, -0.6 * uRootLength, vLocalPos.y );
  totalEmissiveRadiance += vec3( 0.42, 0.05, 0.07 ) * ( 0.06 + 0.16 * heartbeat ) * ( 0.7 + 0.9 * apicalGlow );
  totalEmissiveRadiance += vec3( 0.28, 0.02, 0.03 ) * uInflammation * ( 0.5 + 0.5 * sin( uTime * 5.0 ) );
#endif
`
