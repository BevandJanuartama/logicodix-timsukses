'use client'

import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useAppStore } from '@/lib/store'
import type { AppMode } from '@/lib/types'
import { CleanPanel } from '@/components/ui/clean/CleanPanel'
import { CleanSuccessToast, MouthwashOverlay } from '@/components/ui/clean/CleanFeedback'
import { DiseasesPanel } from '@/components/ui/diseases/DiseasesPanel'
import { ExplorePanel } from '@/components/ui/explore/ExplorePanel'
import { GovernanceDialog } from '@/components/ui/library/GovernanceDialog'
import { ReferencesDialog } from '@/components/ui/library/ReferencesDialog'
import { CanvasStage } from '@/components/ui/shell/CanvasStage'
import { Hero } from '@/components/ui/shell/Hero'
import { HoverTip } from '@/components/ui/shell/HoverTip'
import { ModeRail } from '@/components/ui/shell/ModeRail'
import { NextStepLink } from '@/components/ui/shell/NextStepLink'
import { Panel } from '@/components/ui/shell/Panel'
import { QuizPanel } from '@/components/ui/quiz/QuizPanel'
import { SimulatorPanel } from '@/components/ui/simulator/SimulatorPanel'
import { TopBar } from '@/components/ui/shell/TopBar'

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
  const isWide = useMediaQuery('(min-width: 1280px)')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const heroSlot = isWide ? 'rail' : isDesktop ? 'card' : 'sheet'
  useEscapeToDeselect()

  return (
    <main className="bg-app fixed inset-0 flex flex-col overflow-hidden">
      <TopBar />
      <div aria-hidden className="h-[68px] shrink-0 md:h-[76px]" />
      <MotionConfig reducedMotion="user">
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] pb-[calc(var(--mobile-tabbar-h,0px)+var(--sheet-peek-h))] md:grid-cols-[minmax(0,1fr)_340px] md:gap-4 md:px-4 md:pb-4 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <div className="hidden min-h-0 xl:flex xl:flex-col">
            {intro ? heroSlot === 'rail' && <Hero /> : <ModeRail />}
          </div>
          <CanvasStage showControls={!intro} />
          <div className="contents md:flex md:min-h-0 md:flex-col">
            {intro
              ? heroSlot === 'card' && <Hero />
              : (
                  <Panel label={label} contentKey={mode} footer={<NextStepLink />}>
                    <Content />
                  </Panel>
                )}
          </div>
        </div>
      </MotionConfig>
      {!intro && (
        <>
          <HoverTip />
          <CleanSuccessToast />
          <MouthwashOverlay />
        </>
      )}
      {intro && heroSlot === 'sheet' && (
        <div className="fixed inset-x-3 bottom-[calc(var(--mobile-tabbar-h,0px)+12px)] z-20">
          <Hero />
        </div>
      )}
      <ReferencesDialog />
      <GovernanceDialog />
    </main>
  )
}
