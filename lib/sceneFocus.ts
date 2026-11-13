import { useAppStore } from '@/lib/store'
import type { CameraPreset, SceneTargetId } from '@/lib/types'

export interface SceneFocus {
  toothId?: string
  objectId?: SceneTargetId
  section?: boolean
  preset?: CameraPreset
  overview?: boolean
}

const OVERVIEW_DISTANCE = 7.5
const NARROW_OVERVIEW_FACTOR = 1.5
const NARROW_QUERY = '(max-width: 767px)'

const overviewDistance = () => OVERVIEW_DISTANCE * (window.matchMedia(NARROW_QUERY).matches ? NARROW_OVERVIEW_FACTOR : 1)

export function focusScene(focus: SceneFocus) {
  const state = useAppStore.getState()
  state.setIntro(false)
  const toothId = focus.overview ? null : (focus.toothId ?? null)
  state.selectTarget(toothId, focus.objectId ?? null)
  if (toothId) {
    state.setCutaway(Boolean(focus.section))
    state.requestCamera({ kind: 'tooth', toothId, section: focus.section })
    return
  }
  state.requestCamera({ kind: 'preset', preset: focus.preset ?? 'front', distance: overviewDistance() })
}
