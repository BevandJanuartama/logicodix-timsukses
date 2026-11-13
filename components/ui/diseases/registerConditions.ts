import { CONDITION_POSES } from '@/lib/data/conditionPoses'
import type { RemoteCondition } from '@/lib/data/conditionRows'
import { diseaseLinks } from '@/lib/data/diseaseLinks'
import { diseases } from '@/lib/data/diseases'
import { visualFor } from '@/lib/data/sheetVisuals'
import { setSeverity } from './diseaseSeverity'

function enrichBuiltIn(targetId: string, remote: RemoteCondition['disease']) {
  const target = diseases.find((entry) => entry.id === targetId)
  if (target && remote.details) target.details = remote.details
}

export function registerConditions(conditions: RemoteCondition[]) {
  for (const { disease, severity, mergeInto } of conditions) {
    if (mergeInto.length) {
      mergeInto.forEach((targetId) => enrichBuiltIn(targetId, disease))
      continue
    }
    const existing = diseases.findIndex((entry) => entry.id === disease.id)
    if (existing === -1) diseases.push(disease)
    else diseases[existing] = disease
    setSeverity(disease.id, severity)

    const { structures, focus, pose } = visualFor(disease.id, disease.category)
    diseaseLinks[disease.id] = { structures, focus }
    if (pose) CONDITION_POSES[disease.id] = pose
  }
}
