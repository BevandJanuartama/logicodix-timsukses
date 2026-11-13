import { useEffect } from 'react'

interface QuizKeyboardHandlers {
  optionCount: number
  selected: number | null
  checked: boolean
  onSelect: (optionIndex: number) => void
  onConfirm: () => void
}

const LETTERS = 'abcd'
const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])
const ACTIVATABLE_TAGS = new Set(['SUMMARY', 'A', 'BUTTON'])

function isTextEntry(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || TEXT_ENTRY_TAGS.has(target.tagName))
}

function focusOption(optionIndex: number) {
  document.querySelectorAll<HTMLElement>('[data-quiz-option]')[optionIndex]?.focus()
}

function ownsEnterKey(target: EventTarget | null) {
  return target instanceof HTMLElement && ACTIVATABLE_TAGS.has(target.tagName) && !target.hasAttribute('data-quiz-option')
}

export function useQuizKeyboard({ optionCount, selected, checked, onSelect, onConfirm }: QuizKeyboardHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || isTextEntry(event.target)) return

      const letterIndex = LETTERS.indexOf(event.key.toLowerCase())
      const digit = Number(event.key)
      const optionIndex = letterIndex >= 0 ? letterIndex : Number.isInteger(digit) ? digit - 1 : -1
      if (event.key.length === 1 && optionIndex >= 0 && optionIndex < optionCount) {
        event.preventDefault()
        onSelect(optionIndex)
        focusOption(optionIndex)
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (checked) return
        const step = event.key === 'ArrowDown' ? 1 : -1
        onSelect(selected === null ? (step === 1 ? 0 : optionCount - 1) : (selected + step + optionCount) % optionCount)
        return
      }

      if (event.key === 'Enter' && !ownsEnterKey(event.target)) {
        event.preventDefault()
        onConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [optionCount, selected, checked, onSelect, onConfirm])
}
