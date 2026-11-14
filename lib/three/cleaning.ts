import * as THREE from 'three'
import type { CleanStats, CleaningTool } from '@/lib/cleaningStore'
import type { Jaw, Layouts } from '@/lib/three/layout'
import { seededRandom } from '@/lib/three/math'
import { getToolDimensions } from '@/lib/three/toolDimensions'
import { surfaceNormal, surfacePoint } from '@/lib/three/toothGeometry'

type PlaqueKind = 'surface' | 'interdental' | 'debris'
type ScoreGroup = 'surface' | 'interdental'

export interface PlaqueItem {
  jaw: Jaw
  kind: PlaqueKind
  group: ScoreGroup
  position: THREE.Vector3
  scale: number
  health: number
  weight: number
  color: THREE.Color
  rotation: THREE.Euler
}

export const cleaningState = {
  items: [] as PlaqueItem[],
  tongueCoat: 1,
  pressed: false,
  lastPoint: null as THREE.Vector3 | null,
  toolPoint: new THREE.Vector3(),
  toolNormal: new THREE.Vector3(0, 0, 1),
  toolVisible: false,
  scrub: 0,
  dirty: { upper: true, lower: true } as Record<Jaw, boolean>,
  sparkles: [] as THREE.Vector3[],
}

const PLAQUE_LIGHT = new THREE.Color('#e9cf55')
const PLAQUE_DARK = new THREE.Color('#d9b84a')
const DEBRIS_COLORS = [new THREE.Color('#8a5a33'), new THREE.Color('#f0e6c8'), new THREE.Color('#6c8f3a')]

function plaqueItem(
  jaw: Jaw,
  kind: PlaqueKind,
  position: THREE.Vector3,
  scale: number,
  color: THREE.Color,
  random: () => number,
  group: ScoreGroup = kind === 'interdental' ? 'interdental' : 'surface',
): PlaqueItem {
  return {
    jaw,
    kind,
    group,
    position: position.clone(),
    scale,
    health: 1,
    weight: kind === 'interdental' ? 1.3 : 1,
    color: color.clone().offsetHSL(0, 0, (random() - 0.5) * 0.08),
    rotation: new THREE.Euler(random() * 6, random() * 6, random() * 6),
  }
}

export function generatePlaque(layouts: Layouts) {
  const items: PlaqueItem[] = []
  const random = seededRandom(42)
  const point = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const surfaceAt = (tooth: Layouts['upper']['teeth'][number], phi: number, y: number) => {
    surfacePoint(tooth.params, phi, y, point)
    surfaceNormal(tooth.params, phi, y, normal)
    return point.addScaledVector(normal, 0.02).applyMatrix4(tooth.matrix)
  }

  for (const jaw of ['upper', 'lower'] as const) {
    const layout = layouts[jaw]
    for (const tooth of layout.teeth) {
      const p = tooth.params
      for (const phi of p.kind === 'molar' ? [-0.55, 0, 0.55] : [-0.4, 0.4]) {
        const color = random() < 0.5 ? PLAQUE_LIGHT : PLAQUE_DARK
        items.push(plaqueItem(jaw, 'surface', surfaceAt(tooth, phi, 0.19 + random() * 0.08), 0.065 + random() * 0.035, color, random))
      }
      for (const phi of [Math.PI - 0.35, Math.PI + 0.35]) {
        if (random() < 0.3) continue
        items.push(plaqueItem(jaw, 'surface', surfaceAt(tooth, phi, 0.2 + random() * 0.06), 0.06 + random() * 0.03, PLAQUE_DARK, random))
      }
      if ((p.kind === 'molar' && tooth.index <= 7) || (p.kind === 'premolar' && random() < 0.35)) {
        point.set((random() - 0.5) * 0.1, p.crownHeight * 0.92, (random() - 0.5) * 0.1).applyMatrix4(tooth.matrix)
        const color = DEBRIS_COLORS[Math.floor(random() * 3)]
        items.push(plaqueItem(jaw, 'debris', point, 0.06 + random() * 0.03, color, random, 'surface'))
      }
    }
    layout.contacts.forEach((contact, index) => {
      const halfDepth =
        Math.min(layouts.byId.get(contact.toothA)!.params.depth, layouts.byId.get(contact.toothB)!.params.depth) * 0.42
      for (const side of [1, -1]) {
        point.copy(contact.position).addScaledVector(contact.outward, halfDepth * side)
        point.y += 0.26 + random() * 0.05
        items.push(plaqueItem(jaw, 'interdental', point, 0.07 + random() * 0.03, PLAQUE_LIGHT, random))
      }
      if (index % 2 !== 0) return
      point.copy(contact.position)
      point.y += 0.5 + random() * 0.1
      const color = DEBRIS_COLORS[Math.floor(random() * 3)]
      items.push(plaqueItem(jaw, 'debris', point, 0.07 + random() * 0.03, color, random, 'interdental'))
    })
  }
  cleaningState.items = items
  cleaningState.tongueCoat = 1
  cleaningState.dirty.upper = true
  cleaningState.dirty.lower = true
  cleaningState.sparkles.length = 0
}

// Brush reach follows the life-size head (per dentition) so the cleaned patch matches what the bristles cover.
const toolRadius = (tool: CleaningTool) => (tool === 'brush' ? getToolDimensions().brush.reach : tool === 'floss' ? 0.2 : 0.36)

function toolEfficacy(tool: CleaningTool, item: PlaqueItem) {
  if (tool === 'brush') {
    if (item.kind === 'surface') return 1
    if (item.kind === 'debris') return item.group === 'surface' ? 0.9 : 0.25
    return 0.2
  }
  if (tool === 'floss') return item.group === 'interdental' ? 1.25 : 0.08
  return 0
}

const localPoint = new THREE.Vector3()

export function applyTool(
  tool: CleaningTool,
  world: THREE.Vector3,
  movement: number,
  hitKind: string,
  jaws: Partial<Record<Jaw, THREE.Object3D>>,
) {
  const power = 0.012 + Math.min(movement, 0.25) * 2.6
  if (hitKind === 'tongue' && tool !== 'floss') {
    cleaningState.tongueCoat = Math.max(0, cleaningState.tongueCoat - power * (tool === 'scraper' ? 0.55 : 0.08))
  }
  if (tool === 'scraper') return
  const radius = toolRadius(tool)
  for (const jaw of ['upper', 'lower'] as const) {
    const group = jaws[jaw]
    if (!group) continue
    group.worldToLocal(localPoint.copy(world))
    for (const item of cleaningState.items) {
      if (item.jaw !== jaw || item.health <= 0) continue
      const reach = radius + item.scale
      const distance = item.position.distanceTo(localPoint)
      const efficacy = toolEfficacy(tool, item)
      if (distance > reach || efficacy <= 0) continue
      item.health = Math.max(0, item.health - power * efficacy * (1 - (distance / reach) * 0.6))
      cleaningState.dirty[jaw] = true
      if (item.health === 0) cleaningState.sparkles.push(group.localToWorld(item.position.clone()))
    }
  }
}

export function rinseWithMouthwash() {
  for (const item of cleaningState.items) item.health *= 0.85
  cleaningState.tongueCoat *= 0.9
  cleaningState.dirty.upper = true
  cleaningState.dirty.lower = true
}

export function computeCleanStats(): CleanStats {
  const totals = { surface: [0, 0], interdental: [0, 0] }
  for (const item of cleaningState.items) {
    totals[item.group][0] += item.weight
    totals[item.group][1] += item.weight * item.health
  }
  const cleanedShare = ([total, remaining]: number[]) => (total ? 1 - remaining / total : 1)
  const surface = cleanedShare(totals.surface)
  const interdental = cleanedShare(totals.interdental)
  const tongue = 1 - cleaningState.tongueCoat
  const percent = (x: number) => Math.round(x * 1000) / 10
  return {
    surface: percent(surface),
    interdental: percent(interdental),
    tongue: percent(tongue),
    overall: percent(surface * 0.45 + interdental * 0.35 + tongue * 0.2),
  }
}
