'use client'

import { Crosshair } from 'lucide-react'
import { toothSide, type ToothIdentity, type ToothKind } from '@/lib/data/dentition'
import { layerSwatches } from '@/lib/data/sceneLabels'
import { toothTypes } from '@/lib/knowledgeBase'
import { focusScene } from '@/lib/sceneFocus'
import { sectionedToothOf, useAppStore } from '@/lib/store'
import type { AnatomyObjectId } from '@/lib/types'
import { ExploreDisclosure } from './ExploreDisclosure'
import { FactList } from './FactList'
import { plainNames, plainRegion } from './plainLabels'
import { ToothComparison } from './ToothTypeTable'

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

export function ToothSummary({ tooth }: { tooth: ToothIdentity }) {
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  const sectioned = useAppStore((state) => sectionedToothOf(state) === tooth.id)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const toothType = toothTypes.find((type) => type.id === TOOTH_TYPE_BY_KIND[tooth.kind])

  const region = toothType ? `${plainRegion[toothType.region] ?? toothType.region}, ` : ''
  const facts = [
    { label: 'Letak', value: `${region}${toothSide(tooth)}` },
    ...(toothType
      ? [{ label: 'Jumlah gigi sejenis', value: `${toothType.permanentCount} dewasa, ${toothType.primaryCount} susu` }]
      : []),
  ]

  return (
    <section aria-label={tooth.name} className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-title font-semibold tracking-tight text-fg">{tooth.name}</h2>
          {toothType && <p className="mt-1 text-body text-fg-secondary">{toothType.function}.</p>}
        </div>
        <button
          type="button"
          onClick={() => requestCamera({ kind: 'tooth', toothId: tooth.id, section: sectioned })}
          aria-label="Fokuskan kamera ke gigi ini"
          title="Fokuskan kamera"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-control)] bg-surface-sunken text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:text-fg active:scale-[var(--scale-press)]"
        >
          <Crosshair className="size-4" aria-hidden />
        </button>
      </div>

      <FactList facts={facts} />

      <div>
        <ExploreDisclosure label="Lihat bagian dalam">
          <ul className="space-y-0.5">
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
                  className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-control)] px-2 text-left text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-tint aria-pressed:text-fg"
                >
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: layerSwatches[structure.id as keyof typeof layerSwatches] }}
                  />
                  {plainNames[structure.id]}
                </button>
              </li>
            ))}
          </ul>
        </ExploreDisclosure>
        {!selectedObjectId && (
          <ExploreDisclosure label="Bandingkan jenis gigi">
            <ToothComparison activeId={toothType?.id} />
          </ExploreDisclosure>
        )}
      </div>
    </section>
  )
}
