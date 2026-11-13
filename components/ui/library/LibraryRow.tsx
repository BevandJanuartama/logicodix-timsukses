import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface LibraryRowProps {
  summary: ReactNode
  footer?: ReactNode
  children: ReactNode
  rowId?: string
  current?: boolean
}

export function LibraryRow({ summary, footer, children, rowId, current }: LibraryRowProps) {
  return (
    <li
      data-row={rowId}
      aria-current={current ? 'true' : undefined}
      className="mb-2 rounded-[var(--radius-control)] bg-surface-sunken px-3 py-1 last:mb-0 aria-[current=true]:bg-accent-tint"
    >
      <details open={current || undefined} className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 py-2 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0 flex-1">{summary}</div>
          <ChevronDown
            className="size-5 shrink-0 text-fg-muted transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-1.5 pb-3 text-caption text-fg-secondary">{children}</div>
      </details>
      {footer}
    </li>
  )
}
