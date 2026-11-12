import type { SceneFocus } from '@/lib/sceneFocus'

export const quizFocus: Record<string, SceneFocus> = {
  'Q-001': { toothId: '36', objectId: 'enamel' },
  'Q-002': { toothId: '36', objectId: 'pulp', section: true },
  'Q-003': { toothId: '46', objectId: 'pd_ligament', section: true },
  'Q-004': { toothId: '31', objectId: 'cej', section: true },
  'Q-005': { objectId: 'gingiva', preset: 'front' },
  'Q-006': { toothId: '36', objectId: 'dentin', section: true },
}
