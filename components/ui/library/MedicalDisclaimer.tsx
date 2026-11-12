import { ShieldAlert } from 'lucide-react'

export function MedicalDisclaimer() {
  return (
    <p className="mb-3 flex items-start gap-2 rounded-[var(--radius-control)] border border-warning/30 bg-warning/10 px-3 py-2 text-[13px] leading-snug text-fg-secondary">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <span>
        <span className="telemetry mr-1.5 text-[11px] font-semibold text-warning">FR-015</span>
        Media edukasi, bukan diagnosis atau pengganti pemeriksaan tenaga kesehatan gigi.
      </span>
    </p>
  )
}
