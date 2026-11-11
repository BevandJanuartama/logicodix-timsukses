import { preventionTopics } from '@/lib/knowledgeBase'
import { SectionTitle } from '@/components/ui/shell/PanelParts'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'

export function PreventionPillars() {
  return (
    <section aria-labelledby="prevention-title">
      <SectionTitle>
        <span id="prevention-title">5 pilar pencegahan</span>
      </SectionTitle>
      <ol className="relative space-y-3 border-l-2 border-mint/30 pl-4">
        {preventionTopics.map((topic, index) => (
          <li key={topic.id} className="relative">
            <span
              aria-hidden
              className="absolute top-0.5 -left-[25px] grid size-4 place-items-center rounded-full bg-mint text-[9px] font-extrabold text-white tabular-nums"
            >
              {index + 1}
            </span>
            <p className="flex items-center gap-2 text-[13.5px] font-extrabold">
              {topic.topic}
              <StatusBadge contentId={topic.id} baseStatus={topic.status} />
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink/75">{topic.message}</p>
            <p className="mt-1 text-[11.5px] text-ink/50">
              {topic.implementationNote} · <span className="font-semibold">{topic.sourceLabel}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
