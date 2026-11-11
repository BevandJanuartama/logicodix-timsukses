'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { diseaseIdsForStructure } from '@/lib/data/diseaseLinks'
import { isOralRegion } from '@/lib/data/oralRegions'
import { sceneTargetLabels } from '@/lib/data/sceneLabels'
import { diseases } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { StatusBadge } from '@/components/ui/shell/StatusBadge'
import { DiseaseDetail } from './DiseaseDetail'

const ALL_CATEGORIES = 'Semua'
const categories = [ALL_CATEGORIES, ...new Set(diseases.map((disease) => disease.category))]

function useStructureFilter() {
  const selectedObjectId = useAppStore((state) => state.selectedObjectId)
  return selectedObjectId && !isOralRegion(selectedObjectId) ? selectedObjectId : null
}

export function DiseasesPanel() {
  const selectedDiseaseId = useAppStore((state) => state.selectedDiseaseId)
  const selectDisease = useAppStore((state) => state.selectDisease)
  const selectObject = useAppStore((state) => state.selectObject)
  const structureFilter = useStructureFilter()
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const reduceMotion = useReducedMotion()

  const visibleDiseases = useMemo(() => {
    const linkedIds = structureFilter ? new Set(diseaseIdsForStructure(structureFilter)) : null
    return diseases.filter(
      (disease) =>
        (category === ALL_CATEGORIES || disease.category === category) && (!linkedIds || linkedIds.has(disease.id)),
    )
  }, [category, structureFilter])

  return (
    <div className="pb-2">
      <h2 className="text-xl font-extrabold tracking-tight">Katalog penyakit gigi & mulut</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
        Sepuluh kondisi dari basis pengetahuan, masing-masing dengan rujukan sumber dan tautan ke model 3D.
      </p>

      {structureFilter && (
        <p className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2 text-[12.5px] font-semibold text-brand-600">
          Terkait {sceneTargetLabels[structureFilter]}
          <button
            type="button"
            onClick={() => selectObject(null)}
            aria-label="Hapus filter struktur"
            className="grid size-6 place-items-center rounded-lg hover:bg-white"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </p>
      )}

      <div role="group" aria-label="Filter kategori" className="no-scrollbar -mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {categories.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === category}
            onClick={() => setCategory(option)}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-ink/70 ring-1 ring-ink/10 transition-colors hover:text-ink aria-pressed:bg-coral aria-pressed:text-white aria-pressed:ring-coral"
          >
            {option}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {visibleDiseases.map((disease) => {
          const expanded = disease.id === selectedDiseaseId
          return (
            <li key={disease.id} className="overflow-hidden rounded-2xl bg-white/60 ring-1 ring-ink/8">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => selectDisease(expanded ? null : disease.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
              >
                <span className="font-mono text-[11px] font-bold text-coral tabular-nums">{disease.id}</span>
                <span className="flex-1 leading-tight">
                  <span className="block text-[14.5px] font-extrabold">{disease.displayName}</span>
                  <span className="block text-[12px] text-ink/55">
                    {disease.name} · {disease.category}
                  </span>
                </span>
                <StatusBadge contentId={disease.id} baseStatus={disease.status} />
                <ChevronDown
                  className={`size-4 shrink-0 text-ink/40 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DiseaseDetail disease={disease} />
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
      {visibleDiseases.length === 0 && (
        <p className="mt-4 text-center text-[13px] text-ink/55">Tidak ada penyakit pada kombinasi filter ini.</p>
      )}
      <p className="mt-5 text-[11.5px] leading-snug text-ink/50">
        Konten bersifat edukatif dan berstatus draf editorial; bukan pengganti pemeriksaan tenaga kesehatan.
      </p>
    </div>
  )
}
