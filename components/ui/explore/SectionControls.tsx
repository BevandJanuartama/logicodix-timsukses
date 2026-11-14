'use client'

import { Scissors, X } from 'lucide-react'
import { jawSectionOn, sectionedToothOf, useAppStore } from '@/lib/store'
import type { CameraPreset, SectionAxis } from '@/lib/types'

const AXES: { id: SectionAxis; label: string; hint: string; ends: [string, string]; view: CameraPreset }[] = [
  {
    id: 'sagittal',
    label: 'Potong tengah',
    hint: 'Gigi dibelah dari samping, seperti memotong apel jadi dua.',
    ends: ['Kiri', 'Kanan'],
    view: 'right',
  },
  {
    id: 'frontal',
    label: 'Potong depan–belakang',
    hint: 'Bagian depan diangkat, jadi terlihat isi gigi geraham.',
    ends: ['Belakang', 'Depan'],
    view: 'front',
  },
]

const LEGEND = [
  { label: 'Email', color: '#f5f2ea', note: 'lapisan terluar, paling keras' },
  { label: 'Dentin', color: '#e6c78a', note: 'lapisan tengah' },
  { label: 'Pulpa', color: '#d4505f', note: 'saraf & pembuluh darah' },
  { label: 'Gusi', color: '#ec8f9b', note: '' },
  { label: 'Tulang', color: '#efe5cf', note: '' },
]

const SLIDER_STEPS = 100

export function SectionControls() {
  const section = useAppStore((state) => state.jawSection)
  const setSection = useAppStore((state) => state.setJawSection)
  const closeSection = useAppStore((state) => state.closeJawSection)
  const requestCamera = useAppStore((state) => state.requestCamera)
  const applied = useAppStore(jawSectionOn)
  const toothOpen = useAppStore((state) => sectionedToothOf(state) !== null)
  const axis = AXES.find((entry) => entry.id === section.axis)!
  const percent = Math.round(section.position * SLIDER_STEPS)

  const open = (next: SectionAxis) => {
    setSection({ active: true, axis: next })
    requestCamera({ kind: 'preset', preset: AXES.find((entry) => entry.id === next)!.view })
  }

  const close = () => {
    closeSection()
    requestCamera({ kind: 'reset' })
  }

  if (!section.active) {
    return (
      <button
        type="button"
        onClick={() => open(section.axis)}
        className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-fill text-caption font-semibold text-on-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--accent-fill-hover)] active:scale-[var(--scale-press)]"
      >
        <Scissors className="size-4" aria-hidden />
        Belah rahang
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-caption font-semibold text-fg">
          <Scissors className="size-4 text-accent" aria-hidden />
          Rahang dibelah
        </span>
        <button
          type="button"
          onClick={close}
          className="flex min-h-9 cursor-pointer items-center gap-1 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-fg-secondary hover:bg-surface hover:text-fg"
        >
          <X className="size-4" aria-hidden />
          Tutup, utuhkan lagi
        </button>
      </div>

      <div role="group" aria-label="Arah potongan" className="grid grid-cols-2 gap-1 rounded-[var(--radius-control)] bg-surface p-1">
        {AXES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={section.axis === entry.id}
            onClick={() => open(entry.id)}
            className="min-h-10 cursor-pointer rounded-[var(--radius-control)] px-1 text-caption font-semibold text-fg-secondary hover:text-fg aria-pressed:bg-accent-fill aria-pressed:text-on-accent"
          >
            {entry.label}
          </button>
        ))}
      </div>
      <p className="px-0.5 text-caption text-fg-secondary">{axis.hint}</p>

      {toothOpen && !applied ? (
        <p className="rounded-[var(--radius-control)] bg-surface px-2.5 py-2 text-caption text-fg-secondary">
          Sedang melihat isi satu gigi. Belahan rahang muncul lagi setelah tampilan satu gigi ditutup.
        </p>
      ) : (
        <label className="block px-0.5">
          <span className="text-caption font-semibold text-fg-secondary">Posisi potongan</span>
          <input
            type="range"
            min={0}
            max={SLIDER_STEPS}
            value={percent}
            onChange={(event) => setSection({ position: Number(event.target.value) / SLIDER_STEPS })}
            aria-valuetext={`${percent}% dari ${axis.ends[0].toLowerCase()} ke ${axis.ends[1].toLowerCase()}`}
            className="h-7 w-full cursor-pointer accent-[var(--accent-fill)]"
          />
          <span className="flex justify-between text-caption font-semibold text-fg-muted">
            <span>{axis.ends[0]}</span>
            <span>{axis.ends[1]}</span>
          </span>
        </label>
      )}

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1" aria-label="Arti warna">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5 text-caption text-fg-secondary">
            <span className="size-3 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: item.color }} aria-hidden />
            <span>
              <span className="font-semibold text-fg">{item.label}</span>
              {item.note && ` · ${item.note}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
