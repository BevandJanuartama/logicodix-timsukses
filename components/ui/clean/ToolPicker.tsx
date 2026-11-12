'use client'

import { useCleaningStore } from '@/lib/cleaningStore'
import { CLEAN_TOOLS } from './cleanTools'

export function ToolPicker() {
  const tool = useCleaningStore((state) => state.tool)
  const setTool = useCleaningStore((state) => state.setTool)
  const active = CLEAN_TOOLS.find((item) => item.id === tool) ?? CLEAN_TOOLS[0]

  return (
    <div>
      <div role="radiogroup" aria-label="Alat pembersih" className="flex gap-1 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-1">
        {CLEAN_TOOLS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === tool}
              onClick={() => setTool(item.id)}
              className="flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-fg-secondary transition-[transform,background-color] duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] aria-checked:bg-accent-fill aria-checked:text-on-accent"
            >
              <Icon className="size-4 shrink-0" />
              {item.name}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-caption text-fg-secondary">{active.hint}</p>
    </div>
  )
}
