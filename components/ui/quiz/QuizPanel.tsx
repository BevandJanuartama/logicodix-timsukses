'use client'

import { quizQuestions } from '@/lib/knowledgeBase'
import { useQuizStore } from '@/lib/quizStore'
import { QuestionCard } from './QuestionCard'
import { QuizResult } from './QuizResult'

export function QuizPanel() {
  const index = useQuizStore((state) => state.index)
  const checked = useQuizStore((state) => state.checked)
  const total = quizQuestions.length
  const finished = index >= total
  const answeredCount = Math.min(total, index + (checked ? 1 : 0))
  const question = quizQuestions[index]

  return (
    <div className="pb-2">
      <h2 className="text-xl font-extrabold tracking-tight">Kuis pemahaman</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
        {total} soal tentang anatomi, periodontal, penyakit, dan pencegahan. Setiap jawaban disertai pembahasan dan
        sumber.
      </p>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-[12px] font-semibold text-ink/60">
          <span>{finished ? 'Selesai' : `Soal ${index + 1} dari ${total}`}</span>
          <span className="tabular-nums">{Math.round((answeredCount / total) * 100)}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answeredCount}
          aria-label="Progres kuis"
          className="h-2 overflow-hidden rounded-full bg-ink/10"
        >
          <div
            className="h-full origin-left rounded-full bg-amber transition-transform duration-300"
            style={{ transform: `scaleX(${answeredCount / total})` }}
          />
        </div>
      </div>

      <div className="mt-5">
        {finished || !question ? (
          <QuizResult />
        ) : (
          <QuestionCard key={question.id} question={question} isLast={index === total - 1} />
        )}
      </div>
    </div>
  )
}
