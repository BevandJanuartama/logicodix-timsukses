import { Experience } from '@/components/Experience'
import { loadRemoteConditions } from '@/lib/data/conditionsCsv'

export const revalidate = 86400

export default async function HomePage() {
  const remoteConditions = await loadRemoteConditions()
  return <Experience remoteConditions={remoteConditions} />
}
