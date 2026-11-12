import type { SceneTargetId } from '@/lib/types'

export const plainNames: Record<SceneTargetId, string> = {
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

export const plainRegion: Record<string, string> = {
  Anterior: 'Depan',
  Posterior: 'Belakang',
}
