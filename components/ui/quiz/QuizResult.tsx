'use client'

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { quizQuestions } from '@/lib/knowledgeBase'
import { useQuizStore } from '@/lib/quizStore'
import { useAppStore } from '@/lib/store'
import { ExploreDisclosure } from '@/components/ui/explore/ExploreDisclosure'
import { resetQuizScene } from './quizScene'

const ENCOURAGEMENT = [
  { min: 0.85, message: 'Hasil yang bagus. Kamu sudah menguasai sebagian besar materinya.' },
  { min: 0.6, message: 'Sudah cukup baik. Lihat lagi soal yang terlewat, lalu coba kembali.' },
  { min: 0, message: 'Awal yang baik. Jelajahi modelnya sebentar, lalu ulangi kuisnya.' },
]

export function QuizResult() {
  const answers = useQuizStore((state) => state.answers)
  const restart = useQuizStore((state) => state.restart)
  const setMode = useAppStore((state) => state.setMode)
  const total = quizQuestions.length
  const score = quizQuestions.filter((question) => answers[question.id] === question.correctIndex).length
  const ratio = score / total
  const message = (ENCOURAGEMENT.find((item) => ratio >= item.min) ?? ENCOURAGEMENT[ENCOURAGEMENT.length - 1]).message

  return (
    <section aria-label="Hasil kuis">
      <div className="rounded-[var(--radius-control)] bg-surface-sunken p-6 text-center">
        <p className="font-display text-title font-semibold text-fg tabular-nums">
          {score} dari {total}
        </p>
        <p className="mt-2 text-body text-fg-secondary">{message}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          resetQuizScene()
          restart()
        }}
        className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--button-primary-bg)] px-4 text-body font-semibold text-[var(--button-primary-fg)] transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-primary-bg-hover)] active:scale-[var(--scale-press)]"
      >
        <RotateCcw className="size-4" aria-hidden />
        Ulangi kuis
      </button>
      <button
        type="button"
        onClick={() => setMode('explore')}
        className="mt-1 min-h-11 w-full cursor-pointer text-body font-semibold text-fg-secondary underline-offset-4 hover:text-fg hover:underline"
      >
        Kembali ke Anatomi
      </button>

      <ExploreDisclosure label="Ulasan jawaban">
        <ol className="space-y-2">
          {quizQuestions.map((question, index) => {
            const correct = answers[question.id] === question.correctIndex
            return (
              <li key={question.id} className="flex items-start gap-2.5 text-body text-fg-secondary">
                {correct ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Benar" />
                ) : (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-label="Salah" />
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
