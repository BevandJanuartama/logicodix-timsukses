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
    ? 'Apa yang terjadi jika dibiarkan?'
    : isClinicalTrack(track)
      ? (findDisease(track)?.displayName ?? track)
      : (findHabitScenario(track)?.title ?? track)

  return (
    <div className="pb-2">
      {track && (
        <button
          type="button"
          onClick={() => setTrack(null)}
          className="mb-2 flex items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-bold text-ink/60 hover:bg-ink/5"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Semua simulasi
        </button>
      )}
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      {!track && (
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
          Ikuti tahapan karies dan periodontal dari basis pengetahuan, atau putar skenario kebiasaan untuk melihat kerusakan
          bertahap.
        </p>
      )}

      {!track && <TrackPicker />}
      {track && isClinicalTrack(track) && <ClinicalStages track={track} />}
      {track && !isClinicalTrack(track) && <HabitTimeline habitId={track} />}

      <p className="mt-5 text-[11.5px] leading-snug text-ink/50">
        Simulasi edukatif yang disederhanakan; skala waktu ilustratif dan bukan pengganti pemeriksaan dokter gigi.
      </p>
    </div>
  )
}
