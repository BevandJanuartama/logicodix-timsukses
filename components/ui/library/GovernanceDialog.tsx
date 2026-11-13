'use client'

import { useAppStore } from '@/lib/store'
import { Dialog } from '@/components/ui/shell/Dialog'
import { MedicalDisclaimer } from './MedicalDisclaimer'
import { ReviewerDetails } from './ReviewerDetails'

export function GovernanceDialog() {
  const open = useAppStore((state) => state.modal === 'governance')
  const closeModal = useAppStore((state) => state.closeModal)

  return (
    <Dialog open={open} onClose={closeModal} title="Tentang konten ini">
      <MedicalDisclaimer />
      <ReviewerDetails />
    </Dialog>
  )
}
