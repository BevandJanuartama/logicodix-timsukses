export type Dentition = 'primary' | 'permanent'

const OPTIONS: { id: Dentition; label: string }[] = [
  { id: 'primary', label: 'Gigi susu' },
  { id: 'permanent', label: 'Gigi dewasa' },
]

interface DentitionToggleProps {
  value: Dentition
  onChange: (value: Dentition) => void
}

export function DentitionToggle({ value, onChange }: DentitionToggleProps) {
  return (
    <div role="group" aria-label="Jenis gigi" className="flex gap-1 rounded-[var(--radius-control)] bg-surface-sunken p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className="min-h-10 flex-1 cursor-pointer rounded-[var(--radius-control)] text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
