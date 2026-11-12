import { Candy, CigaretteOff, ChevronDown, Sparkles, Stethoscope, Waypoints, type LucideIcon } from 'lucide-react'
import { preventionTopics } from '@/lib/knowledgeBase'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  'PRE-001': Sparkles,
  'PRE-002': Waypoints,
  'PRE-003': Candy,
  'PRE-004': Stethoscope,
  'PRE-005': CigaretteOff,
}

export function PreventionPillars() {
  return (
    <section aria-labelledby="prevention-title">
      <SectionTitle>
        <span id="prevention-title">5 pilar pencegahan</span>
      </SectionTitle>
      {preventionTopics.map((topic) => {
        const Icon = PILLAR_ICONS[topic.id] ?? Sparkles
        return (
          <details key={topic.id} className="group border-t border-line first:border-t-0">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 text-caption font-semibold text-fg hover:text-accent [&::-webkit-details-marker]:hidden">
              <Icon className="size-4 shrink-0 text-accent" aria-hidden />
              <span className="flex-1">{topic.topic}</span>
              <ChevronDown className="size-4 text-fg-muted transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180" aria-hidden />
            </summary>
            <div className="pb-3 pl-6.5">
              <p className="text-caption text-fg-secondary">{topic.message}</p>
              <p className="mt-1.5 text-caption text-fg-muted">
                {topic.id} · {topic.sourceLabel}
              </p>
            </div>
          </details>
        )
      })}
    </section>
  )
}
