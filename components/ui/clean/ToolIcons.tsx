import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const iconBase: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function BrushIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M3 20 14 9" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" transform="rotate(45 17 5.5)" />
      <path d="M15.5 4.5v-2M18 7v-2M20.5 9.5v-2" />
    </svg>
  )
}

export function FlossIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M6 4h6M6 14h6M12 4v10M12 9h8" />
      <path d="M6 4v10" strokeDasharray="2 2" />
    </svg>
  )
}

export function ScraperIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M9 4a5 5 0 0 0 0 10" />
      <path d="M9 4l5 4M9 14l5-4M14 9h7" />
    </svg>
  )
}
