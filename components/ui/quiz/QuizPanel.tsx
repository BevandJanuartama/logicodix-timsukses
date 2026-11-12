'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { quizQuestions } from '@/lib/knowledgeBase'
import { useQuizStore } from '@/lib/quizStore'
import { QuestionCard } from './QuestionCard'
import { QuizResult } from './QuizResult'

export function QuizPanel() {
  const index = useQuizStore((state) => state.index)
  const checked = useQuizStore((state) => state.checked)
  const reduceMotion = useReducedMotion()
  const total = quizQuestions.length
  const finished = index >= total
  const answeredCount = Math.min(total, index + (checked ? 1 : 0))
  const question = quizQuestions[index]
  const stepKey = finished || !question ? 'result' : question.id

  return (
    <div className="px-3 pb-3">
      <div className="telemetry mb-1.5 flex justify-between text-[11px] font-semibold text-fg-muted uppercase">
        <span>{finished ? 'Selesai' : `Soal ${index + 1}/${total}`}</span>
        <span className="tabular-nums">{Math.round((answeredCount / total) * 100)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answeredCount}
        aria-label="Progres kuis"
        className="h-1 overflow-hidden rounded-full bg-[var(--chip-bg)]"
      >
        <div
          className="h-full origin-left rounded-full bg-accent-fill transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)]"
          style={{ transform: `scaleX(${answeredCount / total})` }}
        />
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {question && !finished ? <QuestionCard question={question} isLast={index === total - 1} /> : <QuizResult />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
