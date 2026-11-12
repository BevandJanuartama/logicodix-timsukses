'use client'

import { useMemo, useState } from 'react'
import { contentEntries } from '@/lib/data/contentRegistry'
import { REVIEW_STATUSES, useGovernanceStore } from '@/lib/governanceStore'
import type { ReviewStatus } from '@/lib/types'
import { StatusPill } from '@/components/ui/shell/StatusBadge'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'

type StatusFilter = ReviewStatus | 'all'

const STATUS_LABELS: Record<ReviewStatus, string> = {
  Draft: 'Draf',
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
            className="cursor-pointer rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-3 py-2 text-left transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] aria-pressed:border-line-strong aria-pressed:bg-accent-fill/30"
          >
            <span className="telemetry block text-2xl font-semibold text-fg">{counts[status]}</span>
            <StatusPill status={status} />
          </button>
        ))}
      </div>
      <ExploreDisclosure label={`Rincian per item (${visible.length})`}>
        <div className="mb-2 flex items-center gap-2">
          <p className="flex-1 text-[12px] text-fg-muted">Perubahan hanya tersimpan di peramban ini.</p>
          <button
            type="button"
            onClick={resetStatuses}
            disabled={Object.keys(overrides).length === 0}
            className="min-h-10 cursor-pointer rounded-[var(--radius-control)] px-2 text-xs font-semibold text-accent hover:bg-[var(--button-ghost-bg-hover)] disabled:cursor-default disabled:opacity-40"
          >
            Reset
          </button>
        </div>
        <ul>
          {visible.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2 border-t border-line py-2 first:border-t-0">
              <span className="telemetry w-16 shrink-0 text-[11.5px] font-semibold text-fg-muted">{entry.id}</span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-[13px] font-semibold text-fg">{entry.title}</span>
                <span className="text-[11.5px] text-fg-muted">{entry.group}</span>
              </span>
              <select
                aria-label={`Ubah status ${entry.id}`}
                value={entry.status}
                onChange={(event) => setStatus(entry.id, event.target.value as ReviewStatus)}
                className="min-h-10 rounded-[var(--radius-control)] border border-line bg-surface-raised px-1.5 text-[12px] text-fg"
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
