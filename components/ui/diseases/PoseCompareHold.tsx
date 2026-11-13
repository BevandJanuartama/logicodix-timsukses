'use client'

import { useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function PoseCompareHold() {
  const showNormalPose = useAppStore((state) => state.showNormalPose)
  const setShowNormalPose = useAppStore((state) => state.setShowNormalPose)
  const release = () => setShowNormalPose(false)

  useEffect(() => () => useAppStore.getState().setShowNormalPose(false), [])

  return (
    <button
      type="button"
      onPointerDown={() => setShowNormalPose(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') setShowNormalPose(true)
      }}
      onKeyUp={release}
      aria-pressed={showNormalPose}
      className="flex min-h-11 w-full cursor-pointer touch-none items-center justify-center gap-2 rounded-[var(--radius-control)] bg-surface-sunken px-3 text-caption font-semibold text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] select-none hover:text-fg active:scale-[var(--scale-press)]"
    >
      <Eye className="size-4" aria-hidden />
      {showNormalPose ? 'Ini susunan normal' : 'Tahan untuk bandingkan dengan normal'}
    </button>
  )
}
