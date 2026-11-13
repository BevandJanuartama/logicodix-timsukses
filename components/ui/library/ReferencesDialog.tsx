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
      title="Sumber"
      description="Semua penjelasan di aplikasi ini merujuk pada sumber berikut."
    >
      <ul ref={list}>
        {references.map((reference) => (
          <LibraryRow
            key={reference.id}
            rowId={reference.id}
            current={reference.id === focusedReferenceId}
            summary={
              <>
                <p className="text-caption text-fg-secondary">{reference.institution}</p>
                <p className="text-body font-semibold text-fg">{reference.title}</p>
              </>
            }
            footer={
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka sumber: ${reference.title} (tab baru)`}
                className="-ml-2 mb-1 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-accent transition-colors duration-[var(--duration-press)] hover:bg-surface-raised"
              >
                <ExternalLink className="size-4" aria-hidden />
                Buka sumber
              </a>
            }
          >
            <p>{reference.publication}</p>
          </LibraryRow>
        ))}
      </ul>
    </Dialog>
  )
}
