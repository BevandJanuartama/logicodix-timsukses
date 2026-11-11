import type { SVGProps } from 'react'

export function ToothMark({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M7 3c-2.2 0-4 1.8-4 4.2 0 2.3.9 3.8 1.6 5.6.6 1.6.7 3.6 1.1 5.6.3 1.6.9 2.6 1.8 2.6 1.4 0 1.4-2.1 1.9-4 .3-1.2.8-2 1.6-2s1.3.8 1.6 2c.5 1.9.5 4 1.9 4 .9 0 1.5-1 1.8-2.6.4-2 .5-4 1.1-5.6.7-1.8 1.6-3.3 1.6-5.6C21 4.8 19.2 3 17 3c-1.8 0-2.9 1-5 1S8.8 3 7 3z" />
    </svg>
  )
}
