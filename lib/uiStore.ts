import { create } from 'zustand'

export type SheetPosition = 'peek' | 'half' | 'full'

/** localStorage flag: the onboarding coachmark was finished or skipped once. */
export const TUTORIAL_SEEN_KEY = 'dentasscope_tutorial_seen'

export function readTutorialSeen() {
  try {
    return window.localStorage.getItem(TUTORIAL_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function writeTutorialSeen() {
  try {
    window.localStorage.setItem(TUTORIAL_SEEN_KEY, '1')
  } catch {
    // Private mode / blocked storage: the tutorial simply shows again next visit.
  }
}

interface UiState {
  tutorialOpen: boolean
  /** Where the mobile bottom sheet currently rests (floating controls hide when it covers the stage). */
  sheetPosition: SheetPosition
  openTutorial: () => void
  closeTutorial: () => void
  setSheetPosition: (sheetPosition: SheetPosition) => void
}

/** Shell-only UI state, kept out of the scene store so 3D components never re-render for it. */
export const useUiStore = create<UiState>((set) => ({
  tutorialOpen: false,
  sheetPosition: 'peek',
  openTutorial: () => set({ tutorialOpen: true }),
  closeTutorial: () => {
    writeTutorialSeen()
    set({ tutorialOpen: false })
  },
  setSheetPosition: (sheetPosition) => set({ sheetPosition }),
}))
