import { quizFocus } from '@/lib/data/quizFocus'
import { focusScene } from '@/lib/sceneFocus'
import { useAppStore } from '@/lib/store'

export function showQuestionInScene(questionId: string) {
  const focus = quizFocus[questionId]
  if (focus) focusScene(focus)
}

export function resetQuizScene() {
  const state = useAppStore.getState()
  state.selectTarget(null, null)
  state.requestCamera({ kind: 'reset' })
}
