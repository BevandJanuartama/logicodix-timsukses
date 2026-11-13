import { parseCsv } from './csv'
import { rowsToConditions, type RemoteCondition } from './conditionRows'

const REVALIDATE_SECONDS = 60 * 60 * 24
const FETCH_TIMEOUT_MS = 5000

export async function loadRemoteConditions(): Promise<RemoteCondition[]> {
  const url = process.env.CONDITIONS_CSV_URL?.trim()
  if (!url) return []
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const { conditions, skipped } = rowsToConditions(parseCsv(await response.text()))
    if (skipped) console.warn(`CSV kondisi: ${skipped} baris dilewati karena tidak valid`)
    return conditions
  } catch (error) {
    console.warn('CSV kondisi gagal dimuat, memakai data bawaan:', error)
    return []
  }
}
