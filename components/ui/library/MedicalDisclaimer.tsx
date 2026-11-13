'use client'

import { ShieldAlert } from 'lucide-react'
import { reviewSummary, useContentReview } from './useContentReview'

export function MedicalDisclaimer() {
  const { reviewed, total } = useContentReview()
  return (
    <div className="rounded-[var(--radius-control)] bg-warning/10 px-4 py-3">
      <p className="flex items-start gap-3 text-body text-fg">
        <ShieldAlert className="mt-1 size-5 shrink-0 text-warning" aria-hidden />
        <span>
          Aplikasi ini untuk belajar, bukan untuk diagnosis.
          {reviewed < total && ' Konten belum selesai ditinjau dokter gigi.'}
        </span>
      </p>
      <p className="mt-1.5 pl-8 text-caption text-fg-secondary">{reviewSummary(reviewed, total)}</p>
    </div>
  )
}
