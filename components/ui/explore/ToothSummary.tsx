'use client'

import { Crosshair } from 'lucide-react'
import { layerSwatches, sceneTargetLabels } from '@/lib/data/sceneLabels'
import { toothTypes } from '@/lib/knowledgeBase'
import { focusScene } from '@/lib/sceneFocus'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import type { ToothInfo, ToothKind } from '@/lib/three/layout'
import type { AnatomyObjectId } from '@/lib/types'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { ToothTypeTable } from './ToothTypeTable'

const TOOTH_TYPE_BY_KIND: Record<ToothKind, string> = {
  incisor: 'TT-001',
  canine: 'TT-002',
  premolar: 'TT-003',
  molar: 'TT-004',
}

const TOOTH_STRUCTURES: { id: AnatomyObjectId; needsSection: boolean }[] = [
  { id: 'enamel', needsSection: false },
  { id: 'cementum', needsSection: false },
  { id: 'cej', needsSection: true },
  { id: 'dentin', needsSection: true },
  { id: 'pulp_chamber', needsSection: true },
  { id: 'root_canal', needsSection: true },
  { id: 'pulp', needsSection: true },
  { id: 'pd_ligament', needsSection: true },
  { id: 'alveolar_bone', needsSection: true },
  { id: 'gingiva', needsSection: false },
]

export function ToothSummary({ tooth }: { tooth: ToothInfo }) {
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  const sectioned = useAppStore((state) => sectionedToothOf(state) === tooth.id)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const toothType = toothTypes.find((type) => type.id === TOOTH_TYPE_BY_KIND[tooth.params.kind])

  return (
    <section aria-label={`Gigi FDI ${tooth.fdi}`} className="rounded-2xl bg-white/60 p-3.5 ring-1 ring-ink/8">
      <div className="flex items-start justify-between gap-3">
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold">{tooth.name}</p>
          <p className="mt-0.5 text-[12.5px] text-ink/60">
            FDI <span className="font-bold tabular-nums">{tooth.fdi}</span> · {toothType?.name} · {toothType?.region}
          </p>
        </div>
        <button
          type="button"
          onClick={() => requestCamera({ kind: 'tooth', toothId: tooth.id, section: sectioned })}
          aria-label="Fokuskan kamera ke gigi ini"
          title="Fokuskan kamera"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/60 hover:text-brand"
        >
          <Crosshair className="size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-2 text-[13px] text-ink/70">Fungsi: {toothType?.function}.</p>
      <h3 className="mt-3 mb-1.5 text-[11px] font-bold tracking-[0.12em] text-ink/50 uppercase">Struktur pada gigi ini</h3>
      <ul className="flex flex-wrap gap-1.5">
        {TOOTH_STRUCTURES.map((structure) => (
          <li key={structure.id}>
            <button
              type="button"
              aria-pressed={selectedObjectId === structure.id}
              onClick={() =>
                focusScene({
                  toothId: tooth.id,
                  objectId: structure.id,
                  section: structure.needsSection || sectioned,
                })
              }
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12.5px] font-semibold ring-1 ring-ink/10 transition-colors hover:ring-brand/50 aria-pressed:bg-ink aria-pressed:text-white aria-pressed:ring-ink"
            >
              <span
                aria-hidden
                className="size-2.5 rounded-full ring-1 ring-ink/15"
                style={{ background: layerSwatches[structure.id] }}
              />
              {sceneTargetLabels[structure.id]}
            </button>
          </li>
        ))}
      </ul>
      {!selectedObjectId && (
        <>
          <SectionTitle>Jenis gigi</SectionTitle>
          <ToothTypeTable activeId={toothType?.id} />
        </>
      )}
    </section>
  )
}
