'use client'

import { CircleHelp } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useUiStore } from '@/lib/uiStore'
import { ModeTabs } from './ModeTabs'
import { ToothMark } from './ToothMark'

export function TopBar() {
  const setIntro = useAppStore((state) => state.setIntro)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const selectTarget = useAppStore((state) => state.selectTarget)
  const intro = useAppStore((state) => state.intro)
  const openTutorial = useUiStore((state) => state.openTutorial)

  const goHome = () => {
    selectTarget(null, null)
    setIntro(true)
    requestCamera({ kind: 'reset' })
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 grid grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-[1fr_auto_1fr] md:px-6 md:py-4">
        <button
          type="button"
          onClick={goHome}
          aria-label="DentaScope, kembali ke beranda"
          className="pointer-events-auto flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-[var(--radius-control)] text-fg transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
        >
          <ToothMark className="text-accent-mark" />
          <span className="font-display text-subtitle font-semibold tracking-tight">DentaScope</span>
        </button>
        <div className="hidden md:block">
          <ModeTabs />
        </div>
        {!intro && (
          <button
            type="button"
            onClick={openTutorial}
            aria-label="Cara pakai"
            title="Cara pakai"
            className="pointer-events-auto grid size-11 cursor-pointer place-items-center justify-self-end rounded-full text-fg-secondary transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-surface-sunken hover:text-fg active:scale-[var(--scale-press)]"
          >
            <CircleHelp className="size-[22px]" aria-hidden />
          </button>
        )}
      </header>
      <nav aria-label="Modul seluler" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden">
        <ModeTabs variant="bottom" />
      </nav>
    </>
  )
}
