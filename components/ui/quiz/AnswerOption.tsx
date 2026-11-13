import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

export type AnswerOutcome = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed'

interface AnswerOptionProps {
  letter: string
  label: string
  outcome: AnswerOutcome
  disabled: boolean
  onSelect: () => void
}

const OUTCOME_CLASSES: Record<AnswerOutcome, string> = {
  idle: 'bg-surface-sunken text-fg hover:bg-accent-tint',
  selected: 'bg-accent-tint text-fg outline-2 outline-accent',
  correct: 'bg-success-tint text-fg outline-2 outline-success',
  wrong: 'bg-danger-tint text-fg outline-2 outline-danger',
  dimmed: 'bg-surface-sunken text-fg-muted opacity-60',
}

const LETTER_CLASSES: Record<AnswerOutcome, string> = {
  idle: 'bg-surface text-fg-secondary',
  selected: 'bg-accent-fill text-on-accent',
  correct: 'bg-success text-on-accent',
  wrong: 'bg-danger text-on-accent',
  dimmed: 'bg-surface text-fg-muted',
}

export function AnswerOption({ letter, label, outcome, disabled, onSelect }: AnswerOptionProps) {
  const reduceMotion = useReducedMotion()
  const shake = outcome === 'wrong' && !reduceMotion

  return (
    <motion.div animate={{ x: shake ? [0, -4, 4, -2, 0] : 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
      <button
        type="button"
        role="radio"
        aria-checked={outcome === 'selected' || outcome === 'correct' || outcome === 'wrong'}
        data-quiz-option
        disabled={disabled}
        onClick={onSelect}
        className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-left text-body transition-[transform,opacity] duration-[var(--duration-press)] ease-[var(--ease-out)] enabled:active:scale-[var(--scale-press)] focus-visible:outline-2 focus-visible:outline-accent ${OUTCOME_CLASSES[outcome]}`}
      >
        <span
          aria-hidden
          className={`grid size-8 shrink-0 place-items-center rounded-full text-caption font-semibold ${LETTER_CLASSES[outcome]}`}
        >
          {letter}
        </span>
        <span className="flex-1 leading-snug">{label}</span>
        {outcome === 'correct' && (
          <span className="flex items-center gap-1 text-caption font-semibold text-success">
            <CheckCircle2 className="size-5" aria-hidden />
            Benar
          </span>
        )}
        {outcome === 'wrong' && (
          <span className="flex items-center gap-1 text-caption font-semibold text-danger">
            <XCircle className="size-5" aria-hidden />
            Pilihanmu
          </span>
        )}
      </button>
    </motion.div>
  )
}
