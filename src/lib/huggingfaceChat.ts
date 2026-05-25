/** Routed through Vite proxy in dev — see vite.config.ts */
export const HF_CHAT_COMPLETIONS_URL = '/hf-api/v1/chat/completions'

/**
 * Models to try in order if the router rejects one (e.g. not enabled for your account).
 * `:preferred` follows the provider order in HF → Settings → Inference Providers.
 */
export const HF_CHAT_MODEL_FALLBACK_CHAIN: readonly string[] = [
  'openai/gpt-oss-120b:preferred',
  'deepseek-ai/DeepSeek-V3-0324:preferred',
  'meta-llama/Meta-Llama-3.1-8B-Instruct:preferred',
  'Qwen/Qwen2.5-1.5B-Instruct:preferred',
]

export const DEFAULT_HF_CHAT_MODEL =
  import.meta.env.VITE_HF_CHAT_MODEL?.trim() || HF_CHAT_MODEL_FALLBACK_CHAIN[0]

export function resolveModelTryOrder(preferredModel?: string): string[] {
  const primary = (preferredModel ?? DEFAULT_HF_CHAT_MODEL).trim()
  const seen = new Set<string>()
  const out: string[] = []
  for (const m of [primary, ...HF_CHAT_MODEL_FALLBACK_CHAIN]) {
    if (!m || seen.has(m)) continue
    seen.add(m)
    out.push(m)
  }
  return out
}

export function isRetriableProviderError(message: string): boolean {
  if (!message.startsWith('400:')) return false
  const lower = message.toLowerCase()
  return (
    lower.includes('not supported') ||
    lower.includes('no provider') ||
    lower.includes('provider you have enabled')
  )
}

export function extractMessageContent(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null
  const choices = (data as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return null
  const first = choices[0]
  if (typeof first !== 'object' || first === null) return null
  const message = (first as { message?: { content?: unknown } }).message
  const content = message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const parts = content
      .map((p) => {
        if (typeof p !== 'object' || p === null) return ''
        const t = (p as { type?: unknown; text?: unknown }).text
        return typeof t === 'string' ? t : ''
      })
      .join('')
    return parts || null
  }
  return null
}

export function extractJsonObject(text: string): string {
  let s = text.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(s)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start >= 0 && end > start) return s.slice(start, end + 1)
  return s
}

type ChatParams = Readonly<{
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
  preferredModel?: string
}>

async function postOnce(model: string, params: ChatParams): Promise<string> {
  const res = await fetch(HF_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userPrompt },
      ],
      stream: false,
      max_tokens: params.maxTokens ?? 1024,
      temperature: params.temperature ?? 0.35,
    }),
  })

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    let msg = res.statusText || 'Request failed'
    if (typeof data === 'object' && data !== null) {
      const err = (data as { error?: { message?: string } }).error
      if (err && typeof err.message === 'string' && err.message) {
        msg = err.message
      }
    }
    throw new Error(`${res.status}: ${msg}`)
  }

  const content = extractMessageContent(data)
  if (!content) {
    throw new Error('Unexpected response shape from the model')
  }
  return content
}

/** Plain assistant text from chat/completions with model fallback (same routing as dashboard insights). */
export async function hfChatCompletionText(params: ChatParams): Promise<string> {
  const models = resolveModelTryOrder(params.preferredModel)
  const tried: string[] = []
  let lastError: Error | null = null

  for (let i = 0; i < models.length; i += 1) {
    const model = models[i]
    if (!model) continue
    tried.push(model)
    try {
      return await postOnce(model, params)
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      lastError = err
      const hasMore = i < models.length - 1
      if (hasMore && isRetriableProviderError(err.message)) {
        continue
      }
      throw err
    }
  }

  const detail = lastError?.message ?? 'Request failed'
  throw new Error(`${detail}\n\nTried models: ${tried.join(', ')}`)
}
