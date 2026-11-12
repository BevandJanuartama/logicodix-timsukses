'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Disease } from '@/lib/types'
import { DiseaseDetail } from './DiseaseDetail'
import { SeverityBadge } from './SeverityBadge'

interface DiseaseCardProps {
  disease: Disease
  expanded: boolean
  onToggle: () => void
}

export function DiseaseCard({ disease, expanded, onToggle }: DiseaseCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--button-ghost-bg-hover)]"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-semibold text-fg">{disease.displayName}</span>
            <SeverityBadge diseaseId={disease.id} />
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg-secondary">{disease.definition}</span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-fg-muted transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] ${expanded ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <DiseaseDetail disease={disease} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
