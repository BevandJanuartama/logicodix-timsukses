import type { SceneTargetId } from '@/lib/types'

export const sceneTargetLabels: Record<SceneTargetId, string> = {
  enamel: 'Email gigi',
  dentin: 'Lapisan tengah (dentin)',
  pulp: 'Pulpa, bagian paling dalam',
  cementum: 'Lapisan akar (sementum)',
  gingiva: 'Gusi',
  pd_ligament: 'Ligamen pengikat gigi',
  alveolar_bone: 'Tulang penyangga gigi',
  pulp_chamber: 'Ruang pulpa',
  root_canal: 'Saluran akar',
  cej: 'Batas email dan akar',
  interdental_papilla: 'Gusi di sela gigi',
  palate: 'Langit-langit mulut',
  mouth_floor: 'Dasar mulut',
  tongue_tip: 'Ujung lidah',
  tongue_dorsum: 'Punggung lidah',
  tongue_lateral: 'Tepi lidah',
  tongue_base: 'Pangkal lidah',
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
