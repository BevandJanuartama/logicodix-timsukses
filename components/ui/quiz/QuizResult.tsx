'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { quizQuestions } from '@/lib/knowledgeBase'
import { useQuizStore } from '@/lib/quizStore'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

const FEEDBACK = [
  { min: 0.85, message: 'Pemahaman yang sangat baik.' },
  { min: 0.6, message: 'Sudah baik; tinjau pembahasan soal yang terlewat.' },
  { min: 0, message: 'Coba jelajahi modul Anatomi dan Penyakit, lalu ulangi kuis.' },
]

export function QuizResult() {
  const answers = useQuizStore((state) => state.answers)
  const restart = useQuizStore((state) => state.restart)
  const reduceMotion = useReducedMotion()
  const score = quizQuestions.filter((question) => answers[question.id] === question.correctIndex).length
  const ratio = score / quizQuestions.length
  const feedback = FEEDBACK.find((item) => ratio >= item.min) ?? FEEDBACK[FEEDBACK.length - 1]

  return (
    <section aria-label="Hasil kuis">
      <motion.div
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="rounded-3xl bg-amber/10 p-5 text-center"
      >
        <p className="text-[11px] font-bold tracking-wider text-amber-ink uppercase">Skor akhir</p>
        <p className="mt-1 text-5xl font-extrabold tabular-nums">
          {score}
          <span className="text-2xl text-ink/40">/{quizQuestions.length}</span>
        </p>
        <p className="mt-2 text-[13.5px] text-ink/75">{feedback.message}</p>
      </motion.div>

      <SectionTitle>Ringkasan jawaban</SectionTitle>
      <ol className="space-y-1.5">
        {quizQuestions.map((question, index) => {
          const correct = answers[question.id] === question.correctIndex
          return (
            <li key={question.id} className="flex items-start gap-2.5 rounded-xl bg-white/60 px-3 py-2 ring-1 ring-ink/8">
              {correct ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mint" aria-label="Benar" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-coral" aria-label="Salah" />
              )}
              <span className="text-[13px] leading-snug">
                <span className="font-bold tabular-nums">{index + 1}.</span> {question.question}
                {!correct && (
                  <span className="mt-0.5 block text-[12px] text-ink/60">
                    Jawaban: {question.options[question.correctIndex]}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <button
        type="button"
        onClick={restart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber px-4 py-3 text-sm font-bold text-ink"
      >
        <RotateCcw className="size-4" aria-hidden />
        Ulangi kuis
      </button>
    </section>
  )
}
