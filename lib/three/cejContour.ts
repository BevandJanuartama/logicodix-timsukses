import type { ToothKind } from '@/lib/three/layout'

export const CEJ_CURVATURE: Record<ToothKind, number> = {
  incisor: 0.16,
  canine: 0.13,
  premolar: 0.09,
  molar: 0.05,
}

const CEJ_BASELINE = 0.15
const CEJ_SWING = 0.5

export function cejHeightAt(kind: ToothKind, phi: number) {
  return CEJ_CURVATURE[kind] * (CEJ_BASELINE - CEJ_SWING * Math.cos(2 * phi))
}

export const CEJ_GLSL = `
float cejHeight( vec3 localPosition ) {
  vec2 span = localPosition.xz / max( uToothSpan, vec2( 0.01 ) );
  float facialness = ( span.y * span.y - span.x * span.x ) / max( dot( span, span ), 1e-4 );
  return uCejCurve * ( ${CEJ_BASELINE.toFixed(2)} - ${CEJ_SWING.toFixed(2)} * facialness );
}
`
