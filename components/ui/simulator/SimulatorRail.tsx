'use client'

import { useSimulatorStore } from '@/lib/simulatorStore'
import { TrackPicker } from './TrackPicker'

export function SimulatorRail() {
  const track = useSimulatorStore((state) => state.track)

  return (
    <nav aria-label="Daftar skenario simulasi" className="panel flex min-h-0 w-full flex-col">
      <h2 className="shrink-0 px-5 pt-5 pb-3 font-display text-subtitle font-semibold text-fg">Jika dibiarkan</h2>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
        <TrackPicker activeTrack={track} highlight />
      </div>
    </nav>
  )
}

