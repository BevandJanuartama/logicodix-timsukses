import { SEVERITY_STYLES, severityOf } from './diseaseSeverity'

export function SeverityBadge({ diseaseId }: { diseaseId: string }) {
  const { label, dotClassName } = SEVERITY_STYLES[severityOf(diseaseId)]
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-caption font-semibold text-fg-secondary">
      <span aria-hidden className={`size-2.5 rounded-full ${dotClassName}`} />
      {label}
    </span>
  )
}
