import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Eye, XCircle } from 'lucide-react'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { SourceLinks } from '@/components/ui/shell/PanelParts'
import type { QuizQuestion } from '@/lib/types'
import { showQuestionInScene } from './quizScene'

interface AnswerFeedbackProps {
  question: QuizQuestion
  correct: boolean
  hasFocus: boolean
}

export function AnswerFeedback({ question, correct, hasFocus }: AnswerFeedbackProps) {
  const reduceMotion = useReducedMotion()
  const Icon = correct ? CheckCircle2 : XCircle

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={`mt-4 rounded-[var(--radius-control)] p-4 ${correct ? 'bg-success-tint' : 'bg-danger-tint'}`}
    >
      <p className={`flex items-center gap-2 text-body font-semibold ${correct ? 'text-success' : 'text-danger'}`}>
        <Icon className="size-5" aria-hidden />
        {correct ? 'Benar' : 'Belum tepat'}
      </p>
      <p className="mt-1 text-body text-fg">{question.explanation}</p>
      {hasFocus && (
        <button
          type="button"
          onClick={() => showQuestionInScene(question.id)}
          className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] bg-surface px-3 text-caption font-semibold text-fg transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
        >
          <Eye className="size-4" aria-hidden />
          Lihat lagi di 3D
        </button>
      )}
      <ExploreDisclosure label="Sumber">
        <SourceLinks sourceIds={question.sourceIds} />
      </ExploreDisclosure>
    </motion.div>
  )
}
