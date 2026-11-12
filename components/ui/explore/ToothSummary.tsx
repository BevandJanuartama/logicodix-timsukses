'use client'

import { Crosshair } from 'lucide-react'
import { layerSwatches, sceneTargetLabels } from '@/lib/data/sceneLabels'
import { toothTypes } from '@/lib/knowledgeBase'
import { focusScene } from '@/lib/sceneFocus'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import type { ToothInfo, ToothKind } from '@/lib/three/layout'
import type { AnatomyObjectId } from '@/lib/types'
import { ExploreChip } from './ExploreChip'
import { ExploreDisclosure } from './ExploreDisclosure'
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
    <section aria-label={`Gigi FDI ${tooth.fdi}`} className="border-t border-line pt-3">
      <div className="flex items-start justify-between gap-3">
        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-fg">{tooth.name}</p>
          <p className="telemetry mt-1 text-[12px] text-fg-secondary">
            FDI {tooth.fdi} · {toothType?.region}
          </p>
          <p className="mt-1 text-[12.5px] text-fg-muted">{toothType?.function}</p>
        </div>
        <button
          type="button"
          onClick={() => requestCamera({ kind: 'tooth', toothId: tooth.id, section: sectioned })}
          aria-label="Fokuskan kamera ke gigi ini"
          title="Fokuskan kamera"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-control)] border border-line text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
        >
          <Crosshair className="size-4" aria-hidden />
        </button>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {TOOTH_STRUCTURES.map((structure) => (
          <li key={structure.id}>
            <ExploreChip
              pressed={selectedObjectId === structure.id}
              swatch={layerSwatches[structure.id as keyof typeof layerSwatches]}
              onClick={() =>
                focusScene({
                  toothId: tooth.id,
                  objectId: structure.id,
                  section: structure.needsSection || sectioned,
                })
              }
            >
              {sceneTargetLabels[structure.id]}
            </ExploreChip>
          </li>
        ))}
      </ul>
      {!selectedObjectId && (
        <ExploreDisclosure label="Bandingkan jenis gigi">
          <ToothTypeTable activeId={toothType?.id} />
        </ExploreDisclosure>
      )}
    </section>
  )
}
