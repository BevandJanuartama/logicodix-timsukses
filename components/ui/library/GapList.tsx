import { researchGaps } from '@/lib/knowledgeBase'
import { Badge } from '@/components/ui/shell/Badge'
import { LibraryRow } from './LibraryRow'

export function GapList() {
  return (
    <ul>
      {researchGaps.map((gap) => (
        <LibraryRow
          key={gap.id}
          summary={
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold text-warning">{gap.id}</span>
              <span className="min-w-0 flex-1 truncate text-body font-semibold text-fg">{gap.area}</span>
              <Badge tone="warning">{gap.status}</Badge>
            </div>
          }
        >
          <p className="text-fg">{gap.dataNeeded}</p>
          <p>Alasan: {gap.reason}</p>
          <p>Sumber disarankan: {gap.suggestedSource}</p>
        </LibraryRow>
      ))}
    </ul>
  )
}
