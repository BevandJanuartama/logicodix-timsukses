import { create } from 'zustand'
import type {
  AnatomyObjectId,
  AppMode,
  CameraCommand,
  CameraRequest,
  HoverTarget,
  Lod,
  SceneTargetId,
} from '@/lib/types'

export type LayerVisibility = Record<AnatomyObjectId, boolean>

export type ModalKind = 'references' | 'governance' | null

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
  intro: boolean
  selectedObjectId: SceneTargetId | null
  selectedToothId: string | null
  selectedDiseaseId: string | null
  layers: LayerVisibility
  modal: ModalKind
  focusedReferenceId: string | null
  hover: HoverTarget | null
  lod: Lod
  zoomLevel: number
  cutaway: boolean
  cameraCommand: CameraCommand | null
  hotspotTouched: boolean
  thumbnails: Record<string, string>
  setMode: (mode: AppMode) => void
  setIntro: (intro: boolean) => void
  selectObject: (objectId: SceneTargetId | null) => void
  selectTooth: (toothId: string | null) => void
  selectTarget: (toothId: string | null, objectId: SceneTargetId | null) => void
  selectDisease: (diseaseId: string | null) => void
  toggleLayer: (objectId: AnatomyObjectId) => void
  resetLayers: () => void
  openModal: (modal: Exclude<ModalKind, null>, referenceId?: string) => void
  closeModal: () => void
  setHover: (hover: HoverTarget | null) => void
  setLod: (lod: Lod) => void
  setZoomLevel: (zoomLevel: number) => void
  setCutaway: (cutaway: boolean) => void
  requestCamera: (request: CameraRequest) => void
  markHotspotTouched: () => void
  setThumbnail: (id: string, dataUrl: string) => void
}

let cameraNonce = 0

export const useAppStore = create<AppState>((set) => ({
  mode: 'explore',
  intro: true,
  selectedObjectId: null,
  selectedToothId: null,
  selectedDiseaseId: null,
  layers: allLayersVisible,
  modal: null,
  focusedReferenceId: null,
  hover: null,
  lod: 'macro',
  zoomLevel: 0,
  cutaway: false,
  cameraCommand: null,
  hotspotTouched: false,
  thumbnails: {},
  setMode: (mode) => set({ mode, intro: false, hover: null, ...(mode === 'clean' ? { selectedToothId: null, selectedObjectId: null, cutaway: false } : {}) }),
  setIntro: (intro) => set({ intro }),
  selectObject: (selectedObjectId) => set({ selectedObjectId }),
  selectTooth: (selectedToothId) => set(selectedToothId ? { selectedToothId } : { selectedToothId, cutaway: false }),
  selectTarget: (selectedToothId, selectedObjectId) =>
    set(selectedToothId ? { selectedToothId, selectedObjectId } : { selectedToothId, selectedObjectId, cutaway: false }),
  selectDisease: (selectedDiseaseId) => set({ selectedDiseaseId }),
  toggleLayer: (objectId) => set((state) => ({ layers: { ...state.layers, [objectId]: !state.layers[objectId] } })),
  resetLayers: () => set({ layers: allLayersVisible }),
  openModal: (modal, focusedReferenceId) => set({ modal, focusedReferenceId: focusedReferenceId ?? null }),
  closeModal: () => set({ modal: null, focusedReferenceId: null }),
  setHover: (hover) => set({ hover }),
  setLod: (lod) => set({ lod }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setCutaway: (cutaway) => set({ cutaway }),
  requestCamera: (request) => set({ cameraCommand: { ...request, nonce: ++cameraNonce } }),
  markHotspotTouched: () => set({ hotspotTouched: true }),
  setThumbnail: (id, dataUrl) => set((state) => ({ thumbnails: { ...state.thumbnails, [id]: dataUrl } })),
}))

export const sectionedToothOf = (state: AppState) =>
  state.mode !== 'clean' && state.selectedToothId && (state.cutaway || state.lod === 'micro') ? state.selectedToothId : null
