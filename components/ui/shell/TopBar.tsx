'use client'

import { useAppStore } from '@/lib/store'
import { LibraryMenu } from './LibraryMenu'
import { ModeTabs } from './ModeTabs'
import { ToothMark } from './ToothMark'

export function TopBar() {
  const setIntro = useAppStore((state) => state.setIntro)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const selectTarget = useAppStore((state) => state.selectTarget)

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
          aria-label="Dental Explorer, kembali ke beranda"
          className="pointer-events-auto flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-[var(--radius-control)] text-fg transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[var(--scale-press)]"
        >
          <ToothMark className="text-accent-mark" />
          <span className="font-display text-subtitle font-semibold tracking-tight">Dental Explorer</span>
        </button>
        <div className="hidden md:block">
          <ModeTabs />
        </div>
        <div className="flex justify-end">
          <LibraryMenu />
        </div>
      </header>
      <nav aria-label="Modul seluler" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden">
        <ModeTabs variant="bottom" />
      </nav>
    </>
  )
}
