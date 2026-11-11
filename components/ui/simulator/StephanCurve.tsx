'use client'

import { motion, useReducedMotion } from 'framer-motion'

const WIDTH = 320
const HEIGHT = 150
const PADDING = { left: 28, right: 8, top: 10, bottom: 22 }
const DURATION_MINUTES = 120
const CRITICAL_PH = 5.5
const SINGLE_DRINK = [0]
const SIPPED_HOUR = Array.from({ length: 11 }, (_, i) => i * 6)

function plaquePh(minute: number, sips: number[]) {
  const drop = sips.reduce((sum, sip) => {
    const since = minute - sip
    if (since < 0) return sum
    return sum + 2.3 * (since < 3 ? since / 3 : Math.exp(-(since - 3) / 20))
  }, 0)
  return 7 - Math.min(drop, 2.5)
}

const xAt = (minute: number) => PADDING.left + (minute / DURATION_MINUTES) * (WIDTH - PADDING.left - PADDING.right)
const yAt = (ph: number) => PADDING.top + ((7.2 - ph) / (7.2 - 4.3)) * (HEIGHT - PADDING.top - PADDING.bottom)

const minutes = Array.from({ length: DURATION_MINUTES + 1 }, (_, i) => i)
const curvePath = (sips: number[]) =>
  minutes.map((minute) => `${minute ? 'L' : 'M'}${xAt(minute).toFixed(1)},${yAt(plaquePh(minute, sips)).toFixed(1)}`).join(' ')
const minutesBelowCritical = (sips: number[]) => minutes.filter((minute) => plaquePh(minute, sips) < CRITICAL_PH).length

const CURVES = [
  { label: 'Diminum sekali habis', sips: SINGLE_DRINK, stroke: 'var(--color-brand)' },
  { label: 'Diseruput selama 1 jam', sips: SIPPED_HOUR, stroke: 'var(--color-coral)' },
]

export function StephanCurve() {
  const reduceMotion = useReducedMotion()
  return (
    <figure className="rounded-2xl bg-white/60 p-3 ring-1 ring-ink/8">
      <figcaption className="text-[13px] font-bold">Kurva pH plak (kurva Stephan)</figcaption>
      <p className="mb-2 text-[12px] leading-snug text-ink/60">
        Setiap paparan gula memicu penurunan pH plak. Di bawah ±5,5 mineral email mulai larut.
      </p>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Grafik pH plak terhadap waktu">
        <rect
          x={PADDING.left}
          y={yAt(CRITICAL_PH)}
          width={WIDTH - PADDING.left - PADDING.right}
          height={yAt(4.3) - yAt(CRITICAL_PH)}
          fill="var(--color-coral)"
          fillOpacity={0.1}
        />
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={yAt(CRITICAL_PH)}
          y2={yAt(CRITICAL_PH)}
          stroke="var(--color-coral)"
          strokeDasharray="4 3"
        />
        <text x={WIDTH - PADDING.right - 2} y={yAt(CRITICAL_PH) - 4} textAnchor="end" fontSize={9} fill="var(--color-coral)" fontWeight={700}>
          zona kritis 5,5
        </text>
        {[7, 6, 5].map((ph) => (
          <text key={ph} x={PADDING.left - 6} y={yAt(ph) + 3} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.45}>
            {ph}
          </text>
        ))}
        {[0, 30, 60, 90, 120].map((minute) => (
          <text key={minute} x={xAt(minute)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>
            {minute}′
          </text>
        ))}
        {CURVES.map((curve, index) => (
          <motion.path
            key={curve.label}
            d={curvePath(curve.sips)}
            fill="none"
            stroke={curve.stroke}
            strokeWidth={2.2}
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: index * 0.25, ease: 'easeOut' }}
          />
        ))}
      </svg>
      <ul className="mt-1 grid grid-cols-2 gap-2 text-[12px]">
        {CURVES.map((curve) => (
          <li key={curve.label} className="flex items-start gap-1.5">
            <span aria-hidden className="mt-1 h-2 w-3 shrink-0 rounded" style={{ background: curve.stroke }} />
            <span>
              {curve.label}: <b className="tabular-nums">±{minutesBelowCritical(curve.sips)} menit</b> di zona kritis
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[10.5px] text-ink/45">Ilustrasi edukatif yang disederhanakan.</p>
    </figure>
  )
}
