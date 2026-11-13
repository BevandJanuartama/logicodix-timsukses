'use client'

import { useEffect, useRef } from 'react'
import { Eye } from 'lucide-react'

interface CompareHoldProps {
  activeIndex: number
  onSelect: (index: number) => void
}

export function CompareHold({ activeIndex, onSelect }: CompareHoldProps) {
  const restoreIndex = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const release = () => {
    if (restoreIndex.current === null) return
    onSelectRef.current(restoreIndex.current)
    restoreIndex.current = null
  }

  useEffect(() => release, [])

  const hold = () => {
    if (activeIndex === 0 || restoreIndex.current !== null) return
    restoreIndex.current = activeIndex
    onSelect(0)
  }

  return (
    <button
      type="button"
      onPointerDown={hold}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      disabled={activeIndex === 0}
      className="flex min-h-10 w-full cursor-pointer touch-none items-center justify-center gap-1.5 rounded-[var(--radius-control)] bg-surface-sunken px-2.5 text-caption font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] select-none hover:text-fg active:scale-[var(--scale-press)] disabled:cursor-default disabled:opacity-40"
    >
      <Eye className="size-3.5" aria-hidden />
      Tahan untuk bandingkan dengan sehat
    </button>
  )
}
