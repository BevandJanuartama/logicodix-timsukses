import { CircleCheck, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react'

export type SeverityLevel = 'mild' | 'moderate' | 'urgent'

export interface SeverityStyle {
  label: string
  Icon: LucideIcon
  iconClassName: string
  dotClassName: string
}

export const SEVERITY_NOTE = 'Tingkat perhatian adalah perkiraan, belum ditinjau dokter gigi.'

export const SEVERITY_STYLES: Record<SeverityLevel, SeverityStyle> = {
  mild: {
    label: 'Ringan',
    Icon: CircleCheck,
    iconClassName: 'text-success',
    dotClassName: 'bg-success',
  },
  moderate: {
    label: 'Sedang',
    Icon: TriangleAlert,
    iconClassName: 'text-warning',
    dotClassName: 'bg-warning',
  },
  urgent: {
    label: 'Segera',
    Icon: OctagonAlert,
    iconClassName: 'text-danger',
    dotClassName: 'bg-danger',
  },
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
  'DIS-011': 'mild',
  'DIS-012': 'mild',
  'DIS-013': 'mild',
  'DIS-014': 'mild',
  'DIS-015': 'mild',
  'DIS-016': 'moderate',
  'DIS-017': 'mild',
  'DIS-018': 'mild',
  'DIS-019': 'moderate',
  'DIS-020': 'moderate',
  'DIS-021': 'mild',
}

export const severityOf = (diseaseId: string): SeverityLevel => SEVERITY_BY_DISEASE[diseaseId] ?? 'moderate'

export const setSeverity = (diseaseId: string, level: SeverityLevel) => {
  SEVERITY_BY_DISEASE[diseaseId] = level
}
