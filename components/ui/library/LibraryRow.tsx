import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface LibraryRowProps {
  summary: ReactNode
  trailing?: ReactNode
  children: ReactNode
  rowId?: string
  current?: boolean
}

export function LibraryRow({ summary, trailing, children, rowId, current }: LibraryRowProps) {
  return (
    <li
      data-row={rowId}
      aria-current={current ? 'true' : undefined}
      className="flex items-start gap-1 border-t border-line first:border-t-0 aria-[current=true]:bg-[var(--chip-bg)]"
    >
      <details open={current || undefined} className="group min-w-0 flex-1">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-2 py-1.5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0 flex-1">{summary}</div>
          <ChevronDown
            className="size-4 shrink-0 text-fg-muted transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-1.5 px-2 pb-3 text-[13px] leading-snug text-fg-secondary">{children}</div>
      </details>
      {trailing}
    </li>
  )
}
