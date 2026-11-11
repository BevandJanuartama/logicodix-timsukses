'use client'

import { MousePointerClick } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function HoverTip() {
  const hover = useAppStore((state) => state.hover)
  if (!hover) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-[calc((100%-424px)/2)] z-10 hidden -translate-x-1/2 lg:block">
      <p className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap">
        <MousePointerClick className="size-4 text-brand" aria-hidden />
        {hover.label}
      </p>
    </div>
  )
}
