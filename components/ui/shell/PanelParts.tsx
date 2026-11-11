'use client'

import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { findReference } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 mb-2 text-[11px] font-bold tracking-[0.12em] text-ink/50 uppercase">{children}</h3>
}

const DOT_TONES = { brand: 'bg-brand', coral: 'bg-coral', mint: 'bg-mint' } as const

export function BulletList({ items, tone = 'brand' }: { items: string[]; tone?: keyof typeof DOT_TONES }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-ink/80">
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
            className="group flex w-full items-start gap-2 rounded-xl px-2 py-1.5 text-left text-[13px] leading-snug hover:bg-brand-50"
          >
            <span className="mt-px font-mono text-[11px] font-bold text-brand tabular-nums">{source.id}</span>
            <span className="flex-1 text-ink/75 group-hover:text-ink">
              {source.institution} — {source.title}
            </span>
            <BookOpen className="mt-0.5 size-3.5 shrink-0 text-ink/35" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  )
}
