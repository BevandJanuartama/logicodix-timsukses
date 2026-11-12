import { useEffect } from 'react'

interface QuizKeyboardHandlers {
  optionCount: number
  selected: number | null
  checked: boolean
  onSelect: (optionIndex: number) => void
  onConfirm: () => void
}

const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY', 'A'])

function isForeignInteractive(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || INTERACTIVE_TAGS.has(target.tagName)) return true
  return target.tagName === 'BUTTON' && !target.hasAttribute('data-quiz-option')
}

export function useQuizKeyboard({ optionCount, selected, checked, onSelect, onConfirm }: QuizKeyboardHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || isForeignInteractive(event.target)) return

      const digit = Number(event.key)
      if (Number.isInteger(digit) && digit >= 1 && digit <= optionCount) {
        event.preventDefault()
        onSelect(digit - 1)
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (checked) return
        const step = event.key === 'ArrowDown' ? 1 : -1
        onSelect(selected === null ? (step === 1 ? 0 : optionCount - 1) : (selected + step + optionCount) % optionCount)
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        onConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [optionCount, selected, checked, onSelect, onConfirm])
}
