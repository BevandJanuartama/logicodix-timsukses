export type ReviewStatus = 'Draft' | 'Under Review' | 'Approved'

export type AppMode = 'explore' | 'diseases' | 'destroy' | 'clean' | 'quiz'

export type AnatomyObjectId =
  | 'enamel'
  | 'dentin'
  | 'pulp'
  | 'cementum'
  | 'gingiva'
  | 'pd_ligament'
  | 'alveolar_bone'
  | 'pulp_chamber'
  | 'root_canal'
  | 'cej'

export type OralRegionId =
  | 'interdental_papilla'
  | 'palate'
  | 'mouth_floor'
  | 'tongue_tip'
  | 'tongue_dorsum'
  | 'tongue_lateral'
  | 'tongue_base'

export type SceneTargetId = AnatomyObjectId | OralRegionId

export type Lod = 'macro' | 'meso' | 'micro'

export type CameraPreset = 'front' | 'top' | 'bottom' | 'left' | 'right'

export type CameraRequest =
  | { kind: 'preset'; preset: CameraPreset; distance?: number }
  | { kind: 'tooth'; toothId: string; section?: boolean }
  | { kind: 'zoom'; direction: 1 | -1 }
  | { kind: 'reset' }

export type CameraCommand = CameraRequest & { nonce: number }

export interface HoverTarget {
  key: string
  label: string
  toothId: string | null
}

export interface AnatomyStructure {
  id: string
  name: string
  tissueType: string
  description: string
  location: string
  relatedConditions: string[]
  objectId: AnatomyObjectId
  sourceLabel: string
  clinicalNote: string
  status: ReviewStatus
}

export interface ToothType {
  id: string
  name: string
  region: string
  function: string
  primaryCount: number
  permanentCount: number
  notes: string
}

export interface Disease {
  id: string
  name: string
  displayName: string
  category: string
  definition: string
  riskFactors: string
  symptoms: string
  affectedStructures: string
  prevention: string
  sourceIds: string[]
  safetyNote: string
  status: ReviewStatus
}

export interface DiseaseStage {
  id: string
  diseaseId: string
  stageNumber: number
  title: string
  description: string
  visualChange: string
  modelPath: string
  limitation: string
  status: ReviewStatus
}

export interface PreventionTopic {
  id: string
  topic: string
  message: string
  audience: string
  sourceLabel: string
  implementationNote: string
  status: ReviewStatus
}

export interface ModelAsset {
  id: string
  name: string
  modelType: string
  path: string
  meshIds: string[]
  license: string
  creator: string | null
  version: string
  reviewer: string | null
  status: ReviewStatus
  notes: string
}

export interface QuizQuestion {
  id: string
  topic: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  sourceIds: string[]
  status: ReviewStatus
}

export interface Reference {
  id: string
  institution: string
  title: string
  publication: string
  relevantContent: string
  url: string
  accessNote: string
  sourceType: string
}

export interface ResearchGap {
  id: string
  area: string
  dataNeeded: string
  reason: string
  suggestedSource: string
  owner: string | null
  status: string
}
