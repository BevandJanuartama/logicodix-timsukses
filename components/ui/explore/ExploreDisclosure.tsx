import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export function ExploreDisclosure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group mt-2 rounded-[var(--radius-control)] bg-surface-sunken px-3">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-caption font-semibold text-fg-secondary hover:text-fg [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pt-1 pb-3">{children}</div>
    </details>
  )
}
