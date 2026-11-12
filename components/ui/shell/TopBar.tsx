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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center gap-1.5 p-2 sm:gap-2 sm:p-3 lg:p-4">
      <button
        type="button"
        onClick={goHome}
        aria-label="Dental Explorer, kembali ke beranda"
        className="panel pointer-events-auto flex shrink-0 items-center gap-2.5 p-1 transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] active:scale-[0.97] sm:pr-4"
      >
        <span className="grid size-9 place-items-center rounded-[var(--radius-control)] bg-accent-fill text-on-accent">
          <ToothMark />
        </span>
        <span className="hidden font-display text-[15px] font-bold tracking-tight text-fg sm:block">Dental Explorer</span>
      </button>
      <div className="ml-auto lg:ml-3">
        <ModeTabs />
      </div>
      <div className="lg:ml-auto">
        <LibraryMenu />
      </div>
    </header>
  )
}
