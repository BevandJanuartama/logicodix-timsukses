export const STEPHAN_DURATION_MINUTES = 120
export const STEPHAN_CRITICAL_PH = 5.5
export const STEPHAN_RESTING_PH = 7

const MAX_PH_DROP = 2.5
const PH_DROP_PER_EXPOSURE = 2.3
const DROP_RAMP_MINUTES = 3
const RECOVERY_TIME_CONSTANT = 20

export interface StephanScenario {
  id: string
  label: string
  caption: string
  exposures: number[]
}

const evenlySpaced = (count: number, interval: number) => Array.from({ length: count }, (_, i) => i * interval)

export const stephanScenarios: StephanScenario[] = [
  { id: 'once', label: '1× habis', caption: 'Diminum sekali habis', exposures: [0] },
  { id: 'twice', label: '2× jeda 1 jam', caption: 'Dua sesi, berjarak 1 jam', exposures: [0, 60] },
  { id: 'sip-hour', label: 'Seruput 1 jam', caption: 'Diseruput selama 1 jam', exposures: evenlySpaced(11, 6) },
  { id: 'sip-two-hours', label: 'Seruput 2 jam', caption: 'Diseruput selama 2 jam', exposures: evenlySpaced(20, 6) },
]

export function plaquePhAt(minute: number, exposures: number[]) {
  const drop = exposures.reduce((sum, exposure) => {
    const since = minute - exposure
    if (since < 0) return sum
    const ramp = since < DROP_RAMP_MINUTES ? since / DROP_RAMP_MINUTES : Math.exp(-(since - DROP_RAMP_MINUTES) / RECOVERY_TIME_CONSTANT)
    return sum + PH_DROP_PER_EXPOSURE * ramp
  }, 0)
  return STEPHAN_RESTING_PH - Math.min(drop, MAX_PH_DROP)
}

export const stephanMinutes = Array.from({ length: STEPHAN_DURATION_MINUTES + 1 }, (_, i) => i)

export const minutesBelowCriticalPh = (exposures: number[]) =>
  stephanMinutes.filter((minute) => plaquePhAt(minute, exposures) < STEPHAN_CRITICAL_PH).length
