import { CheckCircle2, XCircle } from 'lucide-react'

export type AnswerOutcome = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed'

interface AnswerOptionProps {
  position: number
  label: string
  outcome: AnswerOutcome
  disabled: boolean
  onSelect: () => void
}

const OUTCOME_CLASSES: Record<AnswerOutcome, string> = {
  idle: 'border-line bg-[var(--chip-bg)] text-fg hover:border-line-strong',
  selected: 'border-accent bg-[var(--chip-bg)] text-fg',
  correct: 'border-success bg-success/10 text-fg',
  wrong: 'border-danger bg-danger/10 text-fg',
  dimmed: 'border-line text-fg-muted opacity-60',
}

export function AnswerOption({ position, label, outcome, disabled, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={outcome === 'selected' || outcome === 'correct' || outcome === 'wrong'}
      data-quiz-option
      disabled={disabled}
      onClick={onSelect}
      className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border px-3 py-2 text-left text-body font-semibold transition-[transform,opacity] duration-[var(--duration-press)] ease-[var(--ease-out)] enabled:active:scale-[var(--scale-press)] focus-visible:outline-2 focus-visible:outline-accent ${OUTCOME_CLASSES[outcome]}`}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-[var(--radius-control)] border border-line text-caption text-fg-secondary">
        {position}
      </span>
      <span className="flex-1 leading-snug">{label}</span>
      {outcome === 'correct' && (
        <span className="flex items-center gap-1 text-caption text-success">
          <CheckCircle2 className="size-4" aria-hidden />
          Benar
        </span>
      )}
      {outcome === 'wrong' && (
        <span className="flex items-center gap-1 text-caption text-danger">
          <XCircle className="size-4" aria-hidden />
          Pilihanmu
        </span>
      )}
    </button>
  )
}
