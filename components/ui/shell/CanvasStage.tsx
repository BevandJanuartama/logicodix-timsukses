'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/lib/store'
import { AssistantChat } from '@/components/ui/chat/AssistantChat'
import { CanvasScrubber } from '@/components/ui/simulator/CanvasScrubber'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { TipNote } from './TipNote'
import { ToothMark } from './ToothMark'
import { ViewControls } from './ViewControls'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

function LoaderLayer({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(true)

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      onTransitionEnd={() => {
        if (!visible) setMounted(false)
      }}
      className={`absolute inset-0 z-10 grid place-items-center bg-[var(--p-stage)] transition-opacity duration-[220ms] ease-[var(--ease-out)] ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <p className="flex flex-col items-center gap-3 text-caption text-fg-secondary">
        <span className="panel grid size-14 animate-pulse place-items-center text-accent">
          <ToothMark size={28} />
        </span>
        Memuat model
      </p>
    </div>
  )
}

function CanvasFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="absolute inset-0 grid place-items-center bg-[var(--p-stage)] p-6">
      <div className="panel flex max-w-sm flex-col items-center gap-3 p-6 text-center">
        <h2 className="font-display text-subtitle text-fg">Model 3D tidak bisa ditampilkan</h2>
        <p className="text-body text-fg-secondary">Semua penjelasan tetap bisa dibaca di panel.</p>
        <button type="button" onClick={onRetry} className="min-h-11 cursor-pointer rounded-[var(--radius-control)] bg-accent-fill px-5 text-caption font-semibold text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]">
          Coba lagi
        </button>
      </div>
    </div>
  )
}

export function CanvasStage({ showControls }: { showControls: boolean }) {
  const sceneReady = useAppStore((state) => state.sceneReady)
  const sceneFailed = useAppStore((state) => state.sceneFailed)
  const [attempt, setAttempt] = useState(0)

  const retry = () => {
    useAppStore.getState().resetScene()
    setAttempt((value) => value + 1)
  }

  const fallback = <CanvasFallback onRetry={retry} />

  return (
    <section aria-label="Model 3D" className="relative min-h-0 overflow-hidden [contain:layout] md:rounded-[var(--radius-panel)] select-none">
      {sceneFailed ? (
        fallback
      ) : (
        <>
          <div
            className={`absolute inset-0 transition-[opacity,transform] duration-[400ms] ease-[var(--ease-out)] motion-reduce:translate-y-0 ${sceneReady ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
          >
            <CanvasErrorBoundary key={attempt} fallback={fallback} onError={() => useAppStore.getState().markSceneFailed()}>
              <Scene />
            </CanvasErrorBoundary>
          </div>
          <LoaderLayer key={attempt} visible={!sceneReady} />
        </>
      )}
      {showControls && sceneReady && !sceneFailed && (
        <>
          <ViewControls />
          <TipNote />
          <CanvasScrubber />
        </>
      )}
      {showControls && <AssistantChat />}
    </section>
  )
}
