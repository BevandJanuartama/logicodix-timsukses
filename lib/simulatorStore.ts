import { create } from 'zustand'
import { stagesForDisease } from '@/lib/knowledgeBase'

export type HabitId = 'ice' | 'bruxism' | 'boba' | 'neglect'
export type ClinicalTrackId = 'DIS-001' | 'DIS-003'
export type SimulationTrack = ClinicalTrackId | HabitId

export const CLINICAL_TRACKS: ClinicalTrackId[] = ['DIS-001', 'DIS-003']

export const isClinicalTrack = (track: SimulationTrack | null): track is ClinicalTrackId =>
  track !== null && (CLINICAL_TRACKS as string[]).includes(track)

export const simulationClock = { progress: 0 }

interface SimulatorState {
  track: SimulationTrack | null
  stageIndex: number
  progress: number
  playing: boolean
  speed: number
  setTrack: (track: SimulationTrack | null) => void
  setStageIndex: (stageIndex: number) => void
  setProgress: (progress: number) => void
  setPlaying: (playing: boolean) => void
  setSpeed: (speed: number) => void
  syncProgress: (progress: number, finished: boolean) => void
}

export const stageTarget = (track: ClinicalTrackId, stageIndex: number) => {
  const lastStage = Math.max(1, stagesForDisease(track).length - 1)
  return stageIndex / lastStage
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  track: null,
  stageIndex: 0,
  progress: 0,
  playing: false,
  speed: 1,
  setTrack: (track) => {
    simulationClock.progress = 0
    set({ track, stageIndex: 0, progress: 0, playing: track !== null && !isClinicalTrack(track) })
  },
  setStageIndex: (stageIndex) => set({ stageIndex }),
  setProgress: (progress) => {
    simulationClock.progress = progress
    set({ progress })
  },
  setPlaying: (playing) => {
    if (playing && get().progress >= 0.999) {
      simulationClock.progress = 0
      set({ progress: 0 })
    }
    set({ playing })
  },
  setSpeed: (speed) => set({ speed }),
  syncProgress: (progress, finished) => set(finished ? { progress, playing: false } : { progress }),
}))
