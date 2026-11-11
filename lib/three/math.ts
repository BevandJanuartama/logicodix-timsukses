export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function iceBiteCycle(elapsed: number) {
  const phase = (elapsed % 1.6) / 1.6
  return phase < 0.55 ? smoothstep(0.1, 0.55, phase) : 1 - smoothstep(0.62, 0.95, phase)
}
