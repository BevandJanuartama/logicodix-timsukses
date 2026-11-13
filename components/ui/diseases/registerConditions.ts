import type { RemoteCondition } from '@/lib/data/conditionRows'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { diseases } from '@/lib/data/diseases'
import { setSeverity } from './diseaseSeverity'

export function registerConditions(conditions: RemoteCondition[]) {
  for (const { disease, severity, toothId } of conditions) {
    const existing = diseases.findIndex((entry) => entry.id === disease.id)
    if (existing === -1) diseases.push(disease)
    else diseases[existing] = disease
    setSeverity(disease.id, severity)
    diseaseLinks[disease.id] = {
      structures: diseaseLinks[disease.id]?.structures ?? [],
      focus: toothId ? { toothId, objectId: 'enamel' } : { preset: 'front' },
    }
  }
}
