'use client'

import dynamic from 'next/dynamic'
import { CanvasScrubber } from '@/components/ui/simulator/CanvasScrubber'
import { LodIndicator } from './LodIndicator'
import { TipNote } from './TipNote'
import { ToothMark } from './ToothMark'
import { ViewControls } from './ViewControls'

function SceneLoader() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <p className="flex flex-col items-center gap-3 text-caption text-fg-secondary">
        <span className="panel grid size-14 animate-pulse place-items-center text-accent">
          <ToothMark size={28} />
        </span>
        Memuat model
      </p>
    </div>
  )
}

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false, loading: SceneLoader })

export function CanvasStage({ showControls }: { showControls: boolean }) {
  return (
    <section aria-label="Model 3D" className="relative min-h-0 overflow-hidden [contain:layout] md:rounded-[var(--radius-panel)] select-none">
      <div className="absolute inset-0">
        <Scene />
      </div>
      {showControls && (
        <>
          <ViewControls />
          <LodIndicator />
          <TipNote />
          <CanvasScrubber />
        </>
      )}
    </section>
  )
}
