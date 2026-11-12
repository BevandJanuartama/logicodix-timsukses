'use client'

import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { findReference } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'

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

export function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  const openModal = useAppStore((state) => state.openModal)
  const sources = sourceIds.map(findReference).filter((reference) => reference !== undefined)
  return (
    <ul className="space-y-1">
      {sources.map((source) => (
        <li key={source.id}>
          <button
            type="button"
            onClick={() => openModal('references', source.id)}
            className="group flex w-full items-start gap-2 rounded-[var(--radius-control)] px-2 py-1.5 text-left text-caption hover:bg-[var(--button-ghost-bg-hover)]"
          >
            <span className="mt-px text-caption font-semibold text-accent">{source.id}</span>
            <span className="flex-1 text-fg-secondary group-hover:text-fg">
              {source.institution} — {source.title}
            </span>
            <BookOpen className="mt-0.5 size-3.5 shrink-0 text-fg-muted" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  )
}
