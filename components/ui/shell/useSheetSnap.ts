import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { animate, useMotionValue, useReducedMotion, type PanInfo } from 'framer-motion'

export const SHEET_POSITIONS = ['peek', 'half', 'full'] as const
export type SheetPosition = (typeof SHEET_POSITIONS)[number]

const THROW_VELOCITY_PX_PER_MS = 0.11
const VELOCITY_PROJECTION_MS = 120
const HALF_VIEWPORT_RATIO = 0.5
const SHEET_SPRING = { type: 'spring', duration: 0.45, bounce: 0.12 } as const

export function useSheetSnap(sheet: RefObject<HTMLElement | null>, initialPosition: SheetPosition = 'peek') {
  const y = useMotionValue(0)
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(() => SHEET_POSITIONS.indexOf(initialPosition))
  const [metrics, setMetrics] = useState({ height: 0, peek: 120, viewport: 0 })
  const controls = useRef<ReturnType<typeof animate> | null>(null)
  const settled = useRef(false)

  useLayoutEffect(() => {
    const node = sheet.current
    if (!node) return
    const measure = () => {
      const peek = parseFloat(getComputedStyle(node).getPropertyValue('--sheet-peek-h')) || 120
      setMetrics({ height: node.offsetHeight, peek, viewport: window.innerHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [sheet])

  const snaps = useMemo(() => {
    const peekY = Math.max(0, metrics.height - metrics.peek)
    const halfVisible = Math.min(metrics.height, metrics.viewport * HALF_VIEWPORT_RATIO)
    const halfY = Math.min(peekY, Math.max(0, metrics.height - halfVisible))
    return [peekY, halfY, 0]
  }, [metrics])

  const target = snaps[index]

  useLayoutEffect(() => {
    controls.current?.stop()
    if (!settled.current || reduceMotion) {
      y.set(target)
      settled.current = metrics.height > 0
      return
    }
    controls.current = animate(y, target, SHEET_SPRING)
  }, [target, reduceMotion, y, metrics.height])

  useEffect(() => () => controls.current?.stop(), [])

  const stopAnimation = () => controls.current?.stop()

  const settle = (info: PanInfo) => {
    const velocity = info.velocity.y / 1000
    const thrown = Math.abs(velocity) > THROW_VELOCITY_PX_PER_MS
    const projected = y.get() + (thrown ? velocity * VELOCITY_PROJECTION_MS : 0)
    const nearest = snaps.reduce(
      (best, snap, i) => (Math.abs(snap - projected) < Math.abs(snaps[best] - projected) ? i : best),
      0,
    )
    setIndex(nearest)
    if (nearest !== index) return
    if (reduceMotion) y.set(snaps[nearest])
    else controls.current = animate(y, snaps[nearest], SHEET_SPRING)
  }

  const cycle = () => setIndex((current) => (current + 1) % SHEET_POSITIONS.length)
  const step = (direction: 1 | -1) =>
    setIndex((current) => Math.min(SHEET_POSITIONS.length - 1, Math.max(0, current + direction)))

  return {
    y,
    position: SHEET_POSITIONS[index],
    peekY: snaps[0],
    open: () => setIndex((current) => Math.max(current, 1)),
    cycle,
    step,
    stopAnimation,
    settle,
  }
}
