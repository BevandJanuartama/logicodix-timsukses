import { CircleCheck, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react'

export type SeverityLevel = 'mild' | 'moderate' | 'urgent'

export interface SeverityStyle {
  label: string
  Icon: LucideIcon
  iconClassName: string
}

export const SEVERITY_STYLES: Record<SeverityLevel, SeverityStyle> = {
  mild: { label: 'Ringan', Icon: CircleCheck, iconClassName: 'text-success' },
  moderate: { label: 'Sedang', Icon: TriangleAlert, iconClassName: 'text-warning' },
  urgent: { label: 'Segera', Icon: OctagonAlert, iconClassName: 'text-danger' },
}

const SEVERITY_BY_DISEASE: Record<string, SeverityLevel> = {
  'DIS-001': 'moderate',
  'DIS-002': 'mild',
  'DIS-003': 'moderate',
  'DIS-004': 'urgent',
  'DIS-005': 'mild',
  'DIS-006': 'mild',
  'DIS-007': 'moderate',
  'DIS-008': 'urgent',
  'DIS-009': 'mild',
  'DIS-010': 'mild',
}

export const severityOf = (diseaseId: string): SeverityLevel => SEVERITY_BY_DISEASE[diseaseId] ?? 'moderate'
