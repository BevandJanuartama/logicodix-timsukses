'use client'

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'framer-motion'

const SHEET_PEEK = 156
const SHEET_VIEWPORT_RATIO = 0.45
const DISMISS_VELOCITY_PX_PER_MS = 0.11
const SHEET_SPRING = { type: 'spring', stiffness: 380, damping: 40 } as const

export function BottomSheet({ label, children }: { label: string; children: ReactNode }) {
  const sheet = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(() => window.innerHeight * SHEET_VIEWPORT_RATIO)
  const [open, setOpen] = useState(false)
  const dragControls = useDragControls()
  const wasDragged = useRef(false)
  const reduceMotion = useReducedMotion()
  const closedOffset = Math.max(0, height - SHEET_PEEK)

  useLayoutEffect(() => {
    const node = sheet.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const beginHandleDrag = (event: ReactPointerEvent) => {
    wasDragged.current = false
    dragControls.start(event)
  }

  const settle = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const velocity = info.velocity.y / 1000
    if (velocity < -DISMISS_VELOCITY_PX_PER_MS) return setOpen(true)
    if (velocity > DISMISS_VELOCITY_PX_PER_MS) return setOpen(false)
    const restingOffset = (open ? 0 : closedOffset) + info.offset.y
    setOpen(restingOffset < closedOffset / 2)
  }

  return (
    <motion.aside
      ref={sheet}
      aria-label={label}
      className="panel fixed inset-x-0 bottom-0 z-20 flex h-[45dvh] flex-col rounded-b-none"
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: closedOffset }}
      dragElastic={0.06}
      onDragStart={() => {
        wasDragged.current = true
      }}
      onDragEnd={settle}
      initial={false}
      animate={{ y: open ? 0 : closedOffset }}
      transition={reduceMotion ? { duration: 0 } : SHEET_SPRING}
    >
      <button
        type="button"
        onPointerDown={beginHandleDrag}
        onClick={() => !wasDragged.current && setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Ciutkan panel' : 'Buka panel'}
        className="flex min-h-10 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
      </button>
      <div
        className={`thin-scroll flex-1 overscroll-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${
          open ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
        onClickCapture={() => !open && setOpen(true)}
      >
        {children}
      </div>
    </motion.aside>
  )
}
