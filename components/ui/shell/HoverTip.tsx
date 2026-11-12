'use client'

import { Crosshair } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function HoverTip() {
  const hover = useAppStore((state) => state.hover)
  if (!hover) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-[calc((100%-424px)/2)] z-10 hidden -translate-x-1/2 lg:block">
      <p className="panel flex items-center gap-2 px-3 py-2 text-caption font-medium whitespace-nowrap text-fg">
        <Crosshair className="size-3.5 text-accent" aria-hidden />
        {hover.label}
      </p>
    </div>
  )
}
