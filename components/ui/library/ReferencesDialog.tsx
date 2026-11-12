'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { references } from '@/lib/knowledgeBase'
import { useAppStore } from '@/lib/store'
import { Dialog } from '@/components/ui/shell/Dialog'
import { LibraryRow } from './LibraryRow'

export function ReferencesDialog() {
  const open = useAppStore((state) => state.modal === 'references')
  const focusedReferenceId = useAppStore((state) => state.focusedReferenceId)
  const closeModal = useAppStore((state) => state.closeModal)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open || !focusedReferenceId) return
    list.current?.querySelector(`[data-row="${focusedReferenceId}"]`)?.scrollIntoView({ block: 'center' })
  }, [open, focusedReferenceId])

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      title="Referensi ilmiah"
      description={`${references.length} sumber institusional.`}
    >
      <ul ref={list}>
        {references.map((reference) => (
          <LibraryRow
            key={reference.id}
            rowId={reference.id}
            current={reference.id === focusedReferenceId}
            summary={
              <>
                <p className="flex items-baseline gap-2 text-caption">
                  <span className="shrink-0 whitespace-nowrap font-semibold text-accent">{reference.id}</span>
                  <span className="truncate text-fg-muted">{reference.institution}</span>
                </p>
                <p className="line-clamp-2 text-body font-semibold text-fg">{reference.title}</p>
              </>
            }
            trailing={
              <a
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Buka ${reference.id} di tab baru`}
                className="mt-1 grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] text-fg-muted transition-colors duration-[var(--duration-press)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-accent"
              >
                <ExternalLink className="size-4" aria-hidden />
              </a>
            }
          >
            <p>{reference.publication} · {reference.sourceType}</p>
            <p className="text-fg">{reference.relevantContent}</p>
            <p className="text-caption text-fg-muted">{reference.accessNote}</p>
          </LibraryRow>
        ))}
      </ul>
    </Dialog>
  )
}
