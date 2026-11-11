import { anatomyStructures } from '@/lib/data/anatomy'
import { diseases } from '@/lib/data/diseases'
import { diseaseStages } from '@/lib/data/stages'
import { modelAssets } from '@/lib/data/assets'
import { preventionTopics } from '@/lib/data/prevention'
import { quizQuestions } from '@/lib/data/quiz'
import { references } from '@/lib/data/references'
import { researchGaps } from '@/lib/data/gaps'
import { toothTypes } from '@/lib/data/toothTypes'

export {
  anatomyStructures,
  diseases,
  diseaseStages,
  modelAssets,
  preventionTopics,
  quizQuestions,
  references,
  researchGaps,
  toothTypes,
}

export const findReference = (id: string) => references.find((reference) => reference.id === id)

export const findDisease = (id: string) => diseases.find((disease) => disease.id === id)

export const stagesForDisease = (diseaseId: string) =>
  diseaseStages.filter((stage) => stage.diseaseId === diseaseId).sort((a, b) => a.stageNumber - b.stageNumber)

export const findStructureByObjectId = (objectId: string) =>
  anatomyStructures.find((structure) => structure.objectId === objectId)
