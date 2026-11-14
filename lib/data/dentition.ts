import type { Dentition } from '@/lib/types'

export type { Dentition }
export type ToothKind = 'incisor' | 'canine' | 'premolar' | 'molar'
export type Jaw = 'upper' | 'lower'
/** FDI quadrants: 1–4 permanent, 5–8 primary (deciduous). */
export type Quadrant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface ToothIdentity {
  id: string
  fdi: number
  quadrant: Quadrant
  jaw: Jaw
  index: number
  kind: ToothKind
  name: string
}

export const TOOTH_KINDS: readonly ToothKind[] = [
  'incisor',
  'incisor',
  'canine',
  'premolar',
  'premolar',
  'molar',
  'molar',
  'molar',
]

export const TOOTH_NAMES: readonly string[] = [
  'Gigi seri tengah',
  'Gigi seri samping',
  'Gigi taring',
  'Geraham kecil pertama',
  'Geraham kecil kedua',
  'Geraham besar pertama',
  'Geraham besar kedua',
  'Geraham bungsu',
]

export const PRIMARY_TOOTH_KINDS: readonly ToothKind[] = ['incisor', 'incisor', 'canine', 'molar', 'molar']

export const PRIMARY_TOOTH_NAMES: readonly string[] = [
  'Gigi seri tengah susu',
  'Gigi seri samping susu',
  'Gigi taring susu',
  'Geraham susu pertama',
  'Geraham susu kedua',
]

const QUADRANT_NAMES: Record<Quadrant, string> = {
  1: 'kanan atas',
  2: 'kiri atas',
  3: 'kiri bawah',
  4: 'kanan bawah',
  5: 'kanan atas',
  6: 'kiri atas',
  7: 'kiri bawah',
  8: 'kanan bawah',
}

const PRIMARY_QUADRANT_OFFSET = 4

export const quadrantsOf = (dentition: Dentition) =>
  (dentition === 'primary' ? [5, 6, 7, 8] : [1, 2, 3, 4]) as readonly Quadrant[]

const identitiesFor = (dentition: Dentition): ToothIdentity[] => {
  const names = dentition === 'primary' ? PRIMARY_TOOTH_NAMES : TOOTH_NAMES
  const kinds = dentition === 'primary' ? PRIMARY_TOOTH_KINDS : TOOTH_KINDS
  return quadrantsOf(dentition).flatMap((quadrant) =>
    names.map((name, i) => ({
      id: String(quadrant * 10 + i + 1),
      fdi: quadrant * 10 + i + 1,
      quadrant,
      jaw: quadrant % 4 === 1 || quadrant % 4 === 2 ? ('upper' as const) : ('lower' as const),
      index: i + 1,
      kind: kinds[i],
      name,
    })),
  )
}

export const toothIdentities: ToothIdentity[] = identitiesFor('permanent')
export const primaryToothIdentities: ToothIdentity[] = identitiesFor('primary')

export const toothById = new Map([...toothIdentities, ...primaryToothIdentities].map((tooth) => [tooth.id, tooth]))

export const toothSide = (tooth: { quadrant: Quadrant }) => QUADRANT_NAMES[tooth.quadrant]

export const dentitionOfTooth = (toothId: string): Dentition => (Number(toothId[0]) > PRIMARY_QUADRANT_OFFSET ? 'primary' : 'permanent')

/**
 * Map an FDI id onto the equivalent position in another dentition.
 * Permanent → primary: incisors/canine keep their index, premolars map to the primary molar they replace,
 * permanent molars fall back to the second primary molar. Primary → permanent: the successor tooth.
 */
export function toDentitionToothId(toothId: string, dentition: Dentition) {
  const quadrant = Number(toothId[0])
  const index = Number(toothId.slice(1))
  if (!quadrant || !index || dentitionOfTooth(toothId) === dentition) return toothId
  return dentition === 'primary'
    ? `${quadrant + PRIMARY_QUADRANT_OFFSET}${Math.min(index, PRIMARY_TOOTH_NAMES.length)}`
    : `${quadrant - PRIMARY_QUADRANT_OFFSET}${index}`
}
