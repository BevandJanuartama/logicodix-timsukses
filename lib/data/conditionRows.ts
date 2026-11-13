import type { ConditionGroup, Disease, DiseaseDetails } from '@/lib/types'

export type ConditionSeverity = 'mild' | 'moderate' | 'urgent'

export interface RemoteCondition {
  disease: Disease
  severity: ConditionSeverity
  mergeInto: string[]
}

const HEADER_ROW_MARKER = 'masalah'
const MAX_TEXT = 400

const COLUMNS = {
  number: 'no',
  category: 'kategori',
  name: 'masalah',
  signs: 'ciri / gejala',
  causes: 'penyebab',
  risks: 'faktor risiko',
  treatment: 'penanganan medis',
  homeCare: 'perawatan di rumah',
  prevention: 'pencegahan',
  severity: 'tingkat keparahan',
  whenToSee: 'kapan ke dokter gigi',
  specialist: 'spesialis / dokter yang dituju',
} as const

type Column = keyof typeof COLUMNS

const GROUP_BY_CATEGORY: Record<string, ConditionGroup> = {
  'kerusakan gigi': 'penyakit',
  'pulpa & saraf gigi': 'penyakit',
  'gusi & periodontal': 'penyakit',
  'pasca tindakan & lainnya': 'penyakit',
  'bau mulut & mulut kering': 'mulut',
  'mukosa & lidah': 'mulut',
  'susunan gigi & rahang': 'gigitan',
  'gigi anak & perkembangan': 'tumbuh',
}

const BUILT_IN_BY_NUMBER: Record<string, string[]> = {
  '1': ['DIS-001'],
  '4': ['DIS-005'],
  '7': ['DIS-007'],
  '10': ['DIS-004'],
  '12': ['DIS-008'],
  '14': ['DIS-002'],
  '15': ['DIS-003'],
  '22': ['DIS-006'],
  '24': ['DIS-010'],
  '25': ['DIS-016'],
  '26': ['DIS-017', 'DIS-018'],
  '27': ['DIS-009'],
  '39': ['DIS-021'],
  '40': ['DIS-019'],
}

const clip = (value: string | undefined) => (value ?? '').trim().slice(0, MAX_TEXT)

function splitList(value: string) {
  const items: string[] = []
  let depth = 0
  let current = ''
  for (const char of value) {
    if (char === '(') depth++
    if (char === ')') depth = Math.max(0, depth - 1)
    if ((char === ',' || char === ';') && depth === 0) {
      items.push(current)
      current = ''
    } else current += char
  }
  items.push(current)
  return items.map((item) => item.trim()).filter(Boolean)
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

function severityOf(label: string): ConditionSeverity {
  const lead = label.trim().toLowerCase()
  if (lead.startsWith('berat')) return 'urgent'
  if (lead.startsWith('ringan')) return 'mild'
  return 'moderate'
}

function findHeader(rows: string[][]) {
  const index = rows.findIndex(
    (row) => row[0]?.trim().toLowerCase() === COLUMNS.number && row.some((cell) => cell.trim().toLowerCase() === HEADER_ROW_MARKER),
  )
  return index === -1 ? null : index
}

export function rowsToConditions(rows: string[][]): { conditions: RemoteCondition[]; skipped: number } {
  const headerIndex = findHeader(rows)
  if (headerIndex === null) return { conditions: [], skipped: rows.length }

  const columnIndex = new Map(rows[headerIndex].map((name, index) => [name.trim().toLowerCase(), index]))
  const cell = (row: string[], column: Column) => {
    const index = columnIndex.get(COLUMNS[column])
    return index === undefined ? '' : clip(row[index])
  }

  const body = rows.slice(headerIndex + 1)
  const conditions: RemoteCondition[] = []
  for (const row of body) {
    const number = cell(row, 'number')
    const name = cell(row, 'name')
    const causes = cell(row, 'causes')
    const signs = splitList(cell(row, 'signs')).map(capitalize)
    if (!/^\d{1,4}$/.test(number) || !name || (!causes && !signs.length)) continue

    const details: DiseaseDetails = {
      causes,
      treatment: cell(row, 'treatment'),
      homeCare: cell(row, 'homeCare'),
      whenToSeeDentist: cell(row, 'whenToSee'),
      specialist: cell(row, 'specialist'),
    }
    const prevention = splitList(cell(row, 'prevention')).map(capitalize)
    const category = cell(row, 'category')
    const mergeInto = BUILT_IN_BY_NUMBER[String(Number(number))] ?? []
    conditions.push({
      severity: severityOf(cell(row, 'severity')),
      mergeInto,
      disease: {
        id: `CSV-${number.padStart(3, '0')}`,
        name,
        displayName: name,
        category,
        group: GROUP_BY_CATEGORY[category.toLowerCase()] ?? 'penyakit',
        definition: causes,
        riskFactors: cell(row, 'risks'),
        symptoms: signs.join('; '),
        affectedStructures: '',
        prevention: prevention.join('; '),
        plain: { summary: causes || signs[0], signs, prevention },
        details,
        sourceIds: [],
        safetyNote: 'Informasi umum untuk belajar, bukan pengganti pemeriksaan dokter gigi.',
        status: 'Draft',
      },
    })
  }
  return { conditions, skipped: body.length - conditions.length }
}
