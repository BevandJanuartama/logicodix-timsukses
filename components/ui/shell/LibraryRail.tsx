'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

export type RailStatus = 'ok' | 'warn' | 'danger'

export interface RailItem {
  id: string
  title: string
  subtitle?: string
  thumbnail?: ReactNode
  status?: RailStatus
}

interface LibraryRailProps {
  title: string
  items: RailItem[]
  activeId: string | null
  onSelect: (id: string) => void
}

const STATUS_DOT: Record<RailStatus, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  danger: 'bg-danger',
}

const HIGHLIGHT_TRANSITION = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const

function ThumbnailPlaceholder() {
  return (
    <span aria-hidden className="grid size-full place-items-center">
      <span className="h-7 w-6 rounded-[45%_45%_40%_40%] bg-surface-sunken" />
    </span>
  )
}

export function RailThumbnail({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt=""
      onLoad={() => setLoaded(true)}
      className={`size-full rounded-[var(--radius-control)] object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

function RailEntry({ item, active, onSelect }: { item: RailItem; active: boolean; onSelect: (id: string) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        aria-current={active ? 'true' : undefined}
        className="group relative flex min-h-[72px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius-control)] p-2 text-left transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
      >
        {active && (
          <motion.span
            layoutId="rail-active"
            transition={HIGHLIGHT_TRANSITION}
            aria-hidden
            className="absolute inset-0 rounded-[var(--radius-control)] bg-accent-tint"
          />
        )}
        <span
          aria-hidden={!item.thumbnail}
          className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-surface-sand"
        >
          {item.thumbnail ?? <ThumbnailPlaceholder />}
        </span>
        <span className="relative min-w-0 flex-1">
          <span
            className={`block truncate font-display text-body font-semibold transition-colors duration-[var(--duration-hover)] ${
              active ? 'text-accent' : 'text-fg group-hover:text-accent'
            }`}
          >
            {item.title}
          </span>
          {item.subtitle && (
            <span className="mt-0.5 flex items-center gap-1.5 text-caption text-fg-secondary">
              {item.status && <span aria-hidden className={`size-2 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} />}
              <span className="truncate">{item.subtitle}</span>
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

export function LibraryRail({ title, items, activeId, onSelect }: LibraryRailProps) {
  return (
    <nav aria-label={title} className="panel flex min-h-0 w-full flex-col">
      <h2 className="shrink-0 px-5 pt-5 pb-3 text-caption font-semibold text-fg-secondary">{title}</h2>
      <ul className="thin-scroll min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-3">
        {items.map((item) => (
          <RailEntry key={item.id} item={item} active={item.id === activeId} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  )
}
