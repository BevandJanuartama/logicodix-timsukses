import { ChevronDown } from 'lucide-react'
import type { Disease } from '@/lib/types'
import { SourceLinks } from '@/components/ui/shell/PanelParts'
import { plainSentence } from './plainLanguage'

export function DiseaseExtra({ disease }: { disease: Disease }) {
  const facts = [
    { label: 'Faktor risiko', text: disease.riskFactors },
    { label: 'Bagian terdampak', text: disease.affectedStructures },
  ]

  return (
    <details className="group mt-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-[var(--radius-control)] bg-surface-sunken px-3 text-caption font-semibold text-fg-secondary hover:text-fg [&::-webkit-details-marker]:hidden">
        Detail lain dan sumber
        <ChevronDown className="size-4 transition-transform duration-[var(--duration-state)] ease-[var(--ease-out)] group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-1 pt-3">
        <dl className="space-y-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-caption font-semibold text-fg-muted">{fact.label}</dt>
              <dd className="mt-0.5 text-caption text-fg-secondary">{plainSentence(fact.text)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-caption text-fg-secondary">{plainSentence(disease.safetyNote)}</p>
        <div className="mt-3">
          <SourceLinks sourceIds={disease.sourceIds} />
        </div>
      </div>
    </details>
  )
}
