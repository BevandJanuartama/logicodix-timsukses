import { CircleCheck, OctagonAlert, TriangleAlert, type LucideIcon } from 'lucide-react'

export type SeverityLevel = 'mild' | 'moderate' | 'urgent'

export interface SeverityStyle {
  label: string
  groupTitle: string
  Icon: LucideIcon
  iconClassName: string
  dotClassName: string
}

export const SEVERITY_ORDER: SeverityLevel[] = ['urgent', 'moderate', 'mild']

export const SEVERITY_NOTE = 'Tingkat perhatian adalah perkiraan, belum ditinjau dokter gigi.'

export const SEVERITY_STYLES: Record<SeverityLevel, SeverityStyle> = {
  mild: {
    label: 'Ringan',
    groupTitle: 'Ringan',
    Icon: CircleCheck,
    iconClassName: 'text-success',
    dotClassName: 'bg-success',
  },
  moderate: {
    label: 'Sedang',
    groupTitle: 'Perlu perhatian',
    Icon: TriangleAlert,
    iconClassName: 'text-warning',
    dotClassName: 'bg-warning',
  },
  urgent: {
    label: 'Segera',
    groupTitle: 'Perlu segera ke dokter gigi',
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
}

export const severityOf = (diseaseId: string): SeverityLevel => SEVERITY_BY_DISEASE[diseaseId] ?? 'moderate'
