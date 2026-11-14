import { toDentitionToothId } from '@/lib/data/dentition'
import { renderedDentition, useAppStore } from '@/lib/store'
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
  // Focus targets are authored with permanent ids; land on the equivalent tooth when primary teeth are shown.
  const toothId = focus.overview || !focus.toothId ? null : toDentitionToothId(focus.toothId, renderedDentition(state))
  state.selectTarget(toothId, focus.objectId ?? null)
  const gingiva = focus.objectId === 'gingiva' && !focus.section && !focus.overview
  if (toothId) {
    state.setCutaway(Boolean(focus.section))
    state.requestCamera(gingiva ? { kind: 'gingiva', toothId } : { kind: 'tooth', toothId, section: focus.section })
    return
  }
  if (gingiva) {
    state.requestCamera({ kind: 'gingiva' })
    return
  }
  state.requestCamera({ kind: 'preset', preset: focus.preset ?? 'front', distance: overviewDistance() })
}
