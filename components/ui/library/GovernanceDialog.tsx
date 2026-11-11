'use client'

import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { modelAssets, researchGaps } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { Dialog } from '@/components/ui/shell/Dialog'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { ContentStatusList } from './ContentStatusList'

const TABS = [
  { id: 'status', label: 'Status konten' },
  { id: 'assets', label: 'Aset 3D' },
  { id: 'gaps', label: 'Celah riset' },
] as const

type TabId = (typeof TABS)[number]['id']

function AssetList() {
  return (
    <ul className="space-y-2">
      {modelAssets.map((asset) => (
        <li key={asset.id} className="rounded-2xl bg-white/60 p-3.5 ring-1 ring-ink/8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-brand">{asset.id}</span>
            <span className="flex-1 text-[14px] font-extrabold">{asset.name}</span>
            <StatusBadge contentId={asset.id} baseStatus={asset.status} />
          </div>
          <p className="mt-1 text-[12.5px] text-ink/65">
            {asset.modelType} · v{asset.version} · Lisensi: {asset.license}
          </p>
          <p className="mt-1 text-[12.5px] text-ink/65">Mesh: {asset.meshIds.join(', ')}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-ink/80">{asset.notes}</p>
        </li>
      ))}
      <li className="rounded-2xl bg-brand-50 p-3.5 text-[12.5px] leading-snug text-ink/80">
        Versi aplikasi ini memakai model prosedural yang dibangkitkan kode, sehingga berkas .glb di atas belum dimuat.
      </li>
    </ul>
  )
}

function GapList() {
  return (
    <ul className="space-y-2">
      {researchGaps.map((gap) => (
        <li key={gap.id} className="rounded-2xl bg-white/60 p-3.5 ring-1 ring-ink/8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-amber-ink">{gap.id}</span>
            <span className="flex-1 text-[14px] font-extrabold">{gap.area}</span>
            <span className="rounded-md bg-ink/8 px-1.5 py-0.5 text-[10.5px] font-bold text-ink/65">{gap.status}</span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-ink/80">{gap.dataNeeded}</p>
          <p className="mt-1 text-[12.5px] text-ink/60">
            Alasan: {gap.reason} · Sumber yang disarankan: {gap.suggestedSource}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function GovernanceDialog() {
  const open = useAppStore((state) => state.modal === 'governance')
  const closeModal = useAppStore((state) => state.closeModal)
  const [tab, setTab] = useState<TabId>('status')

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      title="Tata kelola konten"
      description="Status editorial, aset model 3D, dan celah data yang masih perlu dilengkapi."
    >
      <p className="mb-4 flex gap-2 rounded-2xl bg-coral/8 p-3 text-[12.5px] leading-snug text-ink/80">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-coral" aria-hidden />
        Dental Explorer adalah media edukasi. Konten tidak dimaksudkan untuk diagnosis, penilaian risiko pribadi, atau
        pengganti pemeriksaan oleh tenaga kesehatan gigi.
      </p>
      <div role="tablist" aria-label="Bagian tata kelola" className="mb-4 flex gap-1 rounded-2xl bg-ink/5 p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className="flex-1 rounded-xl px-2 py-2 text-[12.5px] font-bold text-ink/60 aria-selected:bg-white aria-selected:text-ink aria-selected:shadow"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'status' && <ContentStatusList />}
        {tab === 'assets' && <AssetList />}
        {tab === 'gaps' && <GapList />}
      </div>
    </Dialog>
  )
}
