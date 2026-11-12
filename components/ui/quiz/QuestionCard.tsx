'use client'

import { useCallback } from 'react'
import { quizFocus } from '@/lib/data/quizFocus'
import { useQuizStore } from '@/lib/quizStore'
import type { QuizQuestion } from '@/lib/types'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { AnswerFeedback } from './AnswerFeedback'
import { AnswerOption, type AnswerOutcome } from './AnswerOption'
import { useQuizKeyboard } from './useQuizKeyboard'

function outcomeFor(index: number, question: QuizQuestion, selected: number | null, checked: boolean): AnswerOutcome {
  if (!checked) return index === selected ? 'selected' : 'idle'
  if (index === question.correctIndex) return 'correct'
  return index === selected ? 'wrong' : 'dimmed'
}

export function QuestionCard({ question, isLast }: { question: QuizQuestion; isLast: boolean }) {
  const selected = useQuizStore((state) => state.selected)
  const checked = useQuizStore((state) => state.checked)
  const select = useQuizStore((state) => state.select)
  const check = useQuizStore((state) => state.check)
  const next = useQuizStore((state) => state.next)
  const correct = checked && selected === question.correctIndex

  const confirm = useCallback(() => {
    if (checked) next()
    else if (selected !== null) check(question.id)
  }, [checked, selected, check, next, question.id])

  useQuizKeyboard({
    optionCount: question.options.length,
    selected,
    checked,
    onSelect: select,
    onConfirm: confirm,
  })

  return (
    <article>
      <div className="flex items-center gap-2 text-caption font-semibold text-fg-muted">
        <span>{question.topic}</span>
        <span aria-hidden>·</span>
        <span>{question.id}</span>
        <StatusBadge contentId={question.id} baseStatus={question.status} />
      </div>
      <h3 id={`${question.id}-prompt`} className="mt-2 text-body font-bold text-fg">
        {question.question}
      </h3>

      <div role="radiogroup" aria-labelledby={`${question.id}-prompt`} className="mt-3 space-y-2">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option}
            position={index + 1}
            label={option}
            outcome={outcomeFor(index, question, selected, checked)}
            disabled={checked}
            onSelect={() => select(index)}
          />
        ))}
      </div>

      {checked && <AnswerFeedback question={question} correct={correct} focus={quizFocus[question.id]} />}

      <button
        type="button"
        disabled={!checked && selected === null}
        onClick={confirm}
        className="mt-4 min-h-11 w-full cursor-pointer rounded-[var(--radius-control)] bg-[var(--button-primary-bg)] px-4 text-caption font-semibold text-[var(--button-primary-fg)] transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-primary-bg-hover)] enabled:active:scale-[var(--scale-press)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!checked ? 'Periksa' : isLast ? 'Lihat skor' : 'Berikutnya'}
      </button>
      <p className="mt-2 hidden text-center text-caption text-fg-muted md:block">1–4 pilih · Enter lanjut</p>
    </article>
  )
}
