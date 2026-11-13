'use client'

import { useState } from 'react'
import { toothTypes } from '@/lib/knowledgeBase'
import { DentitionToggle, type Dentition } from './DentitionToggle'

const countOf = (type: (typeof toothTypes)[number], dentition: Dentition) =>
  dentition === 'primary' ? type.primaryCount : type.permanentCount

interface ToothTypeTableProps {
  dentition: Dentition
  activeId?: string
}

export function ToothTypeTable({ dentition, activeId }: ToothTypeTableProps) {
  const total = toothTypes.reduce((sum, type) => sum + countOf(type, dentition), 0)
  const maxCount = Math.max(...toothTypes.map((type) => countOf(type, dentition)))

  return (
    <div>
      <ul className="space-y-1">
        {toothTypes.map((type) => {
          const count = countOf(type, dentition)
          return (
            <li
              key={type.id}
              aria-current={type.id === activeId ? 'true' : undefined}
              className="rounded-[var(--radius-control)] px-2.5 py-2 aria-[current=true]:bg-accent-tint"
            >
              <div className="flex items-baseline gap-2 text-caption">
                <span className="flex-1 truncate font-semibold text-fg">{type.name.split(' / ')[1] ?? type.name}</span>
                <span className="font-display tabular-nums text-body font-semibold text-fg">{count}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-1 overflow-hidden rounded-full bg-accent-tint">
                <div
                  className="h-full origin-left rounded-full bg-accent transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)]"
                  style={{ transform: `scaleX(${maxCount > 0 ? count / maxCount : 0})` }}
                />
              </div>
              <p className="mt-1 text-caption text-fg-secondary">{type.function}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-1 px-2.5 text-caption text-fg-secondary">Total <span className="font-display tabular-nums">{total}</span> gigi</p>
    </div>
  )
}

export function ToothComparison({ activeId }: { activeId?: string }) {
  const [dentition, setDentition] = useState<Dentition>('permanent')
  return (
    <div className="space-y-2">
      <DentitionToggle value={dentition} onChange={setDentition} />
      <ToothTypeTable dentition={dentition} activeId={activeId} />
    </div>
  )
}
