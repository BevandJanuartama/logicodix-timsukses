'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, Hand, Scissors } from 'lucide-react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useAppStore } from '@/lib/store'
import { readTutorialSeen, useUiStore } from '@/lib/uiStore'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const LOOP = { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } as const

/** A fingertip dot; `path` animates it along x/y keyframes (static when motion is reduced). */
function Finger({ path, still }: { path: { x: number[]; y: number[] }; still: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 rounded-full bg-accent-fill/85 ring-4 ring-[var(--accent-fill)]/20"
      animate={still ? { x: path.x[0], y: path.y[0] } : path}
      transition={still ? { duration: 0 } : LOOP}
    />
  )
}

function GestureTile({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-control)] bg-surface-sunken p-3">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-surface">{children}</span>
      <span>
        <span className="block text-body font-semibold text-fg">{title}</span>
        <span className="block text-caption text-fg-secondary">{caption}</span>
      </span>
    </li>
  )
}

function FeatureTile({ icon, title, caption }: { icon: ReactNode; title: string; caption: string }) {
  return (
    <li className="flex items-start gap-3 rounded-[var(--radius-control)] bg-surface-sunken p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-fill text-on-accent">{icon}</span>
      <span>
        <span className="block text-body font-semibold text-fg">{title}</span>
        <span className="block text-caption text-fg-secondary">{caption}</span>
      </span>
    </li>
  )
}

function GestureStep({ touch, still }: { touch: boolean; still: boolean }) {
  if (!touch) {
    return (
      <ul className="space-y-2">
        <GestureTile title="Seret untuk memutar" caption="Tahan klik kiri lalu geser mouse.">
          <Finger still={still} path={{ x: [-14, 14, -14], y: [6, -6, 6] }} />
        </GestureTile>
        <GestureTile title="Gulir untuk mendekat" caption="Putar roda mouse. Klik kanan + geser untuk memindahkan.">
          <Finger still={still} path={{ x: [0, 0, 0], y: [10, -10, 10] }} />
        </GestureTile>
      </ul>
    )
  }
  return (
    <ul className="space-y-2">
      <GestureTile title="Geser 1 jari untuk memutar gigi" caption="Seperti memutar bola di tanganmu.">
        <Finger still={still} path={{ x: [-16, 16, -16], y: [6, -6, 6] }} />
      </GestureTile>
      <GestureTile title="Cubit 2 jari untuk mendekat" caption="Rentangkan untuk memperbesar, rapatkan untuk memperkecil.">
        <Finger still={still} path={{ x: [-6, -18, -6], y: [6, 16, 6] }} />
        <Finger still={still} path={{ x: [6, 18, 6], y: [-6, -16, -6] }} />
      </GestureTile>
      <GestureTile title="Geser 2 jari untuk memindahkan" caption="Kedua jari bergerak ke arah yang sama.">
        <Finger still={still} path={{ x: [-18, 10, -18], y: [-7, -7, -7] }} />
        <Finger still={still} path={{ x: [-18, 10, -18], y: [9, 9, 9] }} />
      </GestureTile>
    </ul>
  )
}

const FEATURES = [
  {
    icon: <Camera className="size-5" aria-hidden />,
    title: 'Sudut',
    caption: 'Pilih sudut pandang instan tanpa repot memutar.',
  },
  {
    icon: <Scissors className="size-5" aria-hidden />,
    title: 'Belah',
    caption: 'Belah rahang untuk melihat lapisan email, dentin, dan saraf gigi.',
  },
  {
    icon: <Hand className="size-5" aria-hidden />,
    title: 'Ketuk gigi',
    caption: 'Ketuk gigi mana saja untuk melihat nama dan fungsinya.',
  },
]

const STEPS = [
  { title: 'Cara menggerakkan model', body: 'gestures' },
  { title: 'Yang bisa kamu lakukan', body: 'features' },
] as const

/**
 * First-run walkthrough (gestures → main features). Opens once after the intro, when the 3D model is ready;
 * dismissal is remembered in localStorage. The "?" button in the top bar reopens it any time.
 */
export function OnboardingCoach() {
  const open = useUiStore((state) => state.tutorialOpen)
  const openTutorial = useUiStore((state) => state.openTutorial)
  const closeTutorial = useUiStore((state) => state.closeTutorial)
  const intro = useAppStore((state) => state.intro)
  const sceneReady = useAppStore((state) => state.sceneReady)
  const touch = useMediaQuery('(pointer: coarse)')
  const reduceMotion = useReducedMotion() ?? false
  const [step, setStep] = useState(0)
  const primary = useRef<HTMLButtonElement>(null)
  const autoShown = useRef(false)

  useEffect(() => {
    if (intro || !sceneReady || autoShown.current) return
    autoShown.current = true
    if (!readTutorialSeen()) openTutorial()
  }, [intro, sceneReady, openTutorial])

  useEffect(() => {
    if (!open) return
    setStep(0)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeTutorial()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeTutorial])

  useEffect(() => {
    if (open) primary.current?.focus()
  }, [open, step])

  const last = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="coach"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-3 pb-[calc(var(--mobile-tabbar-h)+12px)] md:items-center md:pb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="coach-title"
            className="panel shadow-float flex max-h-full w-full max-w-md flex-col overflow-y-auto p-4"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <p className="text-caption font-semibold text-fg-secondary">
              Panduan singkat · {step + 1}/{STEPS.length}
            </p>
            <h2 id="coach-title" className="mt-0.5 mb-3 font-display text-title font-semibold tracking-tight text-fg">
              {current.title}
            </h2>

            {current.body === 'gestures' ? (
              <GestureStep touch={touch} still={reduceMotion} />
            ) : (
              <ul className="space-y-2">
                {FEATURES.map((feature) => (
                  <FeatureTile key={feature.title} {...feature} />
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className="mr-auto flex gap-1.5" aria-hidden>
                {STEPS.map((entry, index) => (
                  <span key={entry.title} className={`h-1.5 rounded-full transition-[width] ${index === step ? 'w-5 bg-accent-fill' : 'w-1.5 bg-[var(--border-strong)]'}`} />
                ))}
              </span>
              <button
                type="button"
                onClick={closeTutorial}
                className="min-h-11 cursor-pointer rounded-[var(--radius-control)] px-4 text-caption font-semibold text-fg-secondary hover:bg-surface-sunken hover:text-fg"
              >
                Lewati
              </button>
              <button
                ref={primary}
                type="button"
                onClick={() => (last ? closeTutorial() : setStep(step + 1))}
                className="min-h-11 cursor-pointer rounded-[var(--radius-control)] bg-accent-fill px-5 text-caption font-semibold text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--accent-fill-hover)] active:scale-[var(--scale-press)]"
              >
                {last ? 'Mulai eksplorasi' : 'Lanjut'}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
