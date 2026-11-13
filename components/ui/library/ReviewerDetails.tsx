'use client'

import { useState, type KeyboardEvent } from 'react'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { AssetMatrix } from './AssetMatrix'
import { ContentStatusList } from './ContentStatusList'
import { GapList } from './GapList'

const TABS = [
  { id: 'status', label: 'Status materi' },
  { id: 'assets', label: 'Model 3D' },
  { id: 'gaps', label: 'Celah riset' },
] as const

type TabId = (typeof TABS)[number]['id']

export function ReviewerDetails() {
  const [tab, setTab] = useState<TabId>('status')

  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = TABS[(TABS.findIndex((item) => item.id === tab) + step + TABS.length) % TABS.length]
    setTab(next.id)
    event.currentTarget.querySelector<HTMLElement>(`#tab-${next.id}`)?.focus()
  }

  return (
    <ExploreDisclosure label="Rincian untuk peninjau">
      <div
        role="tablist"
        aria-label="Rincian untuk peninjau"
        onKeyDown={moveTab}
        className="mb-3 flex gap-1 rounded-[var(--radius-control)] bg-surface-raised p-1"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            className="min-h-11 flex-1 cursor-pointer rounded-[var(--radius-control)] px-2 text-caption font-semibold text-fg-secondary transition-colors duration-[var(--duration-press)] hover:text-fg aria-selected:bg-accent-fill aria-selected:text-on-accent"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'status' && <ContentStatusList />}
        {tab === 'assets' && <AssetMatrix />}
        {tab === 'gaps' && <GapList />}
      </div>
    </ExploreDisclosure>
  )
}
