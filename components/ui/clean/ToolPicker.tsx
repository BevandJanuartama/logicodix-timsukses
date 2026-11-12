'use client'

import { useCleaningStore } from '@/lib/cleaningStore'
import { CLEAN_TOOLS } from './cleanTools'

export function ToolPicker() {
  const tool = useCleaningStore((state) => state.tool)
  const setTool = useCleaningStore((state) => state.setTool)

  return (
    <div role="radiogroup" aria-label="Alat pembersih" className="grid gap-2">
      {CLEAN_TOOLS.map((item) => {
        const Icon = item.icon
        const active = item.id === tool
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTool(item.id)}
            className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[var(--radius-control)] p-2.5 text-left transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] ${
              active ? 'bg-accent-tint text-accent' : 'bg-surface-sunken text-fg hover:bg-surface-sand'
            }`}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-thumb)] bg-surface-sand text-accent">
              <Icon className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-body font-semibold leading-snug">{item.name}</span>
              <span className="mt-0.5 block truncate text-caption text-fg-muted">{item.area}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
