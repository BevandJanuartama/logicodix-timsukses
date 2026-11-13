import type { ConditionGroup, Disease } from '@/lib/types'
import { CONDITION_GROUPS } from './conditionGroups'
import { toothById } from './dentition'

export type ConditionSeverity = 'mild' | 'moderate' | 'urgent'

export interface RemoteCondition {
  disease: Disease
  severity: ConditionSeverity
  toothId: string | null
}

const GROUP_TITLES = Object.fromEntries(CONDITION_GROUPS.map(({ id, title }) => [id, title])) as Record<ConditionGroup, string>

const SEVERITY_BY_LABEL: Record<string, ConditionSeverity> = { ringan: 'mild', sedang: 'moderate', segera: 'urgent' }
const ID_PATTERN = /^[A-Za-z0-9-]{2,40}$/
const MAX_TEXT = 400
const LIST_SEPARATOR = '|'

export const CSV_COLUMNS = [
  'id',
  'nama_tampil',
  'nama_inggris',
  'kelompok',
  'tingkat',
  'ringkasan',
  'tanda',
  'pencegahan',
  'gigi_fokus',
  'sumber',
] as const

type CsvColumn = (typeof CSV_COLUMNS)[number]

const clip = (value: string | undefined) => (value ?? '').trim().slice(0, MAX_TEXT)
const listOf = (value: string | undefined) =>
  clip(value)
    .split(LIST_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean)

const isGroup = (value: string): value is ConditionGroup => value in GROUP_TITLES

export function rowsToConditions(rows: string[][]): { conditions: RemoteCondition[]; skipped: number } {
  const [header = [], ...body] = rows
  const columnIndex = new Map(header.map((name, index) => [name.trim().toLowerCase(), index]))
  const cell = (row: string[], column: CsvColumn) => {
    const index = columnIndex.get(column)
    return index === undefined ? '' : clip(row[index])
  }

  const conditions: RemoteCondition[] = []
  for (const row of body) {
    const id = cell(row, 'id')
    const displayName = cell(row, 'nama_tampil')
    const group = cell(row, 'kelompok').toLowerCase()
    const summary = cell(row, 'ringkasan')
    if (!ID_PATTERN.test(id) || !displayName || !summary || !isGroup(group)) continue

    const signs = listOf(cell(row, 'tanda'))
    const prevention = listOf(cell(row, 'pencegahan'))
    const toothId = cell(row, 'gigi_fokus')
    conditions.push({
      severity: SEVERITY_BY_LABEL[cell(row, 'tingkat').toLowerCase()] ?? 'moderate',
      toothId: toothById.has(toothId) ? toothId : null,
      disease: {
        id,
        name: cell(row, 'nama_inggris') || displayName,
        displayName,
        category: GROUP_TITLES[group],
        group,
        definition: summary,
        riskFactors: '',
        symptoms: signs.join('; '),
        affectedStructures: '',
        prevention: prevention.join('; '),
        plain: { summary, signs, prevention },
        sourceIds: listOf(cell(row, 'sumber')),
        safetyNote: 'Konten umum; gejala tidak cukup untuk diagnosis.',
        status: 'Draft',
      },
    })
  }
  return { conditions, skipped: body.length - conditions.length }
}
