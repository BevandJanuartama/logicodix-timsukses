import { CEJ_GLSL } from '@/lib/three/cejContour'
import { SURFACE_NOISE_GLSL } from '@/lib/three/shaderNoise'

export const VERTEX_DECLARATIONS = `
uniform vec3 uFlatNormal;
uniform float uFlatDistance;
uniform vec3 uDecayCenter;
uniform float uDecay;
uniform float uDecayRadius;
uniform float uDecayDepth;
varying vec3 vLocalPos;
varying float vFlattened;
`

export const VERTEX_NORMAL = `
vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
  vec3 objectTangent = vec3( tangent.xyz );
#endif
float flatOvershoot = dot( position, uFlatNormal ) - uFlatDistance;
if ( flatOvershoot > 0.0 ) objectNormal = uFlatNormal;
`

export const VERTEX_POSITION = `
vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
  vPosition = vec3( position );
#endif
vFlattened = 0.0;
if ( flatOvershoot > 0.0 ) { transformed -= flatOvershoot * uFlatNormal; vFlattened = 1.0; }
float decayDistance = length( position - uDecayCenter );
float decayReach = uDecayRadius * ( 0.3 + 0.7 * uDecay );
float cavity = uDecayDepth * smoothstep( 0.25, 1.0, uDecay ) * ( 1.0 - smoothstep( decayReach * 0.3, decayReach * 0.85, decayDistance ) );
transformed -= normal * cavity;
vLocalPos = position;
`

export const FRAGMENT_DECLARATIONS = `
uniform vec2 uHighlightBand;
uniform vec2 uShowBand;
uniform float uCrownHeight;
uniform float uDecay;
uniform vec3 uDecayCenter;
uniform float uDecayRadius;
uniform float uStain;
uniform float uFlatExposure;
uniform float uInflammation;
uniform float uTime;
uniform float uCejCurve;
uniform vec2 uToothSpan;
uniform float uRootLength;
uniform float uCutaway;
varying vec3 vLocalPos;
varying float vFlattened;
${SURFACE_NOISE_GLSL}
${CEJ_GLSL}
`

export const FRAGMENT_BAND_DISCARD = `
#include <clipping_planes_fragment>
float cervicalLine = 0.0;
#ifdef TOOTH_OUTER
  cervicalLine = cejHeight( vLocalPos );
#endif
float upperBand = step( cervicalLine, vLocalPos.y );
if ( mix( uShowBand.y, uShowBand.x, upperBand ) < 0.5 ) discard;
float crownT = clamp( vLocalPos.y / max( uCrownHeight, 0.01 ), 0.0, 1.0 );
float rootMix = 1.0 - smoothstep( cervicalLine - 0.03, cervicalLine + 0.04, vLocalPos.y );
float enamelMask = 0.0;
#ifdef TOOTH_OUTER
  enamelMask = 1.0 - rootMix;
#endif
float microNoise = valueNoise( vLocalPos * 90.0 );
`

export const FRAGMENT_COLOR = `
#include <color_fragment>
vec3 toothColor = diffuseColor.rgb;
#ifdef TOOTH_OUTER
  float cementumLamellae = 0.5 + 0.5 * sin( vLocalPos.y * 150.0 + microNoise * 4.0 );
  float lamellaeVisibility = detailVisibility( vLocalPos, 0.042 ) * ( 0.4 + 0.6 * uCutaway );
  vec3 cementumTone = vec3( 0.86, 0.73, 0.53 ) * ( 0.95 + 0.08 * cementumLamellae * lamellaeVisibility );
  toothColor = mix( toothColor, cementumTone, rootMix );
  toothColor = mix( toothColor, toothColor * vec3( 0.9, 0.95, 1.04 ), smoothstep( 0.72, 1.0, crownT ) * enamelMask * 0.7 );
  toothColor *= 0.975 + 0.05 * microNoise * enamelMask;
  float stainAmount = uStain * ( 0.45 + 0.55 * ( 1.0 - crownT ) );
  toothColor = mix( toothColor, vec3( 0.64, 0.5, 0.28 ), clamp( stainAmount, 0.0, 0.8 ) );
  toothColor = mix( toothColor, vec3( 0.88, 0.73, 0.44 ), clamp( vFlattened, 0.0, 1.0 ) * uFlatExposure );
#endif
#ifdef TOOTH_DENTIN
  float tubuleAngle = atan( vLocalPos.z, vLocalPos.x ) + 0.35 * sin( vLocalPos.y * 7.0 );
  float tubuleLines = pow( abs( sin( tubuleAngle * 140.0 + microNoise * 2.5 ) ), 6.0 );
  float tubuleVisibility = uCutaway * detailVisibility( vLocalPos, 0.02 );
  toothColor *= 0.95 + 0.08 * valueNoise( vLocalPos * 18.0 );
  toothColor = mix( toothColor, toothColor * vec3( 0.84, 0.74, 0.58 ), tubuleLines * 0.4 * tubuleVisibility );
#endif
#ifdef TOOTH_PULP
  toothColor *= 0.9 + 0.16 * valueNoise( vLocalPos * 30.0 );
  float pulse = 0.5 + 0.5 * sin( uTime * 5.0 );
  toothColor = mix( toothColor, vec3( 0.78, 0.04, 0.07 ) * ( 0.8 + 0.4 * pulse ), clamp( uInflammation * 1.4, 0.0, 1.0 ) );
  toothColor = mix( toothColor, vec3( 0.24, 0.17, 0.14 ), smoothstep( 0.8, 1.0, uInflammation ) );
#else
  if ( uDecay > 0.001 ) {
    float lesionDistance = length( vLocalPos - uDecayCenter );
    float lesionReach = uDecayRadius * ( 0.3 + 0.7 * uDecay );
    float spot = 1.0 - smoothstep( lesionReach * 0.8, lesionReach, lesionDistance );
    vec3 lesionColor = mix( vec3( 0.98, 0.97, 0.93 ), vec3( 0.45, 0.29, 0.13 ), smoothstep( 0.18, 0.45, uDecay ) );
    float core = 1.0 - smoothstep( lesionReach * 0.15, lesionReach * 0.6, lesionDistance );
    lesionColor = mix( lesionColor, vec3( 0.07, 0.05, 0.03 ), core * smoothstep( 0.35, 0.8, uDecay ) );
    toothColor = mix( toothColor, lesionColor, spot );
  }
#endif
diffuseColor.rgb = toothColor;
`
