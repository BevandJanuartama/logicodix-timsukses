'use client'

import { ArrowLeft } from 'lucide-react'
import { findHabitScenario } from '@/lib/data/habitScenarios'
import { findDisease } from '@/lib/knowledgeBase'
import { isClinicalTrack, useSimulatorStore } from '@/lib/simulatorStore'
import { ClinicalStages } from './ClinicalStages'
import { HabitTimeline } from './HabitTimeline'
import { TrackPicker } from './TrackPicker'

export function SimulatorPanel() {
  const track = useSimulatorStore((state) => state.track)
  const setTrack = useSimulatorStore((state) => state.setTrack)
  const title = !track
    ? 'Jika dibiarkan'
    : isClinicalTrack(track)
      ? (findDisease(track)?.displayName ?? track)
      : (findHabitScenario(track)?.title ?? track)

  return (
    <div className="pb-2">
      {track && (
        <button
          type="button"
          onClick={() => setTrack(null)}
          className="mb-1 flex min-h-10 cursor-pointer items-center gap-1 rounded-[var(--radius-control)] px-1.5 text-[13px] font-semibold text-fg-secondary hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Semua simulasi
        </button>
      )}
      <h2 className="font-display text-xl font-semibold tracking-tight text-fg">{title}</h2>
      {!track && <p className="mt-1 text-[13px] leading-snug text-fg-secondary">Pilih tahap penyakit atau kebiasaan.</p>}

      {!track && <TrackPicker />}
      {track && isClinicalTrack(track) && <ClinicalStages track={track} />}
      {track && !isClinicalTrack(track) && <HabitTimeline habitId={track} />}

      <p className="mt-4 text-[11px] leading-snug text-fg-muted">Simulasi edukatif; bukan pengganti pemeriksaan dokter gigi.</p>
    </div>
  )
}
