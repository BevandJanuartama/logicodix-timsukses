'use client'

import { useEffect, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { useSheetSnap, type SheetPosition } from './useSheetSnap'

const SHEET_HEIGHT = 'calc(100dvh - var(--mobile-tabbar-h) - 4.5rem)'

const HANDLE_LABEL = {
  peek: 'Buka panel',
  half: 'Perluas panel',
  full: 'Ciutkan panel',
} as const

interface BottomSheetProps {
  label: string
  initialPosition?: SheetPosition
  openSignal?: string | null
  children: ReactNode
}

export function BottomSheet({ label, initialPosition = 'peek', openSignal = null, children }: BottomSheetProps) {
  const sheet = useRef<HTMLElement>(null)
  const dragControls = useDragControls()
  const wasDragged = useRef(false)
  const { y, position, peekY, open, cycle, step, stopAnimation, settle } = useSheetSnap(sheet, initialPosition)
  const scrollable = position !== 'peek'

  useEffect(() => {
    if (openSignal) open()
  }, [openSignal])

  const beginDrag = (event: ReactPointerEvent) => {
    stopAnimation()
    wasDragged.current = false
    dragControls.start(event)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') step(1)
    else if (event.key === 'ArrowDown') step(-1)
    else return
    event.preventDefault()
  }

  return (
    <motion.aside
      ref={sheet}
      aria-label={label}
      className="panel shadow-float fixed inset-x-0 z-20 flex flex-col rounded-b-none will-change-transform"
      style={{ y, bottom: 'var(--mobile-tabbar-h)', height: SHEET_HEIGHT }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: peekY }}
      dragElastic={0.04}
      dragMomentum={false}
      onDragStart={() => {
        wasDragged.current = true
      }}
      onDragEnd={(_, info) => settle(info)}
    >
      <button
        type="button"
        onPointerDown={beginDrag}
        onClick={() => !wasDragged.current && cycle()}
        onKeyDown={handleKeyDown}
        aria-expanded={scrollable}
        aria-label={HANDLE_LABEL[position]}
        className="flex h-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-t-[var(--radius-panel)] active:cursor-grabbing"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
      </button>
      <div
        className={`thin-scroll min-h-0 flex-1 overscroll-contain px-4 pb-5 ${
          scrollable ? 'overflow-y-auto' : 'touch-none overflow-hidden'
        }`}
        onPointerDown={scrollable ? undefined : beginDrag}
        onClick={() => !scrollable && !wasDragged.current && open()}
      >
        {children}
      </div>
    </motion.aside>
  )
}
