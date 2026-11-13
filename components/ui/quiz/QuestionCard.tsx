'use client'

import { useCallback } from 'react'
import { quizFocus } from '@/lib/data/quizFocus'
import { useQuizStore } from '@/lib/quizStore'
import type { QuizQuestion } from '@/lib/types'
import { AnswerFeedback } from './AnswerFeedback'
import { AnswerOption, type AnswerOutcome } from './AnswerOption'
import { resetQuizScene, showQuestionInScene } from './quizScene'
import { useQuizKeyboard } from './useQuizKeyboard'

const LETTERS = ['A', 'B', 'C', 'D']

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
    if (checked) {
      resetQuizScene()
      next()
    } else if (selected !== null) {
      check(question.id)
      showQuestionInScene(question.id)
    }
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
      <p className="text-caption text-fg-muted">{question.topic}</p>
      <h3 id={`${question.id}-prompt`} className="font-display mt-1 text-subtitle font-semibold text-fg">
        {question.question}
      </h3>

      <div role="radiogroup" aria-labelledby={`${question.id}-prompt`} className="mt-4 space-y-2.5">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option}
            letter={LETTERS[index] ?? String(index + 1)}
            label={option}
            outcome={outcomeFor(index, question, selected, checked)}
            disabled={checked}
            onSelect={() => select(index)}
          />
        ))}
      </div>

      {checked && <AnswerFeedback question={question} correct={correct} hasFocus={Boolean(quizFocus[question.id])} />}

      <button
        type="button"
        disabled={!checked && selected === null}
        onClick={confirm}
        className="mt-5 min-h-12 w-full cursor-pointer rounded-[var(--radius-control)] bg-[var(--button-primary-bg)] px-4 text-body font-semibold text-[var(--button-primary-fg)] transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-primary-bg-hover)] enabled:active:scale-[var(--scale-press)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!checked ? 'Periksa' : isLast ? 'Lihat skor' : 'Berikutnya'}
      </button>
      <p className="mt-2 hidden text-center text-caption text-fg-muted pointer-fine:block">
        Tekan A sampai D untuk memilih, Enter untuk lanjut
      </p>
    </article>
  )
}
