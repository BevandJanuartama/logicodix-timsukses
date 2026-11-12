'use client'

import { habitScenarios } from '@/lib/data/habitScenarios'
import { findDisease } from '@/lib/knowledgeBase'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, type SimulationTrack } from '@/lib/simulatorStore'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

interface TrackOption {
  id: SimulationTrack
  title: string
  subtitle: string
}

const clinicalOptions: TrackOption[] = CLINICAL_TRACKS.map((id) => ({
  id,
  title: findDisease(id)?.displayName ?? id,
  subtitle: id,
}))

const habitOptions: TrackOption[] = habitScenarios.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  subtitle: `${scenario.timeline[0]} → ${scenario.timeline[1]}`,
}))

function TrackList({ options }: { options: TrackOption[] }) {
  return (
    <ul className="space-y-1.5">
      {options.map((option) => (
        <li key={option.id}>
          <button
            type="button"
            onClick={() => openSimulatorTrack(option.id)}
            className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] px-3 py-2 text-left transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:border-line-strong active:scale-[var(--scale-press)]"
          >
            <span className="text-body font-semibold text-fg">{option.title}</span>
            <span className="shrink-0 text-caption text-fg-muted">{option.subtitle}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function TrackPicker() {
  return (
    <>
      <SectionTitle>Tahapan klinis</SectionTitle>
      <TrackList options={clinicalOptions} />
      <SectionTitle>Skenario kebiasaan</SectionTitle>
      <TrackList options={habitOptions} />
    </>
  )
}
