'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  minutesBelowCriticalPh,
  plaquePhAt,
  STEPHAN_CRITICAL_PH,
  STEPHAN_DURATION_MINUTES,
  stephanMinutes,
  stephanScenarios,
} from '@/lib/data/stephanScenarios'
import { ExploreChip } from '@/components/ui/explore/ExploreChip'

const WIDTH = 320
const HEIGHT = 150
const PADDING = { left: 28, right: 8, top: 10, bottom: 22 }
const MIN_PH = 4.3
const MAX_PH = 7.2
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right
const AXIS_MINUTES = [0, 30, 60, 90, 120]
const AXIS_PH = [7, 6, 5]

const xAt = (minute: number) => PADDING.left + (minute / STEPHAN_DURATION_MINUTES) * PLOT_WIDTH
const yAt = (ph: number) => PADDING.top + ((MAX_PH - ph) / (MAX_PH - MIN_PH)) * (HEIGHT - PADDING.top - PADDING.bottom)
const criticalY = yAt(STEPHAN_CRITICAL_PH)

const curvePath = (exposures: number[]) =>
  stephanMinutes
    .map((minute) => `${minute ? 'L' : 'M'}${xAt(minute).toFixed(1)},${yAt(plaquePhAt(minute, exposures)).toFixed(1)}`)
    .join(' ')

export function StephanCurve() {
  const reduceMotion = useReducedMotion()
  const [scenarioId, setScenarioId] = useState(stephanScenarios[0].id)
  const scenario = stephanScenarios.find((item) => item.id === scenarioId) ?? stephanScenarios[0]
  const criticalMinutes = minutesBelowCriticalPh(scenario.exposures)

  return (
    <figure className="rounded-[var(--radius-control)] border border-line bg-[var(--chip-bg)] p-3">
      <figcaption className="font-display text-body font-semibold text-fg">Kurva pH plak</figcaption>
      <div role="group" aria-label="Pola minum" className="mt-2 flex flex-wrap gap-1.5">
        {stephanScenarios.map((item) => (
          <ExploreChip key={item.id} pressed={item.id === scenario.id} onClick={() => setScenarioId(item.id)}>
            {item.label}
          </ExploreChip>
        ))}
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-2 w-full" role="img" aria-label={`Grafik pH plak: ${scenario.caption}`}>
        <rect x={PADDING.left} y={PADDING.top} width={PLOT_WIDTH} height={criticalY - PADDING.top} fill="var(--color-success)" fillOpacity={0.08} />
        <rect x={PADDING.left} y={criticalY} width={PLOT_WIDTH} height={yAt(MIN_PH) - criticalY} fill="var(--color-danger)" fillOpacity={0.14} />
        <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={criticalY} y2={criticalY} stroke="var(--color-danger)" strokeDasharray="4 3" />
        <text x={WIDTH - PADDING.right - 2} y={criticalY + 11} textAnchor="end" fontSize={9} fill="var(--color-danger)" fontWeight={700}>
          pH &lt; 5,5 · mineral larut
        </text>
        <text x={WIDTH - PADDING.right - 2} y={criticalY - 4} textAnchor="end" fontSize={9} fill="var(--color-success)" fontWeight={700}>
          pulih (remineralisasi)
        </text>
        {AXIS_PH.map((ph) => (
          <text key={ph} x={PADDING.left - 6} y={yAt(ph) + 3} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.5}>
            {ph}
          </text>
        ))}
        {AXIS_MINUTES.map((minute) => (
          <text key={minute} x={xAt(minute)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>
            {minute}&prime;
          </text>
        ))}
        <motion.path
          key={scenario.id}
          d={curvePath(scenario.exposures)}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>
      <p className="mt-1 flex items-baseline justify-between gap-2 text-caption text-fg-secondary" aria-live="polite">
        <span>{scenario.caption}</span>
        <span className={criticalMinutes ? 'font-semibold text-danger' : 'font-semibold text-success'}>
          <span className="tabular-nums">±{criticalMinutes}</span> menit kritis
        </span>
      </p>
      <p className="mt-1 text-caption text-fg-muted">Ilustrasi edukatif yang disederhanakan.</p>
    </figure>
  )
}
