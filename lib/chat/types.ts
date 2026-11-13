export type ChatRole = 'user' | 'model'

export interface ChatMessage {
  role: ChatRole
  text: string
  conditionId?: string
}

export interface ChatReply {
  reply: string
  conditionId: string | null
}

export const CHAT_LIMITS = {
  maxMessages: 12,
  maxMessageLength: 1000,
} as const
