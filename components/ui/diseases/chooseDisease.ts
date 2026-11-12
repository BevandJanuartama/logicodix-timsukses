import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { focusScene } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'

export function chooseDisease(diseaseId: string | null) {
  useAppStore.getState().selectDisease(diseaseId)
  const focus = diseaseId ? diseaseLinks[diseaseId]?.focus : undefined
  if (focus) focusScene(focus)
}
