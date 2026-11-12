'use client'

import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { findReference } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import type { Reference } from '@/lib/types'

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 mb-2 text-caption font-semibold text-fg-muted">{children}</h3>
}

const DOT_TONES = { brand: 'bg-accent', coral: 'bg-danger', mint: 'bg-success' } as const

export function BulletList({ items, tone = 'brand' }: { items: string[]; tone?: keyof typeof DOT_TONES }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-caption text-fg-secondary">
          <span aria-hidden className={`mt-[7px] size-1.5 shrink-0 rounded-full ${DOT_TONES[tone]}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const SHORT_INSTITUTIONS: Record<string, string> = {
  'World Health Organization': 'WHO',
  'National Center for Biotechnology Information': 'NCBI',
  'Centers for Disease Control and Prevention': 'CDC',
  'American Dental Association': 'ADA',
  'Kementerian Kesehatan Republik Indonesia': 'Kemenkes RI',
  'International Caries Classification and Management System': 'ICCMS',
}

const YEAR_PATTERN = /(?:19|20)\d{2}/

function sourceLabel({ institution, publication, title }: Reference) {
  const year = publication.match(YEAR_PATTERN)?.[0] ?? title.match(YEAR_PATTERN)?.[0]
  return ['Sumber:', SHORT_INSTITUTIONS[institution] ?? institution, year].filter(Boolean).join(' ')
}

export function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  const openModal = useAppStore((state) => state.openModal)
  const sources = sourceIds.map(findReference).filter((reference) => reference !== undefined)
  return (
    <ul className="space-y-1">
      {sources.map((source) => (
        <li key={source.id}>
          <button
            type="button"
            title={source.title}
            onClick={() => openModal('references', source.id)}
            className="group flex min-h-10 w-full items-center gap-2 rounded-[var(--radius-control)] px-2 py-1.5 text-left text-caption hover:bg-[var(--button-ghost-bg-hover)]"
          >
            <span className="flex-1 font-semibold text-fg-secondary group-hover:text-fg">{sourceLabel(source)}</span>
            <BookOpen className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  )
}
