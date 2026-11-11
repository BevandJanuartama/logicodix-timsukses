import { habitCamera } from '@/lib/data/habitScenarios'
import { focusScene } from '@/lib/sceneFocus'
import { isClinicalTrack, useSimulatorStore, type ClinicalTrackId, type SimulationTrack } from '@/lib/simulatorStore'
import { useAppStore } from '@/lib/store'

export const clinicalFocusTooth: Record<ClinicalTrackId, string> = {
  'DIS-001': '36',
  'DIS-003': '41',
}

export function openSimulatorTrack(track: SimulationTrack) {
  const app = useAppStore.getState()
  if (app.mode !== 'destroy') app.setMode('destroy')
  useSimulatorStore.getState().setTrack(track)
  if (isClinicalTrack(track)) {
    focusScene({ toothId: clinicalFocusTooth[track] })
    return
  }
  app.selectTarget(null, null)
  app.requestCamera({ kind: 'preset', preset: habitCamera[track].preset, distance: habitCamera[track].distance })
}
