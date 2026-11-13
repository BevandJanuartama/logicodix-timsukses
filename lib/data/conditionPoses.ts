type Vec3 = [number, number, number]

export interface Tint {
  color: string
  amount: number
  roughness: number
}

export interface ToothPose {
  tint?: Tint
  shift?: Vec3
  tilt?: Vec3
  hidden?: boolean
}

export interface ConditionPose {
  closeBite?: boolean
  lowerJawForward?: number
  teeth?: Record<string, ToothPose>
  tint?: Tint
  gumTint?: { color: string; amount: number }
  tongueTint?: { color: string; amount: number }
  extraToothBeside?: string
}

const UPPER_FRONT = ['13', '12', '11', '21', '22', '23']
const LOWER_FRONT = ['33', '32', '31', '41', '42', '43']

const poseEach = (ids: string[], pose: ToothPose) => Object.fromEntries(ids.map((id) => [id, pose]))

export const CONDITION_POSES: Record<string, ConditionPose> = {
  'DIS-011': { closeBite: true, teeth: poseEach(UPPER_FRONT, { shift: [0, 0.32, 0.1] }) },
  'DIS-012': { closeBite: true, lowerJawForward: 0.42 },
  'DIS-013': {
    closeBite: true,
    teeth: { ...poseEach(UPPER_FRONT, { shift: [0, -0.28, 0] }), ...poseEach(LOWER_FRONT, { shift: [0, -0.28, 0] }) },
  },
  'DIS-014': { closeBite: true, teeth: poseEach(['14', '15', '16', '17'], { shift: [0, 0, -0.42] }) },
  'DIS-015': {
    teeth: {
      '32': { shift: [0, 0, 0.14], tilt: [0, 0.45, 0] },
      '31': { shift: [0, 0, -0.16], tilt: [0, -0.35, 0] },
      '41': { shift: [0, 0, 0.12], tilt: [0, 0.4, 0] },
      '42': { shift: [0, 0, -0.14], tilt: [0, -0.5, 0] },
    },
  },
  'DIS-016': { teeth: { '38': { shift: [0, -0.55, 0], tilt: [0, 0, 0.85] } } },
  'DIS-017': { closeBite: true, teeth: { '12': { hidden: true }, '22': { hidden: true } } },
  'DIS-018': { closeBite: true, extraToothBeside: '11' },
  'DIS-019': { tint: { color: '#c99a5b', amount: 0.75, roughness: 0.75 } },
  'DIS-020': { tint: { color: '#9aa3b5', amount: 0.7, roughness: 0.35 } },
  'DIS-021': { tint: { color: '#fdfcf7', amount: 0.9, roughness: 0.95 } },
}

export const hasConditionPose = (diseaseId: string) => diseaseId in CONDITION_POSES
