'use client'

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { quizQuestions } from '@/lib/knowledgeBase'
import { useQuizStore } from '@/lib/quizStore'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'

const FEEDBACK = [
  { min: 0.85, message: 'Pemahaman sangat baik.' },
  { min: 0.6, message: 'Sudah baik. Tinjau soal yang terlewat.' },
  { min: 0, message: 'Jelajahi modul Anatomi dan Penyakit, lalu ulangi.' },
]

export function QuizResult() {
  const answers = useQuizStore((state) => state.answers)
  const restart = useQuizStore((state) => state.restart)
  const score = quizQuestions.filter((question) => answers[question.id] === question.correctIndex).length
  const ratio = score / quizQuestions.length
  const feedback = FEEDBACK.find((item) => ratio >= item.min) ?? FEEDBACK[FEEDBACK.length - 1]

  return (
    <section aria-label="Hasil kuis">
      <div className="rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-5 text-center">
        <p className="text-caption font-semibold text-fg-muted">Skor akhir</p>
        <p className="font-display mt-1 text-6xl font-bold text-fg tabular-nums">
          {score}
          <span className="font-display text-title text-fg-muted">/{quizQuestions.length}</span>
        </p>
        <p className="mt-2 text-caption text-fg-secondary">{feedback.message}</p>
      </div>

      <button
        type="button"
        onClick={restart}
        className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--button-primary-bg)] px-4 text-caption font-semibold text-[var(--button-primary-fg)] transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-primary-bg-hover)] active:scale-[var(--scale-press)]"
      >
        <RotateCcw className="size-4" aria-hidden />
        Ulangi kuis
      </button>

      <ExploreDisclosure label="Ringkasan jawaban">
        <ol className="space-y-1.5">
          {quizQuestions.map((question, index) => {
            const correct = answers[question.id] === question.correctIndex
            return (
              <li key={question.id} className="flex items-start gap-2.5 text-caption text-fg-secondary">
                {correct ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Benar" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Salah" />
                )}
                <span>
                  <span className="tabular-nums font-semibold text-fg">{index + 1}.</span> {question.question}
                  {!correct && (
                    <span className="mt-0.5 block text-caption text-fg-muted">
                      Jawaban: {question.options[question.correctIndex]}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ol>
      </ExploreDisclosure>
    </section>
  )
}
