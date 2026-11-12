'use client'

import type { ReactNode, Ref } from 'react'

interface ToolbarButtonProps {
  label: string
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
  hint?: string
  expanded?: boolean
  ref?: Ref<HTMLButtonElement>
  children: ReactNode
}

export function ToolbarButton({ label, onClick, pressed, disabled, hint, expanded, ref, children }: ToolbarButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      title={hint ?? label}
      className="flex size-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[var(--radius-control)] text-fg-secondary transition-[color,background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-out)] hover:bg-[var(--button-ghost-bg-hover)] hover:text-fg active:scale-[var(--scale-press)] disabled:pointer-events-none disabled:opacity-45 aria-pressed:bg-accent-tint aria-pressed:text-accent aria-expanded:bg-accent-tint aria-expanded:text-accent md:min-h-[52px] md:w-16 md:px-1 md:py-1"
    >
      {children}
      <span className="text-center text-[13px] leading-4 font-medium max-md:sr-only">{label}</span>
    </button>
  )
}
