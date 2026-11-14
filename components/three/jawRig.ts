/** Shared hinge rig for the main jaws (Mouth) and the comparison jaws (ComparisonJaws). */

export const JAW_OFFSET_Y = 0.78
export const HINGE_Z = -3.0
export const UPPER_OPEN_ANGLE = -0.32
export const LOWER_OPEN_ANGLE = 0.18

export interface JawPose {
  upper: number
  lower: number
  shift: number
  forward: number
}

/** Mouth writes the animated pose here every frame; the comparison jaws mirror it. */
export const sharedJawPose: JawPose = { upper: UPPER_OPEN_ANGLE, lower: LOWER_OPEN_ANGLE, shift: 0, forward: 0 }
