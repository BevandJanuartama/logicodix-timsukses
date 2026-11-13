import type { SceneFocus } from '@/lib/sceneFocus'
import type { AnatomyObjectId } from '@/lib/types'

export interface DiseaseLink {
  structures: AnatomyObjectId[]
  focus: SceneFocus
}

export const diseaseLinks: Record<string, DiseaseLink> = {
  'DIS-001': { structures: ['enamel', 'dentin', 'pulp', 'cementum'], focus: { toothId: '36', objectId: 'enamel' } },
  'DIS-002': { structures: ['gingiva'], focus: { objectId: 'gingiva', preset: 'front' } },
  'DIS-003': {
    structures: ['gingiva', 'pd_ligament', 'cementum', 'alveolar_bone'],
    focus: { toothId: '46', objectId: 'alveolar_bone', section: true },
  },
  'DIS-004': { structures: ['pulp', 'pulp_chamber', 'root_canal'], focus: { toothId: '36', objectId: 'pulp', section: true } },
  'DIS-005': { structures: ['enamel', 'dentin'], focus: { toothId: '11', objectId: 'enamel' } },
  'DIS-006': { structures: ['gingiva', 'cej'], focus: { toothId: '31', objectId: 'cej', section: true } },
  'DIS-007': { structures: ['enamel', 'dentin', 'pulp'], focus: { toothId: '11', objectId: 'enamel' } },
  'DIS-008': {
    structures: ['root_canal', 'pd_ligament', 'alveolar_bone'],
    focus: { toothId: '36', objectId: 'root_canal', section: true },
  },
  'DIS-009': { structures: ['enamel'], focus: { toothId: '16', objectId: 'enamel' } },
  'DIS-010': { structures: [], focus: { preset: 'front' } },
  'DIS-011': { structures: [], focus: { toothId: '11', preset: 'right', overview: true } },
  'DIS-012': { structures: [], focus: { toothId: '41', preset: 'right', overview: true } },
  'DIS-013': { structures: [], focus: { toothId: '11', preset: 'front', overview: true } },
  'DIS-014': { structures: [], focus: { toothId: '16', preset: 'left', overview: true } },
  'DIS-015': { structures: [], focus: { toothId: '31', preset: 'front', overview: true } },
  'DIS-016': { structures: ['gingiva'], focus: { toothId: '38', objectId: 'enamel' } },
  'DIS-017': { structures: [], focus: { toothId: '12', preset: 'front', overview: true } },
  'DIS-018': { structures: [], focus: { toothId: '11', preset: 'front', overview: true } },
  'DIS-019': { structures: ['enamel'], focus: { toothId: '11', objectId: 'enamel' } },
  'DIS-020': { structures: ['dentin'], focus: { toothId: '11', objectId: 'enamel' } },
  'DIS-021': { structures: ['enamel'], focus: { toothId: '21', objectId: 'enamel' } },
}

export const diseaseIdsForStructure = (objectId: AnatomyObjectId) =>
  Object.entries(diseaseLinks)
    .filter(([, link]) => link.structures.includes(objectId))
    .map(([diseaseId]) => diseaseId)
