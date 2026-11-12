'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'
import { CleanPanel } from '@/components/ui/clean/CleanPanel'
import { CleanSuccessToast, MouthwashOverlay } from '@/components/ui/clean/CleanFeedback'
import { DiseasesPanel } from '@/components/ui/diseases/DiseasesPanel'
import { ExplorePanel } from '@/components/ui/explore/ExplorePanel'
import { GovernanceDialog } from '@/components/ui/library/GovernanceDialog'
import { ReferencesDialog } from '@/components/ui/library/ReferencesDialog'
import { Hero } from '@/components/ui/shell/Hero'
import { HoverTip } from '@/components/ui/shell/HoverTip'
import { LodIndicator } from '@/components/ui/shell/LodIndicator'
import { Panel } from '@/components/ui/shell/Panel'
import { QuizPanel } from '@/components/ui/quiz/QuizPanel'
import { SimulatorPanel } from '@/components/ui/simulator/SimulatorPanel'
import { ToothMark } from '@/components/ui/shell/ToothMark'
import { TopBar } from '@/components/ui/shell/TopBar'
import { ViewControls } from '@/components/ui/shell/ViewControls'

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

const PANELS: Record<AppMode, { label: string; Content: () => React.JSX.Element }> = {
  explore: { label: 'Panel anatomi', Content: ExplorePanel },
  diseases: { label: 'Panel penyakit', Content: DiseasesPanel },
  destroy: { label: 'Panel simulasi', Content: SimulatorPanel },
  clean: { label: 'Panel pembersihan', Content: CleanPanel },
  quiz: { label: 'Panel kuis', Content: QuizPanel },
}

function useEscapeToDeselect() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = useAppStore.getState()
      if (event.key === 'Escape' && !state.modal) state.selectTarget(null, null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

export function Experience() {
  const intro = useAppStore((state) => state.intro)
  const mode = useAppStore((state) => state.mode)
  const { label, Content } = PANELS[mode]
  useEscapeToDeselect()

  return (
    <main className="bg-app fixed inset-0 overflow-hidden select-none">
      <div className={`absolute inset-0 ${intro ? '' : 'lg:right-[424px]'}`}>
        <Scene />
      </div>
      <TopBar />
      {!intro && (
        <>
          <LodIndicator />
          <ViewControls />
          <HoverTip />
          <Panel key={mode} label={label}>
            <Content />
          </Panel>
          <CleanSuccessToast />
          <MouthwashOverlay />
        </>
      )}
      <Hero />
      <ReferencesDialog />
      <GovernanceDialog />
    </main>
  )
}
