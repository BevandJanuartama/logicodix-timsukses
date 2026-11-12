'use client'

import { useEffect, useState } from 'react'

export interface StageBox {
  centerX: number
  top: number
  bottom: number
  width: number
}

const STAGE_SELECTOR = 'section[aria-label="Model 3D"]'

export function useStageBox(): StageBox | null {
  const [box, setBox] = useState<StageBox | null>(null)

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(STAGE_SELECTOR)
    if (!stage) return
    const measure = () => {
      const rect = stage.getBoundingClientRect()
      setBox({ centerX: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom, width: rect.width })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return box
}
