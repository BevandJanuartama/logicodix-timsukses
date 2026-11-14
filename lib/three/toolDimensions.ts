import { activeDentition, getLayouts, type Dentition } from '@/lib/three/layout'

/**
 * Cleaning-tool sizes derived from the jaw layout (the procedural meshes are built from these
 * same params, so this equals their bounding boxes and is available before anything mounts).
 * One world unit ≈ 10 mm (lower first molar ≈ 1.06).
 */

const BRUSH_HEAD_MOLARS = 2.2
const BRUSH_HEAD_ASPECT = 0.42
const FLOSS_GUM_REACH = 0.2
const GUM_MARGIN_HEIGHT = 0.14
const SCRAPER_DEPTH_RATIO = 0.48

export interface ToolDimensions {
  brush: { headLength: number; headWidth: number; bristleLength: number; reach: number }
  floss: { threadLength: number }
  scraper: { width: number; depth: number }
}

const cached: Partial<Record<Dentition, ToolDimensions>> = {}

/** Sized against the rendered dentition: primary teeth get a child-size brush, floss and scraper. */
export function getToolDimensions(dentition: Dentition = activeDentition()): ToolDimensions {
  const hit = cached[dentition]
  if (hit) return hit
  const { lower, upper } = getLayouts(dentition)
  const molars = lower.teeth.filter((tooth) => tooth.params.kind === 'molar').map((tooth) => tooth.params)
  // Reference = the largest lower molar (permanent first molar / primary second molar).
  const firstMolar = molars.reduce((widest, molar) => (molar.width > widest.width ? molar : widest))
  const tallestCrown = Math.max(...[...lower.teeth, ...upper.teeth].map((tooth) => tooth.params.crownHeight))

  const headLength = firstMolar.width * BRUSH_HEAD_MOLARS
  const headWidth = headLength * BRUSH_HEAD_ASPECT
  const scraperWidth = lower.inner.halfX * 2

  return (cached[dentition] = {
    brush: {
      headLength,
      headWidth,
      bristleLength: firstMolar.crownHeight * 0.5,
      // Cleaning reach: circle inscribed in the bristle field's narrow side.
      reach: headWidth * 0.5,
    },
    floss: { threadLength: tallestCrown + GUM_MARGIN_HEIGHT + FLOSS_GUM_REACH },
    scraper: { width: scraperWidth, depth: scraperWidth * SCRAPER_DEPTH_RATIO },
  })
}
