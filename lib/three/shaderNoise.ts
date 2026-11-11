export const SURFACE_NOISE_GLSL = `
float latticeHash( vec3 cell ) {
  cell = fract( cell * 0.3183099 + 0.1 );
  cell *= 17.0;
  return fract( cell.x * cell.y * cell.z * ( cell.x + cell.y + cell.z ) );
}

float valueNoise( vec3 samplePoint ) {
  vec3 cell = floor( samplePoint );
  vec3 blend = fract( samplePoint );
  blend = blend * blend * ( 3.0 - 2.0 * blend );
  float lowerNear = mix( latticeHash( cell ), latticeHash( cell + vec3( 1.0, 0.0, 0.0 ) ), blend.x );
  float lowerFar = mix( latticeHash( cell + vec3( 0.0, 1.0, 0.0 ) ), latticeHash( cell + vec3( 1.0, 1.0, 0.0 ) ), blend.x );
  float upperNear = mix( latticeHash( cell + vec3( 0.0, 0.0, 1.0 ) ), latticeHash( cell + vec3( 1.0, 0.0, 1.0 ) ), blend.x );
  float upperFar = mix( latticeHash( cell + vec3( 0.0, 1.0, 1.0 ) ), latticeHash( cell + vec3( 1.0, 1.0, 1.0 ) ), blend.x );
  return mix( mix( lowerNear, lowerFar, blend.y ), mix( upperNear, upperFar, blend.y ), blend.z );
}

float detailVisibility( vec3 samplePoint, float period ) {
  float footprint = length( fwidth( samplePoint ) );
  return 1.0 - smoothstep( period * 0.25, period * 0.6, footprint );
}

vec3 perturbSurfaceNormal( vec3 surfaceNormal, vec3 surfacePosition, float height, float strength, float faceSign ) {
  vec3 positionDx = dFdx( surfacePosition );
  vec3 positionDy = dFdy( surfacePosition );
  float heightDx = dFdx( height ) * strength;
  float heightDy = dFdy( height ) * strength;
  vec3 axisX = cross( positionDy, surfaceNormal );
  vec3 axisY = cross( surfaceNormal, positionDx );
  float determinant = dot( positionDx, axisX ) * faceSign;
  if ( abs( determinant ) < 1e-12 ) return surfaceNormal;
  vec3 gradient = sign( determinant ) * ( heightDx * axisX + heightDy * axisY );
  return normalize( abs( determinant ) * surfaceNormal - gradient );
}

float schlickFresnel( float facing, float baseReflectance ) {
  return baseReflectance + ( 1.0 - baseReflectance ) * pow( 1.0 - facing, 5.0 );
}
`
