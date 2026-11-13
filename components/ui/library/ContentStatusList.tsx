'use client'

import { useMemo, useState } from 'react'
import { contentEntries } from '@/lib/data/contentRegistry'
import { REVIEW_STATUSES, useGovernanceStore } from '@/lib/governanceStore'
import type { ReviewStatus } from '@/lib/types'
import { StatusPill } from '@/components/ui/shell/StatusBadge'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'

type StatusFilter = ReviewStatus | 'all'

const STATUS_LABELS: Record<ReviewStatus, string> = {
  Draft: 'Belum ditinjau',
  'Under Review': 'Ditinjau',
  Approved: 'Disetujui',
}

export function ContentStatusList() {
  const overrides = useGovernanceStore((state) => state.overrides)
  const setStatus = useGovernanceStore((state) => state.setStatus)
  const resetStatuses = useGovernanceStore((state) => state.resetStatuses)
  const [filter, setFilter] = useState<StatusFilter>('all')

  const entries = useMemo(
    () => contentEntries.map((entry) => ({ ...entry, status: overrides[entry.id] ?? entry.status })),
    [overrides],
  )
  const counts = Object.fromEntries(
    REVIEW_STATUSES.map((status) => [status, entries.filter((entry) => entry.status === status).length]),
  ) as Record<ReviewStatus, number>
  const visible = filter === 'all' ? entries : entries.filter((entry) => entry.status === filter)

  return (
    <section aria-label="Status editorial konten">
      <div className="grid grid-cols-3 gap-2">
        {REVIEW_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={filter === status}
            onClick={() => setFilter(filter === status ? 'all' : status)}
            className="cursor-pointer rounded-[var(--radius-control)] bg-surface-raised px-3 py-2 text-left transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] aria-pressed:bg-accent-tint"
          >
            <span className="font-display tabular-nums block text-title font-semibold text-fg">{counts[status]}</span>
            <StatusPill status={status} />
          </button>
        ))}
      </div>
      <ExploreDisclosure label={`Rincian per item (${visible.length})`}>
        <div className="mb-2 flex items-center gap-2">
          <p className="flex-1 text-caption text-fg-muted">Perubahan hanya tersimpan di peramban ini.</p>
          <button
            type="button"
            onClick={resetStatuses}
            disabled={Object.keys(overrides).length === 0}
            className="min-h-10 cursor-pointer rounded-[var(--radius-control)] px-2 text-caption font-semibold text-accent hover:bg-[var(--button-ghost-bg-hover)] disabled:cursor-default disabled:opacity-40"
          >
            Reset
          </button>
        </div>
        <ul>
          {visible.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2 py-2">
              <span className="w-16 shrink-0 text-caption font-semibold text-fg-muted">{entry.id}</span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-caption font-semibold text-fg">{entry.title}</span>
                <span className="text-caption text-fg-muted">{entry.group}</span>
              </span>
              <select
                aria-label={`Ubah status ${entry.id}`}
                value={entry.status}
                onChange={(event) => setStatus(entry.id, event.target.value as ReviewStatus)}
                className="min-h-10 rounded-[var(--radius-control)] bg-surface-raised px-1.5 text-caption text-fg"
              >
                {REVIEW_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </ExploreDisclosure>
    </section>
  )
}
