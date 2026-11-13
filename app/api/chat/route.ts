import { GoogleGenAI } from '@google/genai'
import { buildSystemPrompt } from '@/lib/chat/systemPrompt'
import { CHAT_LIMITS, type ChatMessage, type ChatReply } from '@/lib/chat/types'
import { loadRemoteConditions } from '@/lib/data/conditionsCsv'
import { diseases } from '@/lib/data/diseases'
import type { Disease } from '@/lib/types'

const DEFAULT_MODEL = 'gemini-3.8-flash' // Pastikan model ini aktif di project GCP Anda
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX_REQUESTS = 20
const RATE_LOG_MAX_CLIENTS = 5000
const requestLog = new Map<string, number[]>()

const REPLY_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    conditionId: { type: ['string', 'null'] },
  },
  required: ['reply', 'conditionId'],
}

function isRateLimited(clientId: string) {
  const now = Date.now()
  if (requestLog.size > RATE_LOG_MAX_CLIENTS) requestLog.clear()
  const recent = (requestLog.get(clientId) ?? []).filter((time) => now - time < RATE_WINDOW_MS)
  recent.push(now)
  requestLog.set(clientId, recent)
  return recent.length > RATE_MAX_REQUESTS
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages
  if (!Array.isArray(messages) || messages.length === 0) return null
  const valid = messages.slice(-CHAT_LIMITS.maxMessages).filter(
    (message): message is ChatMessage =>
      (message?.role === 'user' || message?.role === 'model') &&
      typeof message.text === 'string' &&
      message.text.trim().length > 0 &&
      message.text.length <= CHAT_LIMITS.maxMessageLength,
  )
  return valid.length && valid.at(-1)?.role === 'user' ? valid : null
}

async function knownConditions(): Promise<Disease[]> {
  const remote = (await loadRemoteConditions()).map(({ disease }) => disease)
  const remoteIds = new Set(remote.map((disease) => disease.id))
  return [...diseases.filter((disease) => !remoteIds.has(disease.id)), ...remote]
}

const errorResponse = (error: string, status: number) => Response.json({ error }, { status })

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return errorResponse('not_configured', 503)

  const clientId = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (isRateLimited(clientId)) return errorResponse('rate_limited', 429)

  const messages = parseMessages(await request.json().catch(() => null))
  if (!messages) return errorResponse('invalid_request', 400)

  const conditions = await knownConditions()

  try {
    // Karena pakai kunci AQ., kita aktifkan flag vertexai: true
    const vertexai =
      process.env.GEMINI_VERTEX_EXPRESS?.trim().toLowerCase() === 'true'

    const ai = new GoogleGenAI({
      apiKey,
      vertexai,
    })
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
      contents: messages.map(({ role, text }) => ({ role, parts: [{ text }] })),
      config: {
        systemInstruction: buildSystemPrompt(conditions),
        maxOutputTokens: 600,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseJsonSchema: REPLY_SCHEMA,
      },
    })
    const parsed = JSON.parse(response.text ?? '{}') as Partial<ChatReply>
    const conditionId = conditions.some((disease) => disease.id === parsed.conditionId) ? parsed.conditionId! : null
    if (!parsed.reply) return errorResponse('empty_reply', 502)
    return Response.json({ reply: parsed.reply, conditionId } satisfies ChatReply)
  } catch (error) {
    console.error('Gemini chat gagal:', error)
    return errorResponse('upstream_failed', 502)
  }
}