import { SEVERITY_STYLES, severityOf } from './diseaseSeverity'

export function SeverityBadge({ diseaseId }: { diseaseId: string }) {
  const { label, Icon, iconClassName } = SEVERITY_STYLES[severityOf(diseaseId)]
  return (
    <span
      title={`Tingkat perhatian: ${label}`}
      className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-control)] border border-line px-1.5 py-0.5 text-[12px] font-semibold text-fg-secondary"
    >
      <Icon className={`size-3.5 ${iconClassName}`} aria-hidden />
      {label}
    </span>
  )
}
