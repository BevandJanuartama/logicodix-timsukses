'use client'

import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { findHabitScenario } from '@/lib/data/habitScenarios'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { findDisease } from '@/lib/knowledgeBase'
import { openSimulatorTrack } from '@/lib/simulatorActions'
import { isClinicalTrack, useSimulatorStore } from '@/lib/simulatorStore'
import { ClinicalStages } from './ClinicalStages'
import { HabitTimeline } from './HabitTimeline'
import { CLINICAL_SUBTITLES } from './plainStages'
import { TrackPicker } from './TrackPicker'

export function SimulatorPanel() {
  const track = useSimulatorStore((state) => state.track)
  const setTrack = useSimulatorStore((state) => state.setTrack)
  const hasRail = useMediaQuery('(min-width: 1280px)')

  useEffect(() => {
    if (hasRail && !track) {
      openSimulatorTrack('DIS-001')
    }
  }, [hasRail, track])

  const title = !track
    ? 'Jika dibiarkan'
    : isClinicalTrack(track)
      ? (findDisease(track)?.displayName ?? 'Simulasi')
      : (findHabitScenario(track)?.title ?? 'Simulasi')

  const subtitle = !track
    ? 'Pilih skenario untuk melihat perubahan gigi dari waktu ke waktu.'
    : isClinicalTrack(track)
      ? `Rentang waktu: ${CLINICAL_SUBTITLES[track]}`
      : (() => {
          const scenario = findHabitScenario(track)
          return scenario ? `Rentang waktu: ${scenario.timeline[0]} → ${scenario.timeline[1]}` : ''
        })()

  return (
    <div className="space-y-4 pb-2">
      <div>
        {track && !hasRail && (
          <button
            type="button"
            onClick={() => setTrack(null)}
            className="-ml-2 mb-1 flex min-h-10 cursor-pointer items-center gap-1 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-fg-secondary hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Semua simulasi
          </button>
        )}
        <h2 className="font-display text-title font-semibold tracking-tight text-fg">{title}</h2>
        {subtitle && <p className="mt-1 text-caption text-fg-secondary">{subtitle}</p>}
      </div>

      {!track && <TrackPicker />}
      {track && isClinicalTrack(track) && <ClinicalStages track={track} />}
      {track && !isClinicalTrack(track) && <HabitTimeline habitId={track} />}

      <p className="text-caption text-fg-muted">Simulasi edukatif; bukan pengganti pemeriksaan dokter gigi.</p>
    </div>
  )
}
