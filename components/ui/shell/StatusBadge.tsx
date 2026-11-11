'use client'

import { useReviewStatus } from '@/lib/governanceStore'
import type { ReviewStatus } from '@/lib/types'

const STATUS_STYLES: Record<ReviewStatus, { label: string; className: string }> = {
  Draft: { label: 'Draf', className: 'bg-ink/8 text-ink/65' },
  'Under Review': { label: 'Ditinjau', className: 'bg-amber/15 text-amber-ink' },
  Approved: { label: 'Disetujui', className: 'bg-mint/15 text-mint-ink' },
}

export function StatusPill({ status }: { status: ReviewStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      title={`Status editorial: ${status}`}
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${style.className}`}
    >
      {style.label}
    </span>
  )
}

export function StatusBadge({ contentId, baseStatus }: { contentId: string; baseStatus: ReviewStatus }) {
  return <StatusPill status={useReviewStatus(contentId, baseStatus)} />
}
