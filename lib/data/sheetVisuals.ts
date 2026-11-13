import type { SceneFocus } from '@/lib/sceneFocus'
import type { AnatomyObjectId } from '@/lib/types'
import type { ConditionPose, ToothPose } from './conditionPoses'

export interface SheetVisual {
  structures: AnatomyObjectId[]
  focus: SceneFocus
  pose?: ConditionPose
}

const ALL_FRONT = ['13', '12', '11', '21', '22', '23', '33', '32', '31', '41', '42', '43']
const poseEach = (ids: string[], pose: ToothPose) => Object.fromEntries(ids.map((id) => [id, pose]))

const TOUCHED_TONGUE: SheetVisual['focus'] = { objectId: 'tongue_dorsum', preset: 'top', overview: true }

export const CATEGORY_VISUALS: Record<string, SheetVisual> = {
  'Kerusakan Gigi': { structures: ['enamel', 'dentin'], focus: { toothId: '36', objectId: 'enamel' } },
  'Pulpa & Saraf Gigi': { structures: ['pulp', 'root_canal'], focus: { toothId: '36', objectId: 'pulp', section: true } },
  'Gusi & Periodontal': { structures: ['gingiva'], focus: { objectId: 'gingiva', preset: 'front' } },
  'Bau Mulut & Mulut Kering': { structures: [], focus: TOUCHED_TONGUE },
  'Mukosa & Lidah': { structures: [], focus: TOUCHED_TONGUE },
  'Susunan Gigi & Rahang': { structures: [], focus: { preset: 'front', overview: true } },
  'Gigi Anak & Perkembangan': { structures: [], focus: { preset: 'front', overview: true } },
  'Pasca Tindakan & Lainnya': { structures: [], focus: { preset: 'front', overview: true } },
}

const gum = (color: string, amount: number): ConditionPose => ({ gumTint: { color, amount } })
const tongue = (color: string, amount: number): ConditionPose => ({ tongueTint: { color, amount } })

export const SHEET_VISUALS: Record<string, Partial<SheetVisual>> = {
  'CSV-002': { structures: ['cementum'], focus: { toothId: '46', objectId: 'cementum' } },
  'CSV-003': {
    focus: { toothId: '11', preset: 'front', overview: true },
    pose: { closeBite: true, teeth: poseEach(['12', '11', '21', '22'], { tint: { color: '#a9784a', amount: 0.55, roughness: 0.65 } }) },
  },
  'CSV-005': {
    focus: { toothId: '11', preset: 'front', overview: true },
    pose: { closeBite: true, teeth: poseEach(ALL_FRONT, { shift: [0, -0.16, 0], tint: { color: '#e6d7bd', amount: 0.4, roughness: 0.6 } }) },
  },
  'CSV-006': { structures: ['dentin'], focus: { toothId: '16', objectId: 'dentin', section: true } },
  'CSV-008': { focus: { toothId: '21', preset: 'front', overview: true }, pose: { closeBite: true, teeth: { '21': { hidden: true } } } },
  'CSV-011': {
    focus: { toothId: '21', preset: 'front', overview: true },
    pose: { closeBite: true, teeth: { '21': { tint: { color: '#7f7a74', amount: 0.7, roughness: 0.55 } } } },
  },
  'CSV-013': { structures: ['alveolar_bone', 'pd_ligament'], focus: { toothId: '36', objectId: 'alveolar_bone', section: true } },
  'CSV-016': { structures: ['gingiva', 'cej'], focus: { toothId: '31', objectId: 'cej', section: true } },
  'CSV-017': { pose: gum('#c4566a', 0.5) },
  'CSV-018': { pose: gum('#6e2a35', 0.65) },
  'CSV-020': { pose: tongue('#e9dccb', 0.7) },
  'CSV-021': { pose: tongue('#c98f96', 0.55) },
  'CSV-023': { focus: { preset: 'front', overview: true }, pose: { closeBite: true, tint: { color: '#c8a15a', amount: 0.55, roughness: 0.6 } } },
  'CSV-028': { pose: { closeBite: true, lowerJawForward: 0.22 } },
  'CSV-029': {
    focus: { preset: 'left', overview: true },
    pose: { closeBite: true, teeth: poseEach(['36', '37', '46', '47'], { hidden: true }) },
  },
  'CSV-030': { focus: { objectId: 'tongue_lateral', preset: 'top', overview: true } },
  'CSV-032': { pose: tongue('#f4eee2', 0.85) },
  'CSV-033': { pose: tongue('#efc3b6', 0.45) },
  'CSV-034': { focus: { objectId: 'mouth_floor', preset: 'top', overview: true } },
  'CSV-035': { focus: { objectId: 'tongue_lateral', preset: 'top', overview: true }, pose: tongue('#f1ece2', 0.55) },
  'CSV-036': { focus: { objectId: 'tongue_lateral', preset: 'top', overview: true }, pose: tongue('#8f2c40', 0.5) },
  'CSV-037': { focus: { objectId: 'tongue_tip', preset: 'top', overview: true }, pose: tongue('#e0485a', 0.45) },
  'CSV-038': {
    pose: { closeBite: true, teeth: poseEach(['11', '21', '31', '41'], { shift: [0, -0.38, 0] }) },
  },
  'CSV-041': { pose: { closeBite: true, teeth: poseEach(['13', '12', '11', '21', '22', '23', '33', '32', '31', '41', '42', '43'], { shift: [0, -0.28, 0] }) } },
  'CSV-042': {
    pose: { teeth: { '31': { shift: [0, 0, 0.2], tilt: [0.25, 0, 0] }, '41': { shift: [0, 0, 0.2], tilt: [0.25, 0, 0] } } },
  },
  'CSV-043': { focus: { preset: 'left', overview: true }, pose: { teeth: { '38': { hidden: true } }, ...gum('#a53a4a', 0.4) } },
  'CSV-044': { focus: { preset: 'left', overview: true }, pose: { teeth: { '36': { hidden: true } }, ...gum('#c63d4f', 0.55) } },
  'CSV-045': { structures: [], focus: { toothId: '16', objectId: 'enamel' } },
  'CSV-046': { focus: { objectId: 'mouth_floor', preset: 'top', overview: true } },
}

export function visualFor(id: string, category: string): SheetVisual {
  const base = CATEGORY_VISUALS[category] ?? { structures: [], focus: { preset: 'front', overview: true } }
  return { ...base, ...SHEET_VISUALS[id] }
}
