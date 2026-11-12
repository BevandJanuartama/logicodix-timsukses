'use client'

import type { ReactNode } from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { BottomSheet } from './BottomSheet'
import type { SheetPosition } from './useSheetSnap'
import { InfoCard } from './InfoCard'

interface PanelProps {
  label: string
  contentKey: string
  footer?: ReactNode
  children: ReactNode
}

const HALF_OPEN_KEYS = new Set(['quiz', 'destroy'])

export function Panel({ label, contentKey, footer, children }: PanelProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!isDesktop) {
    const initialPosition: SheetPosition = HALF_OPEN_KEYS.has(contentKey) ? 'half' : 'peek'
    return (
      <BottomSheet key={contentKey} label={label} initialPosition={initialPosition}>
        {children}
        {footer}
      </BottomSheet>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <InfoCard label={label} contentKey={contentKey}>
        {children}
      </InfoCard>
      {footer}
    </div>
  )
}
