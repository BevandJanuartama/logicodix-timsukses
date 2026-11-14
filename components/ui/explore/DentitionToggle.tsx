'use client'

import { useAppStore } from '@/lib/store'
import type { Dentition } from '@/lib/types'

export type { Dentition }

const OPTIONS: { id: Dentition; label: string }[] = [
  { id: 'primary', label: 'Gigi susu' },
  { id: 'permanent', label: 'Gigi dewasa' },
]

interface DentitionToggleProps {
  value?: Dentition
  onChange?: (value: Dentition) => void
}

/** Uncontrolled use drives the 3D scene through the store; pass value/onChange to control it locally instead. */
export function DentitionToggle({ value: controlledValue, onChange }: DentitionToggleProps) {
  const storeValue = useAppStore((state) => state.dentition)
  const setDentition = useAppStore((state) => state.setDentition)
  const value = controlledValue ?? storeValue
  const choose = onChange ?? setDentition
  return (
    <div role="group" aria-label="Jenis gigi" className="flex gap-1 rounded-[var(--radius-control)] bg-surface-sunken p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => choose(option.id)}
          className="min-h-10 flex-1 cursor-pointer rounded-[var(--radius-control)] text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
