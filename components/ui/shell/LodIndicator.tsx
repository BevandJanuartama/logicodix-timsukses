'use client'

import { Focus, Layers, Smile } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { Lod } from '@/lib/types'
import { ToolbarButton } from './ToolbarButton'

const LEVELS = [
  { id: 'macro', label: 'Seluruh mulut', Icon: Smile },
  { id: 'meso', label: 'Satu gigi', Icon: Focus },
  { id: 'micro', label: 'Lapisan dalam', Icon: Layers },
] as const

export function LodButtons() {
  const lod = useAppStore((state) => state.lod)
  const selectedToothId = useAppStore((state) => state.selectedToothId)
  const cleaning = useAppStore((state) => state.mode === 'clean')
  const requestCamera = useAppStore((state) => state.requestCamera)
  const setCutaway = useAppStore((state) => state.setCutaway)

  if (cleaning) return null

  const choose = (level: Lod) => {
    if (level === 'macro') {
      setCutaway(false)
      requestCamera({ kind: 'reset' })
      return
    }
    if (!selectedToothId) return
    setCutaway(level === 'micro')
    requestCamera({ kind: 'tooth', toothId: selectedToothId, section: level === 'micro' })
  }

  return (
    <div role="group" aria-label="Tingkat detail" className="hidden flex-col md:flex">
      {LEVELS.map(({ id, label, Icon }) => {
        const needsTooth = id !== 'macro' && !selectedToothId
        return (
          <ToolbarButton
            key={id}
            label={label}
            pressed={lod === id}
            disabled={needsTooth}
            hint={needsTooth ? 'Pilih satu gigi dulu' : label}
            onClick={() => choose(id)}
          >
            <Icon className="size-[18px]" aria-hidden />
          </ToolbarButton>
        )
      })}
      <div aria-hidden className="mx-2 my-1 h-px bg-line-strong" />
    </div>
  )
}

export function LodIndicator() {
  return null
}
