import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ReviewStatus } from '@/lib/types'

export const REVIEW_STATUSES: ReviewStatus[] = ['Draft', 'Under Review', 'Approved']

interface GovernanceState {
  overrides: Record<string, ReviewStatus>
  setStatus: (contentId: string, status: ReviewStatus) => void
  resetStatuses: () => void
}

export const useGovernanceStore = create<GovernanceState>()(
  persist(
    (set) => ({
      overrides: {},
      setStatus: (contentId, status) => set((state) => ({ overrides: { ...state.overrides, [contentId]: status } })),
      resetStatuses: () => set({ overrides: {} }),
    }),
    { name: 'dental-explorer-review-status', storage: createJSONStorage(() => localStorage) },
  ),
)

export const useReviewStatus = (contentId: string, baseStatus: ReviewStatus) =>
  useGovernanceStore((state) => state.overrides[contentId] ?? baseStatus)
