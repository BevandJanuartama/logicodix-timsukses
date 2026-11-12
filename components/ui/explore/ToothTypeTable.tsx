'use client'

import { useState } from 'react'
import { toothTypes } from '@/lib/knowledgeBase'

type Dentition = 'primary' | 'permanent'

const DENTITION_OPTIONS: { id: Dentition; label: string }[] = [
  { id: 'primary', label: 'Sulung' },
  { id: 'permanent', label: 'Permanen' },
]

const countOf = (type: (typeof toothTypes)[number], dentition: Dentition) =>
  dentition === 'primary' ? type.primaryCount : type.permanentCount

export function ToothTypeTable({ activeId }: { activeId?: string }) {
  const [dentition, setDentition] = useState<Dentition>('permanent')
  const total = toothTypes.reduce((sum, type) => sum + countOf(type, dentition), 0)
  const maxCount = Math.max(...toothTypes.map((type) => countOf(type, dentition)))

  return (
    <div>
      <div role="group" aria-label="Jenis dentisi" className="flex gap-1 rounded-[var(--radius-control)] border border-line p-1">
        {DENTITION_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={dentition === option.id}
            onClick={() => setDentition(option.id)}
            className="min-h-10 flex-1 cursor-pointer rounded-[var(--radius-control)] text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
          >
            {option.label}
          </button>
        ))}
      </div>
      <ul className="mt-2 space-y-1">
        {toothTypes.map((type) => {
          const count = countOf(type, dentition)
          return (
            <li
              key={type.id}
              aria-current={type.id === activeId ? 'true' : undefined}
              className="rounded-[var(--radius-control)] px-2.5 py-2 aria-[current=true]:bg-[var(--chip-bg)]"
            >
              <div className="flex items-baseline gap-2 text-caption">
                <span className="w-12 shrink-0 text-caption text-fg-muted">{type.id}</span>
                <span className="flex-1 truncate font-semibold text-fg">{type.name.split(' / ')[1] ?? type.name}</span>
                <span className="tabular-nums text-body font-semibold text-fg">{count}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full origin-left rounded-full bg-accent transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)]"
                  style={{ transform: `scaleX(${maxCount > 0 ? count / maxCount : 0})` }}
                />
              </div>
              <p className="mt-1 pl-14 text-caption text-fg-muted">{type.function}</p>
            </li>
          )
        })}
      </ul>
      <p className="tabular-nums mt-1 px-2.5 text-caption text-fg-secondary">Total {total} gigi</p>
    </div>
  )
}
