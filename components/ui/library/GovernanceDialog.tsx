'use client'

import { useState, type KeyboardEvent } from 'react'
import { useAppStore } from '@/lib/store'
import { Dialog } from '@/components/ui/shell/Dialog'
import { AssetMatrix } from './AssetMatrix'
import { ContentStatusList } from './ContentStatusList'
import { GapList } from './GapList'
import { MedicalDisclaimer } from './MedicalDisclaimer'

const TABS = [
  { id: 'status', label: 'Status konten' },
  { id: 'assets', label: 'Aset 3D' },
  { id: 'gaps', label: 'Celah riset' },
] as const

type TabId = (typeof TABS)[number]['id']

export function GovernanceDialog() {
  const open = useAppStore((state) => state.modal === 'governance')
  const closeModal = useAppStore((state) => state.closeModal)
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
    <Dialog open={open} onClose={closeModal} title="Tata kelola konten">
      <MedicalDisclaimer />
      <div
        role="tablist"
        aria-label="Bagian tata kelola"
        onKeyDown={moveTab}
        className="mb-3 flex gap-1 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-1"
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
            className="min-h-10 flex-1 cursor-pointer rounded-[var(--radius-control)] px-2 text-[13px] font-semibold text-fg-secondary transition-colors duration-[var(--duration-press)] hover:text-fg aria-selected:bg-accent-fill aria-selected:text-on-accent"
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
    </Dialog>
  )
}
