'use client'

import type { ReactNode } from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { BottomSheet } from './BottomSheet'

export function Panel({ label, children }: { label: string; children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  if (!isDesktop) return <BottomSheet label={label}>{children}</BottomSheet>
  return (
    <aside
      aria-label={label}
      className="panel thin-scroll fixed top-[84px] right-4 bottom-4 z-20 w-[400px] overflow-y-auto overscroll-contain p-5"
    >
      {children}
    </aside>
  )
}
