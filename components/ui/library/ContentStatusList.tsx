'use client'

import { useMemo, useState } from 'react'
import { contentEntries } from '@/lib/data/contentRegistry'
import { REVIEW_STATUSES, useGovernanceStore } from '@/lib/governanceStore'
import type { ReviewStatus } from '@/lib/types'
import { StatusPill } from '@/components/ui/shell/StatusBadge'

type StatusFilter = ReviewStatus | 'all'

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
      <div className="flex flex-wrap items-center gap-1.5">
        {(['all', ...REVIEW_STATUSES] as StatusFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink/70 ring-1 ring-ink/10 aria-pressed:bg-ink aria-pressed:text-white aria-pressed:ring-ink"
          >
            {option === 'all' ? `Semua (${entries.length})` : `${option} (${counts[option]})`}
          </button>
        ))}
        <button
          type="button"
          onClick={resetStatuses}
          disabled={Object.keys(overrides).length === 0}
          className="ml-auto rounded-lg px-2 py-1 text-xs font-bold text-brand hover:bg-brand-50 disabled:opacity-40"
        >
          Kembalikan ke data awal
        </button>
      </div>
      <p className="mt-2 text-[12px] text-ink/55">
        Perubahan status hanya tersimpan di peramban ini sebagai simulasi alur peninjauan.
      </p>
      <table className="mt-3 w-full text-left text-[13px]">
        <thead className="text-[11px] font-bold tracking-wide text-ink/50 uppercase">
          <tr>
            <th scope="col" className="py-2 pr-2">ID</th>
            <th scope="col" className="py-2 pr-2">Konten</th>
            <th scope="col" className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((entry) => (
            <tr key={entry.id} className="border-t border-ink/6 align-top">
              <td className="py-2 pr-2 font-mono text-[11.5px] font-bold whitespace-nowrap text-ink/60">{entry.id}</td>
              <td className="py-2 pr-2">
                <span className="line-clamp-2 font-semibold">{entry.title}</span>
                <span className="text-[11.5px] text-ink/50">{entry.group}</span>
              </td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <StatusPill status={entry.status} />
                  <select
                    aria-label={`Ubah status ${entry.id}`}
                    value={entry.status}
                    onChange={(event) => setStatus(entry.id, event.target.value as ReviewStatus)}
                    className="rounded-lg bg-white px-1.5 py-1 text-[12px] ring-1 ring-ink/10"
                  >
                    {REVIEW_STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
