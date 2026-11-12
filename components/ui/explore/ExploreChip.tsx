import type { ReactNode } from 'react'

interface ExploreChipProps {
  children: ReactNode
  onClick: () => void
  pressed?: boolean
  swatch?: string
  tone?: 'default' | 'danger'
}

const TONE_CLASSES = {
  default: 'text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent',
  danger: 'text-danger hover:text-fg',
} as const

export function ExploreChip({ children, onClick, pressed, swatch, tone = 'default' }: ExploreChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex min-h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-2.5 text-[13px] font-semibold transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)] ${TONE_CLASSES[tone]}`}
    >
      {swatch && <span aria-hidden className="size-2.5 shrink-0 rounded-full ring-1 ring-line-strong" style={{ background: swatch }} />}
      {children}
    </button>
  )
}
