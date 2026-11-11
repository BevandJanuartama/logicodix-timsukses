'use client'

import { habitScenarios } from '@/lib/data/habitScenarios'
import { findDisease } from '@/lib/knowledgeBase'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { CLINICAL_TRACKS, useSimulatorStore, type SimulationTrack } from '@/lib/simulatorStore'
import { SectionTitle } from '@/components/ui/shell/PanelParts'

interface TrackOption {
  id: SimulationTrack
  title: string
  subtitle: string
}

const clinicalOptions: TrackOption[] = CLINICAL_TRACKS.map((id) => {
  const disease = findDisease(id)
  return { id, title: disease?.displayName ?? id, subtitle: `${id} · tahapan dari basis pengetahuan` }
})

const habitOptions: TrackOption[] = habitScenarios.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  subtitle: `${scenario.timeline[0]} → ${scenario.timeline[1]}`,
}))

function TrackList({ options }: { options: TrackOption[] }) {
  const track = useSimulatorStore((state) => state.track)
  return (
    <ul className="space-y-1.5">
      {options.map((option) => (
        <li key={option.id}>
          <button
            type="button"
            aria-pressed={option.id === track}
            onClick={() => openSimulatorTrack(option.id)}
            className="group flex w-full items-center gap-3 rounded-2xl bg-white/60 px-3 py-2.5 text-left ring-1 ring-ink/8 transition-colors hover:bg-white aria-pressed:bg-coral/10 aria-pressed:ring-coral/50"
          >
            <span className="flex-1 leading-tight">
              <span className="block text-[14px] font-extrabold">{option.title}</span>
              <span className="block text-[12px] text-ink/55">{option.subtitle}</span>
            </span>
            <span aria-hidden className="size-2.5 shrink-0 rounded-full ring-2 ring-ink/15 group-aria-pressed:bg-coral group-aria-pressed:ring-coral/30" />
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
