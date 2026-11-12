import type { ReactNode } from 'react'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'info'

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--chip-bg)] text-fg-secondary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  info: 'bg-info/15 text-info',
}

interface BadgeProps {
  tone?: BadgeTone
  icon?: ReactNode
  title?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', icon, title, children }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-control)] px-1.5 py-0.5 text-caption font-semibold ${TONE_CLASSES[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}
