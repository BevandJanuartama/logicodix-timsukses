import { contentEntries } from '@/lib/data/contentRegistry'
import { useGovernanceStore } from '@/lib/governanceStore'

export function useContentReview() {
  const overrides = useGovernanceStore((state) => state.overrides)
  const reviewed = contentEntries.filter((entry) => (overrides[entry.id] ?? entry.status) === 'Approved').length
  return { reviewed, total: contentEntries.length }
}

export function reviewSummary(reviewed: number, total: number) {
  return `${reviewed} dari ${total} materi sudah ditinjau.`
}
