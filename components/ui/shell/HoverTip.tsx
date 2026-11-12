'use client'

import { Crosshair } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useStageBox } from './useStageBox'

const BOTTOM_INSET = 24

export function HoverTip() {
  const hover = useAppStore((state) => state.hover)
  const stage = useStageBox()
  if (!hover || !stage) return null
  return (
    <div
      className="pointer-events-none fixed z-10 hidden -translate-x-1/2 -translate-y-full md:block"
      style={{ left: stage.centerX, top: stage.bottom - BOTTOM_INSET }}
    >
      <p className="panel flex items-center gap-2 px-3 py-2 text-caption font-medium whitespace-nowrap text-fg">
        <Crosshair className="size-3.5 text-accent" aria-hidden />
        {hover.label}
      </p>
    </div>
  )
}
