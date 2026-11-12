'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { habitScenarios } from '@/lib/data/habitScenarios'
import { findDisease } from '@/lib/knowledgeBase'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, type SimulationTrack } from '@/lib/simulatorStore'
import { CLINICAL_SUBTITLES } from './plainStages'

const RAIL_SPRING = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 } as const

interface TrackOption {
  id: SimulationTrack
  title: string
  subtitle: string
}

const clinicalOptions: TrackOption[] = CLINICAL_TRACKS.map((id) => ({
  id,
  title: findDisease(id)?.displayName ?? id,
  subtitle: CLINICAL_SUBTITLES[id],
}))

const habitOptions: TrackOption[] = habitScenarios.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  subtitle: `${scenario.timeline[0]} → ${scenario.timeline[1]}`,
}))

function TrackGroup({
  heading,
  options,
  activeTrack,
  highlight,
}: {
  heading: string
  options: TrackOption[]
  activeTrack?: SimulationTrack | null
  highlight?: boolean
}) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mt-4 first:mt-0">
      <h3 className="px-2 pb-1.5 text-caption font-semibold text-fg-muted">{heading}</h3>
      <ul className="space-y-1">
        {options.map((option) => {
          const active = option.id === activeTrack
          return (
            <li key={option.id}>
              <button
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => openSimulatorTrack(option.id)}
                className={`relative flex min-h-12 w-full cursor-pointer flex-col items-start justify-center rounded-[var(--radius-control)] px-3 py-2.5 text-left transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] ${
                  active ? 'text-accent' : 'text-fg hover:bg-surface-sunken'
                }`}
              >
                {active && highlight && (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute inset-0 rounded-[var(--radius-control)] bg-accent-tint"
                    transition={reduceMotion ? { duration: 0 } : RAIL_SPRING}
                  />
                )}
                <span className="relative text-body font-semibold leading-snug">{option.title}</span>
                <span className="relative mt-0.5 text-caption text-fg-muted">{option.subtitle}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function TrackPicker({
  activeTrack = null,
  highlight = false,
}: {
  activeTrack?: SimulationTrack | null
  highlight?: boolean
}) {
  return (
    <div className="space-y-4">
      <TrackGroup heading="Tahapan penyakit" options={clinicalOptions} activeTrack={activeTrack} highlight={highlight} />
      <TrackGroup heading="Kebiasaan sehari-hari" options={habitOptions} activeTrack={activeTrack} highlight={highlight} />
    </div>
  )
}
