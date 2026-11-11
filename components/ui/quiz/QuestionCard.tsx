'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useQuizStore } from '@/lib/quizStore'
import type { QuizQuestion } from '@/lib/types'
import { SourceLinks } from '@/components/ui/shell/PanelParts'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

function optionTone(index: number, question: QuizQuestion, selected: number | null, checked: boolean) {
  if (!checked) return index === selected ? 'ring-amber bg-amber/10' : 'ring-ink/10 bg-white/70 hover:bg-white'
  if (index === question.correctIndex) return 'ring-mint bg-mint/12'
  if (index === selected) return 'ring-coral bg-coral/10'
  return 'ring-ink/8 bg-white/40 opacity-60'
}

export function QuestionCard({ question, isLast }: { question: QuizQuestion; isLast: boolean }) {
  const selected = useQuizStore((state) => state.selected)
  const checked = useQuizStore((state) => state.checked)
  const select = useQuizStore((state) => state.select)
  const check = useQuizStore((state) => state.check)
  const next = useQuizStore((state) => state.next)
  const reduceMotion = useReducedMotion()
  const correct = checked && selected === question.correctIndex

  return (
    <article>
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-ink/50 uppercase">
        <span>{question.topic}</span>
        <span aria-hidden>·</span>
        <span className="font-mono">{question.id}</span>
        <StatusBadge contentId={question.id} baseStatus={question.status} />
      </div>
      <h3 id={`${question.id}-prompt`} className="mt-2 text-[17px] leading-snug font-extrabold">
        {question.question}
      </h3>

      <motion.div
        role="radiogroup"
        aria-labelledby={`${question.id}-prompt`}
        className="mt-4 space-y-2"
        animate={checked && !correct && !reduceMotion ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {question.options.map((option, index) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-semibold ring-1 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${optionTone(index, question, selected, checked)}`}
          >
            <input
              type="radio"
              name={question.id}
              value={index}
              checked={selected === index}
              disabled={checked}
              onChange={() => select(index)}
              className="sr-only"
            />
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink/5 text-xs font-extrabold">
              {OPTION_LETTERS[index]}
            </span>
            <span className="flex-1">{option}</span>
            {checked && index === question.correctIndex && <CheckCircle2 className="size-5 text-mint" aria-label="Jawaban benar" />}
            {checked && index === selected && index !== question.correctIndex && (
              <XCircle className="size-5 text-coral" aria-label="Jawaban kamu" />
            )}
          </label>
        ))}
      </motion.div>

      <AnimatePresence>
        {checked && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className={`mt-4 rounded-2xl p-3.5 ${correct ? 'bg-mint/12' : 'bg-coral/10'}`}
          >
            <p className={`text-[14px] font-extrabold ${correct ? 'text-mint-ink' : 'text-coral'}`}>
              {correct ? 'Benar!' : 'Belum tepat.'}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/80">{question.explanation}</p>
            <div className="mt-2">
              <SourceLinks sourceIds={question.sourceIds} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        disabled={!checked && selected === null}
        onClick={() => (checked ? next() : check(question.id))}
        className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:bg-ink/15 disabled:text-ink/40"
      >
        {!checked ? 'Periksa jawaban' : isLast ? 'Lihat skor' : 'Soal berikutnya'}
      </button>
    </article>
  )
}
