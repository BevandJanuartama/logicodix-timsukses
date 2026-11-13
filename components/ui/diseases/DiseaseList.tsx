'use client'

import { motion } from 'framer-motion'
import { diseases } from '@/lib/knowledgeBase'
import { CONDITION_GROUPS } from '@/lib/data/conditionGroups'
import { SEVERITY_NOTE, SEVERITY_STYLES, severityOf } from './diseaseSeverity'

interface DiseaseListProps {
  activeId: string | null
  onSelect: (diseaseId: string) => void
  highlight?: boolean
}

interface DiseaseEntryProps {
  diseaseId: string
  active: boolean
  highlight: boolean
  onSelect: (diseaseId: string) => void
}

const HIGHLIGHT_TRANSITION = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const

function DiseaseEntry({ diseaseId, active, highlight, onSelect }: DiseaseEntryProps) {
  const disease = diseases.find((candidate) => candidate.id === diseaseId)
  const { label, dotClassName } = SEVERITY_STYLES[severityOf(diseaseId)]
  if (!disease) return null

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(diseaseId)}
        aria-current={active ? 'true' : undefined}
        className="group relative flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 py-2 text-left transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
      >
        {highlight && active && (
          <motion.span
            layoutId="rail-active"
            transition={HIGHLIGHT_TRANSITION}
            aria-hidden
            className="absolute inset-0 rounded-[var(--radius-control)] bg-accent-tint"
          />
        )}
        <span
          className={`relative min-w-0 truncate font-display text-body font-semibold transition-colors duration-[var(--duration-hover)] ${
            active ? 'text-accent' : 'text-fg group-hover:text-accent'
          }`}
        >
          {disease.displayName}
        </span>
        <span className="relative flex shrink-0 items-center gap-1.5 text-caption text-fg-secondary">
          <span aria-hidden className={`size-2.5 rounded-full ${dotClassName}`} />
          {label}
        </span>
      </button>
    </li>
  )
}

export function DiseaseList({ activeId, onSelect, highlight = false }: DiseaseListProps) {
  return (
    <div>
      {CONDITION_GROUPS.map(({ id: group, title }) => {
        const ids = diseases.filter((disease) => disease.group === group).map((disease) => disease.id)
        return (
          <section key={group} aria-label={title} className="mt-4 first:mt-0">
            <h3 className="px-3 pb-1 text-caption font-semibold text-fg-muted">{title}</h3>
            <ul>
              {ids.map((id) => (
                <DiseaseEntry key={id} diseaseId={id} active={id === activeId} highlight={highlight} onSelect={onSelect} />
              ))}
            </ul>
          </section>
        )
      })}
      <p className="mt-4 px-3 text-caption text-fg-muted">{SEVERITY_NOTE}</p>
    </div>
  )
}
