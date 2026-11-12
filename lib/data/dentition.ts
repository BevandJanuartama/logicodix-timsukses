export type ToothKind = 'incisor' | 'canine' | 'premolar' | 'molar'
export type Jaw = 'upper' | 'lower'
export type Quadrant = 1 | 2 | 3 | 4

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
  'Gigi Seri Sentral',
  'Gigi Seri Lateral',
  'Gigi Taring',
  'Premolar Pertama',
  'Premolar Kedua',
  'Molar Pertama',
  'Molar Kedua',
  'Molar Ketiga (Bungsu)',
]

const QUADRANT_NAMES: Record<Quadrant, string> = {
  1: 'kanan atas',
  2: 'kiri atas',
  3: 'kiri bawah',
  4: 'kanan bawah',
}

export const toothIdentities: ToothIdentity[] = ([1, 2, 3, 4] as const).flatMap((quadrant) =>
  TOOTH_NAMES.map((name, i) => ({
    id: String(quadrant * 10 + i + 1),
    fdi: quadrant * 10 + i + 1,
    quadrant,
    jaw: quadrant <= 2 ? ('upper' as const) : ('lower' as const),
    index: i + 1,
    kind: TOOTH_KINDS[i],
    name,
  })),
)

export const toothById = new Map(toothIdentities.map((tooth) => [tooth.id, tooth]))

export const toothLabel = (tooth: ToothIdentity) => `${tooth.name} ${QUADRANT_NAMES[tooth.quadrant]}`
