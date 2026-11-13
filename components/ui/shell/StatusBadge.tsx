'use client'

import { CircleCheck, CircleDashed, Clock } from 'lucide-react'
import { useReviewStatus } from '@/lib/governanceStore'
import type { ReviewStatus } from '@/lib/types'
import { Badge, type BadgeTone } from './Badge'

const STATUS_STYLES: Record<ReviewStatus, { label: string; tone: BadgeTone; Icon: typeof Clock }> = {
  Draft: { label: 'Belum ditinjau', tone: 'neutral', Icon: CircleDashed },
  'Under Review': { label: 'Ditinjau', tone: 'warning', Icon: Clock },
  Approved: { label: 'Disetujui', tone: 'success', Icon: CircleCheck },
}

export function StatusPill({ status }: { status: ReviewStatus }) {
  const { label, tone, Icon } = STATUS_STYLES[status]
  return (
    <Badge tone={tone} title={`Status editorial: ${status}`} icon={<Icon className="size-3" aria-hidden />}>
      {label}
    </Badge>
  )
}

export function StatusBadge({ contentId, baseStatus }: { contentId: string; baseStatus: ReviewStatus }) {
  return <StatusPill status={useReviewStatus(contentId, baseStatus)} />
}
