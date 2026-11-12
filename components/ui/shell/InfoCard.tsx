'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface InfoCardProps {
  label: string
  contentKey: string
  children: ReactNode
}

const CONTENT_TRANSITION = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const
const CONTENT_OFFSET_PX = 8

export function InfoCard({ label, contentKey, children }: InfoCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <aside aria-label={label} className="panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div key={contentKey} className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-5">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : CONTENT_OFFSET_PX }}
          animate={{ opacity: 1, y: 0 }}
          transition={CONTENT_TRANSITION}
        >
          {children}
        </motion.div>
      </div>
    </aside>
  )
}
