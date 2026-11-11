'use client'

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'framer-motion'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

const SHEET_PEEK = 164
const SHEET_VIEWPORT_RATIO = 0.74
const FLICK_VELOCITY = 320

function BottomSheet({ label, children }: { label: string; children: ReactNode }) {
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

  const toggleFromHandle = () => {
    if (!wasDragged.current) setOpen(!open)
  }

  const beginHandleDrag = (event: ReactPointerEvent) => {
    wasDragged.current = false
    dragControls.start(event)
  }

  const settle = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.velocity.y < -FLICK_VELOCITY) return setOpen(true)
    if (info.velocity.y > FLICK_VELOCITY) return setOpen(false)
    const restingOffset = (open ? 0 : closedOffset) + info.offset.y
    setOpen(restingOffset < closedOffset / 2)
  }

  return (
    <motion.aside
      ref={sheet}
      aria-label={label}
      className="glass fixed inset-x-0 bottom-0 z-20 flex h-[74dvh] flex-col rounded-t-[28px]"
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
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 40 }}
    >
      <button
        type="button"
        onPointerDown={beginHandleDrag}
        onClick={toggleFromHandle}
        aria-expanded={open}
        aria-label={open ? 'Ciutkan panel' : 'Buka panel'}
        className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-2 active:cursor-grabbing"
      >
        <span className="h-1.5 w-10 rounded-full bg-ink/20" />
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

export function Panel({ label, children }: { label: string; children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  if (!isDesktop) return <BottomSheet label={label}>{children}</BottomSheet>
  return (
    <aside
      aria-label={label}
      className="glass thin-scroll fixed top-[84px] right-4 bottom-4 z-20 w-[400px] overflow-y-auto overscroll-contain rounded-3xl p-5"
    >
      {children}
    </aside>
  )
}
