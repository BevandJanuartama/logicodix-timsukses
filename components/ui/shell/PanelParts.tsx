'use client'

import type { ReactNode } from 'react'

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
