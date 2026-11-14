import { create } from 'zustand'
import { toDentitionToothId } from '@/lib/data/dentition'
import type {
  AnatomyObjectId,
  AppMode,
  CameraCommand,
  CameraRequest,
  ComparisonMode,
  Dentition,
  JawSection,
  SectionAxis,
  HoverTarget,
  Lod,
  SceneTargetId,
} from '@/lib/types'

export type LayerVisibility = Record<AnatomyObjectId, boolean>


const allLayersVisible: LayerVisibility = {
  enamel: true,
  dentin: true,
  pulp: true,
  cementum: true,
  gingiva: true,
  pd_ligament: true,
  alveolar_bone: true,
  pulp_chamber: true,
  root_canal: true,
  cej: true,
}

interface AppState {
  mode: AppMode
  /** The dentition the user picked; see `renderedDentition` for what the scene actually shows. */
  dentition: Dentition
  /** Explore-only: show primary and permanent jaws together (side by side, or primary as a translucent overlay). */
  comparisonMode: ComparisonMode
  overlayOpacity: number
  /** Explore-only cross-section through every jaw on screen. */
  jawSection: JawSection
  intro: boolean
  selectedObjectId: SceneTargetId | null
  selectedToothId: string | null
  selectedDiseaseId: string | null
  layers: LayerVisibility
  hover: HoverTarget | null
  lod: Lod
  zoomLevel: number
  cutaway: boolean
  cameraCommand: CameraCommand | null
  hotspotTouched: boolean
  showNormalPose: boolean
  thumbnails: Record<string, string>
  sceneReady: boolean
  sceneFailed: boolean
  setMode: (mode: AppMode) => void
  setDentition: (dentition: Dentition) => void
  setComparisonMode: (comparisonMode: ComparisonMode) => void
  setOverlayOpacity: (overlayOpacity: number) => void
  setJawSection: (patch: Partial<JawSection>) => void
  closeJawSection: () => void
  setIntro: (intro: boolean) => void
  selectObject: (objectId: SceneTargetId | null) => void
  selectTooth: (toothId: string | null) => void
  selectTarget: (toothId: string | null, objectId: SceneTargetId | null) => void
  selectDisease: (diseaseId: string | null) => void
  setShowNormalPose: (showNormalPose: boolean) => void
  toggleLayer: (objectId: AnatomyObjectId) => void
  resetLayers: () => void
  setHover: (hover: HoverTarget | null) => void
  setLod: (lod: Lod) => void
  setZoomLevel: (zoomLevel: number) => void
  setCutaway: (cutaway: boolean) => void
  requestCamera: (request: CameraRequest) => void
  markHotspotTouched: () => void
  setThumbnail: (id: string, dataUrl: string) => void
  markSceneReady: () => void
  markSceneFailed: () => void
  resetScene: () => void
}

let cameraNonce = 0

/**
 * Default cut per axis: sagittal through the middle of the right central incisors (classic enamel/dentin/pulp
 * profile), frontal through the premolar / first-molar region of both sides.
 */
export const SECTION_DEFAULT_POSITION: Record<SectionAxis, number> = { sagittal: 0.56, frontal: 0.45 }

/** Modes whose content is generic enough to run on either dentition; the rest reference permanent teeth by id. */
const DENTITION_AWARE_MODES: readonly AppMode[] = ['explore', 'clean']

const comparing = (mode: AppMode, comparisonMode: ComparisonMode) => mode === 'explore' && comparisonMode !== 'off'

/** While comparing, the interactive (main) jaws are always permanent; the primary set is the comparison layer. */
export const renderedDentitionFor = (mode: AppMode, dentition: Dentition, comparisonMode: ComparisonMode = 'off'): Dentition =>
  DENTITION_AWARE_MODES.includes(mode) && !comparing(mode, comparisonMode) ? dentition : 'permanent'

const clearedSelection = { selectedToothId: null, selectedObjectId: null, cutaway: false, hover: null }

/** When the rendered teeth change, keep the selection on the equivalent tooth instead of dropping it. */
const carrySelection = (selectedToothId: string | null, next: Dentition) => ({
  selectedToothId: selectedToothId && toDentitionToothId(selectedToothId, next),
  cutaway: false,
  hover: null,
})

export const useAppStore = create<AppState>((set) => ({
  mode: 'explore',
  dentition: 'permanent',
  comparisonMode: 'off',
  overlayOpacity: 0.6,
  jawSection: { active: false, axis: 'frontal', position: SECTION_DEFAULT_POSITION.frontal },
  intro: true,
  selectedObjectId: null,
  selectedToothId: null,
  selectedDiseaseId: null,
  layers: allLayersVisible,
  hover: null,
  lod: 'macro',
  zoomLevel: 0,
  cutaway: false,
  cameraCommand: null,
  hotspotTouched: false,
  showNormalPose: false,
  thumbnails: {},
  sceneReady: false,
  sceneFailed: false,
  setMode: (mode) =>
    set((state) => {
      const next = renderedDentitionFor(mode, state.dentition, state.comparisonMode)
      const swapsTeeth = next !== renderedDentitionFor(state.mode, state.dentition, state.comparisonMode)
      if (mode === 'clean') return { mode, intro: false, ...clearedSelection }
      return { mode, intro: false, hover: null, ...(swapsTeeth ? carrySelection(state.selectedToothId, next) : {}) }
    }),
  setDentition: (dentition) =>
    set((state) => {
      if (state.dentition === dentition) return {}
      const before = renderedDentitionFor(state.mode, state.dentition, state.comparisonMode)
      const after = renderedDentitionFor(state.mode, dentition, state.comparisonMode)
      return { dentition, ...(before !== after ? carrySelection(state.selectedToothId, after) : {}) }
    }),
  setComparisonMode: (comparisonMode) =>
    set((state) => (state.comparisonMode === comparisonMode ? {} : { comparisonMode, intro: false, ...clearedSelection })),
  setOverlayOpacity: (overlayOpacity) => set({ overlayOpacity: Math.min(1, Math.max(0.1, overlayOpacity)) }),
  setJawSection: (patch) =>
    set((state) => {
      const axisChanged = patch.axis !== undefined && patch.axis !== state.jawSection.axis
      const position = patch.position ?? (axisChanged ? SECTION_DEFAULT_POSITION[patch.axis!] : state.jawSection.position)
      const next = { ...state.jawSection, ...patch, position: Math.min(1, Math.max(0, position)) }
      // Turning the jaw cut on yields the single-tooth cutaway so the whole-jaw cut actually takes effect.
      return { jawSection: next, intro: false, ...(patch.active && !state.jawSection.active ? { cutaway: false, hover: null } : {}) }
    }),
  closeJawSection: () => set((state) => ({ jawSection: { ...state.jawSection, active: false } })),
  setIntro: (intro) => set({ intro }),
  selectObject: (selectedObjectId) => set({ selectedObjectId }),
  selectTooth: (selectedToothId) => set(selectedToothId ? { selectedToothId } : { selectedToothId, cutaway: false }),
  selectTarget: (selectedToothId, selectedObjectId) =>
    set(selectedToothId ? { selectedToothId, selectedObjectId } : { selectedToothId, selectedObjectId, cutaway: false }),
  selectDisease: (selectedDiseaseId) => set({ selectedDiseaseId, showNormalPose: false }),
  setShowNormalPose: (showNormalPose) => set({ showNormalPose }),
  toggleLayer: (objectId) => set((state) => ({ layers: { ...state.layers, [objectId]: !state.layers[objectId] } })),
  resetLayers: () => set({ layers: allLayersVisible }),
  setHover: (hover) => set({ hover }),
  setLod: (lod) => set({ lod }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setCutaway: (cutaway) => set({ cutaway }),
  requestCamera: (request) => set({ cameraCommand: { ...request, nonce: ++cameraNonce } }),
  markHotspotTouched: () => set({ hotspotTouched: true }),
  setThumbnail: (id, dataUrl) => set((state) => ({ thumbnails: { ...state.thumbnails, [id]: dataUrl } })),
  markSceneReady: () => set({ sceneReady: true }),
  markSceneFailed: () => set({ sceneFailed: true }),
  resetScene: () => set({ sceneReady: false, sceneFailed: false }),
}))

export const sectionedToothOf = (state: AppState) =>
  state.mode !== 'clean' && state.selectedToothId && (state.cutaway || state.lod === 'micro') ? state.selectedToothId : null

export const renderedDentition = (state: Pick<AppState, 'mode' | 'dentition' | 'comparisonMode'>) =>
  renderedDentitionFor(state.mode, state.dentition, state.comparisonMode)

/** The comparison layer actually on screen ('off' outside explore). */
export const activeComparison = (state: Pick<AppState, 'mode' | 'comparisonMode'>): ComparisonMode =>
  comparing(state.mode, state.comparisonMode) ? state.comparisonMode : 'off'

/**
 * Whole-jaw cut actually applied. A single-tooth section (sectionedToothOf) has priority: while it is open the jaw
 * cut steps aside and comes back when the tooth section closes.
 */
export const jawSectionOn = (state: AppState) => state.mode === 'explore' && state.jawSection.active && !sectionedToothOf(state)
