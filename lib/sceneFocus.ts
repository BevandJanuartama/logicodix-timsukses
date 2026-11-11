import { useAppStore } from '@/lib/store'
import type { CameraPreset, SceneTargetId } from '@/lib/types'

export interface SceneFocus {
  toothId?: string
  objectId?: SceneTargetId
  section?: boolean
  preset?: CameraPreset
}

const OVERVIEW_DISTANCE = 7.5

export function focusScene(focus: SceneFocus) {
  const state = useAppStore.getState()
  state.setIntro(false)
  state.selectTarget(focus.toothId ?? null, focus.objectId ?? null)
  if (focus.toothId) {
    state.setCutaway(Boolean(focus.section))
    state.requestCamera({ kind: 'tooth', toothId: focus.toothId, section: focus.section })
    return
  }
  state.requestCamera({ kind: 'preset', preset: focus.preset ?? 'front', distance: OVERVIEW_DISTANCE })
}
