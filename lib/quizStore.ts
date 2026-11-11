import { create } from 'zustand'

interface QuizState {
  index: number
  selected: number | null
  checked: boolean
  answers: Record<string, number>
  select: (optionIndex: number) => void
  check: (questionId: string) => void
  next: () => void
  restart: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  index: 0,
  selected: null,
  checked: false,
  answers: {},
  select: (selected) => {
    if (!get().checked) set({ selected })
  },
  check: (questionId) => {
    const { selected, answers } = get()
    if (selected === null) return
    set({ checked: true, answers: { ...answers, [questionId]: selected } })
  },
  next: () => set((state) => ({ index: state.index + 1, selected: null, checked: false })),
  restart: () => set({ index: 0, selected: null, checked: false, answers: {} }),
}))
