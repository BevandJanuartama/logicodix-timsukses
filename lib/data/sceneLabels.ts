import type { SceneTargetId } from '@/lib/types'

export const sceneTargetLabels: Record<SceneTargetId, string> = {
  enamel: 'Enamel (Email)',
  dentin: 'Dentin',
  pulp: 'Pulpa',
  cementum: 'Sementum',
  gingiva: 'Gingiva (Gusi)',
  pd_ligament: 'Ligamen Periodontal',
  alveolar_bone: 'Tulang Alveolar',
  pulp_chamber: 'Kamar Pulpa',
  root_canal: 'Saluran Akar',
  cej: 'Cementoenamel Junction',
  interdental_papilla: 'Papila Interdental',
  palate: 'Langit-langit (Palatum)',
  mouth_floor: 'Dasar Mulut',
  tongue_tip: 'Ujung Lidah',
  tongue_dorsum: 'Punggung Lidah',
  tongue_lateral: 'Tepi Lidah',
  tongue_base: 'Pangkal Lidah',
}

export const layerOrder = [
  'gingiva',
  'alveolar_bone',
  'pd_ligament',
  'cementum',
  'cej',
  'enamel',
  'dentin',
  'pulp_chamber',
  'root_canal',
  'pulp',
] as const

export const layerSwatches: Record<(typeof layerOrder)[number], string> = {
  gingiva: '#ec8f9b',
  alveolar_bone: '#e6d9bb',
  pd_ligament: '#d98a7e',
  cementum: '#e9d6a8',
  cej: '#b8874a',
  enamel: '#f5f2ea',
  dentin: '#e9cf94',
  pulp_chamber: '#d9576a',
  root_canal: '#b8434f',
  pulp: '#e5383b',
}
