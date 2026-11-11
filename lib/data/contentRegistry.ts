import {
  anatomyStructures,
  diseaseStages,
  diseases,
  modelAssets,
  preventionTopics,
  quizQuestions,
} from '@/lib/knowledgeBase'
import type { ReviewStatus } from '@/lib/types'

export interface ContentEntry {
  id: string
  group: string
  title: string
  status: ReviewStatus
}

export const contentEntries: ContentEntry[] = [
  ...anatomyStructures.map((item) => ({ id: item.id, group: 'Anatomi', title: item.name, status: item.status })),
  ...diseases.map((item) => ({ id: item.id, group: 'Penyakit', title: item.displayName, status: item.status })),
  ...diseaseStages.map((item) => ({ id: item.id, group: 'Tahap', title: item.title, status: item.status })),
  ...preventionTopics.map((item) => ({ id: item.id, group: 'Pencegahan', title: item.topic, status: item.status })),
  ...quizQuestions.map((item) => ({ id: item.id, group: 'Kuis', title: item.question, status: item.status })),
  ...modelAssets.map((item) => ({ id: item.id, group: 'Aset 3D', title: item.name, status: item.status })),
]
