import { Candy, CigaretteOff, ChevronDown, Sparkles, Stethoscope, Waypoints, type LucideIcon } from 'lucide-react'
import { preventionTopics } from '@/lib/knowledgeBase'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'PRE-001': Sparkles,
  'PRE-002': Waypoints,
  'PRE-003': Candy,
  'PRE-004': Stethoscope,
  'PRE-005': CigaretteOff,
}

export function PreventionPillars() {
  return (
    <div className="divide-y divide-line">
      {preventionTopics.map((topic) => {
        const Icon = PILLAR_ICONS[topic.id] ?? Sparkles
        return (
          <details key={topic.id} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 text-caption font-semibold text-fg hover:text-accent [&::-webkit-details-marker]:hidden">
              <Icon className="size-4 shrink-0 text-accent" aria-hidden />
              <span className="flex-1">{topic.topic}</span>
              <ChevronDown className="size-4 text-fg-muted transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180" aria-hidden />
            </summary>
            <div className="pb-3 pl-6.5">
              <p className="text-caption text-fg-secondary">{topic.message}</p>
              <p className="mt-1 text-caption text-fg-muted">{topic.sourceLabel}</p>
            </div>
          </details>
        )
      })}
    </div>
  )
}
