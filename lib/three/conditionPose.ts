import { CONDITION_POSES, type ConditionPose } from '@/lib/data/conditionPoses'
import { useAppStore } from '@/lib/store'

export function activeConditionPose(): ConditionPose | null {
  const { mode, selectedDiseaseId, showNormalPose } = useAppStore.getState()
  if (mode !== 'diseases' || !selectedDiseaseId || showNormalPose) return null
  return CONDITION_POSES[selectedDiseaseId] ?? null
}
