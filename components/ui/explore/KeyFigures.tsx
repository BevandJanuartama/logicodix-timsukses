import { toothTypes } from '@/lib/knowledgeBase'

const permanentTotal = toothTypes.reduce((sum, type) => sum + type.permanentCount, 0)
const primaryTotal = toothTypes.reduce((sum, type) => sum + type.primaryCount, 0)

export function KeyFigures() {
  return (
    <p className="tabular-nums rounded-[var(--radius-control)] bg-surface-sunken p-3 text-body text-fg-secondary">
      <span className="font-display text-title font-semibold text-fg">{permanentTotal}</span> gigi dewasa,{' '}
      <span className="font-display text-title font-semibold text-fg">{primaryTotal}</span> gigi susu
    </p>
  )
}
