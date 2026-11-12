import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Eye, XCircle } from 'lucide-react'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { SourceLinks } from '@/components/ui/shell/PanelParts'
import { focusScene, type SceneFocus } from '@/lib/sceneFocus'
import type { QuizQuestion } from '@/lib/types'

interface AnswerFeedbackProps {
  question: QuizQuestion
  correct: boolean
  focus: SceneFocus | undefined
}

export function AnswerFeedback({ question, correct, focus }: AnswerFeedbackProps) {
  const reduceMotion = useReducedMotion()
  const Icon = correct ? CheckCircle2 : XCircle

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={`mt-3 rounded-[var(--radius-control)] border p-3 ${correct ? 'border-success bg-success/10' : 'border-danger bg-danger/10'}`}
    >
      <p className={`flex items-center gap-1.5 text-body font-bold ${correct ? 'text-success' : 'text-danger'}`}>
        <Icon className="size-4" aria-hidden />
        {correct ? 'Benar' : 'Belum tepat'}
      </p>
      <p className="mt-1 text-caption text-fg-secondary">{question.explanation}</p>
      {focus && (
        <button
          type="button"
          onClick={() => focusScene(focus)}
          className="mt-2 flex min-h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-2.5 text-caption font-semibold text-fg transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
        >
          <Eye className="size-4" aria-hidden />
          Tunjukkan di 3D
        </button>
      )}
      <ExploreDisclosure label="Sumber">
        <SourceLinks sourceIds={question.sourceIds} />
      </ExploreDisclosure>
    </motion.div>
  )
}
