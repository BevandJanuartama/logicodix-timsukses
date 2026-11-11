'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { references } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { Dialog } from '@/components/ui/shell/Dialog'

export function ReferencesDialog() {
  const open = useAppStore((state) => state.modal === 'references')
  const focusedReferenceId = useAppStore((state) => state.focusedReferenceId)
  const closeModal = useAppStore((state) => state.closeModal)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!open || !focusedReferenceId) return
    list.current?.querySelector(`[data-reference="${focusedReferenceId}"]`)?.scrollIntoView({ block: 'center' })
  }, [open, focusedReferenceId])

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      title="Referensi ilmiah"
      description={`${references.length} sumber institusional yang mendukung seluruh konten aplikasi.`}
    >
      <ol ref={list} className="space-y-2">
        {references.map((reference) => (
          <li
            key={reference.id}
            data-reference={reference.id}
            aria-current={reference.id === focusedReferenceId ? 'true' : undefined}
            className="rounded-2xl bg-white/60 p-3.5 ring-1 ring-ink/8 aria-[current=true]:bg-brand-50 aria-[current=true]:ring-brand/40"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 font-mono text-[11px] font-bold text-brand tabular-nums">{reference.id}</span>
              <div className="flex-1">
                <p className="text-[14px] leading-snug font-extrabold">{reference.title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink/65">
                  {reference.institution} · {reference.publication} · {reference.sourceType}
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink/80">{reference.relevantContent}</p>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold break-all text-brand-600 hover:underline"
                >
                  {reference.url}
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                </a>
                <p className="mt-1 text-[11.5px] text-ink/45">{reference.accessNote}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Dialog>
  )
}
