import { computePeriodontalState, type PeriodontalState } from '@/lib/three/toothEffects'

export const periodontalFrame: { state: PeriodontalState } = {
  state: computePeriodontalState(null, 0),
}
