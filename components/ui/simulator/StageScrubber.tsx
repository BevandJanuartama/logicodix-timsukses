'use client'

import { useRef, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const INDICATOR_SPRING = { type: 'spring', stiffness: 420, damping: 34 } as const

interface StageScrubberItem {
  id: string
  stageNumber: number
}

interface StageScrubberProps {
  label: string
  items: StageScrubberItem[]
  activeIndex: number
  indicatorId: string
  onSelect: (index: number) => void
}

export function StageScrubber({ label, items, activeIndex, indicatorId, onSelect }: StageScrubberProps) {
  const reduceMotion = useReducedMotion()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const moveBy = (step: number) => {
    const next = Math.min(items.length - 1, Math.max(0, activeIndex + step))
    onSelect(next)
    buttons.current[next]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') moveBy(1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') moveBy(-1)
    else if (event.key === 'Home') moveBy(-items.length)
    else if (event.key === 'End') moveBy(items.length)
    else return
    event.preventDefault()
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} className="flex gap-1 rounded-[var(--radius-control)] border border-line bg-surface-sunken p-1">
      {items.map((item, index) => {
        const active = index === activeIndex
        return (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[index] = node
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(index)}
            className={`relative min-h-12 flex-1 cursor-pointer rounded-[var(--radius-control)] px-1 text-center transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] ${
              active ? 'text-on-accent' : 'text-fg-secondary hover:text-fg'
            }`}
          >
            {active && (
              <motion.span
                layoutId={indicatorId}
                className="absolute inset-0 rounded-[var(--radius-control)] bg-accent-fill"
                transition={reduceMotion ? { duration: 0 } : INDICATOR_SPRING}
              />
            )}
            <span className="relative block text-[17px] leading-tight font-semibold tabular-nums">{item.stageNumber}</span>
            <span className="telemetry relative block truncate text-[10px] opacity-70">{item.id}</span>
          </button>
        )
      })}
    </div>
  )
}
