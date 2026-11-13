'use client'

import { Box } from 'lucide-react'
import { chooseDisease } from '@/components/ui/diseases/chooseDisease'
import type { ChatMessage } from '@/lib/chat/types'
import { useAppStore } from '@/lib/store'

function showConditionInModel(conditionId: string) {
  useAppStore.getState().setMode('diseases')
  chooseDisease(conditionId)
}

export function ChatMessageItem({ message }: { message: ChatMessage }) {
  const fromUser = message.role === 'user'

  return (
    <li className={`flex flex-col ${fromUser ? 'items-end' : 'items-start'}`}>
      <p
        className={`max-w-[85%] rounded-[var(--radius-control)] px-3.5 py-2.5 text-body whitespace-pre-line ${
          fromUser ? 'bg-accent-fill text-on-accent' : 'bg-surface-sunken text-fg'
        }`}
      >
        {message.text}
      </p>
      {message.conditionId && (
        <button
          type="button"
          onClick={() => showConditionInModel(message.conditionId!)}
          className="mt-1.5 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] px-2 text-caption font-semibold text-accent transition-transform duration-[var(--duration-press)] ease-[var(--ease-out)] hover:underline active:scale-[var(--scale-press)]"
        >
          <Box className="size-4" aria-hidden />
          Lihat di model 3D
        </button>
      )}
    </li>
  )
}
