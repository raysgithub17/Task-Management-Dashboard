import {
  DEFAULT_HF_CHAT_MODEL,
  extractJsonObject,
  hfChatCompletionText,
} from './huggingfaceChat'

const TITLE_MAX = 200
const DESC_MAX = 2000

export type EnhancedTaskDraft = Readonly<{ title: string; description: string }>

function clampTitle(s: string): string {
  const t = s.trim()
  return t.length <= TITLE_MAX ? t : t.slice(0, TITLE_MAX).trimEnd()
}

function clampDescription(s: string): string {
  const t = s.trim()
  return t.length <= DESC_MAX ? t : t.slice(0, DESC_MAX).trimEnd()
}

function parseEnhanced(raw: string, fallbackTitle: string, fallbackDescription: string): EnhancedTaskDraft {
  try {
    const parsed = JSON.parse(extractJsonObject(raw)) as unknown
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Not an object')
    }
    const o = parsed as Record<string, unknown>
    const title = typeof o.title === 'string' ? clampTitle(o.title) : ''
    const description = typeof o.description === 'string' ? clampDescription(o.description) : ''
    if (!title && !description) {
      throw new Error('Empty fields')
    }
    return {
      title: title || clampTitle(fallbackTitle),
      description:
        description === '' ? clampDescription(fallbackDescription) : description,
    }
  } catch {
    throw new Error('Could not parse AI response.')
  }
}

/**
 * Rewrite title/description for clarity; keeps intent, no fake tasks or new scope.
 */
export async function enhanceTaskTitleDescription(
  title: string,
  description: string,
  preferredModel?: string,
): Promise<EnhancedTaskDraft> {
  const tIn = title.trim()
  const dIn = description.trim()
  const userPrompt = `Current task draft:
title: ${tIn || '(empty)'}
description: ${dIn || '(empty)'}

Return ONLY valid JSON with this exact shape:
{"title":"<clear, concise task title>","description":"<optional details; empty string ok if none needed>"}

Rules:
- Keep the same meaning and scope as the draft; do not invent work the user did not imply.
- Title: short, actionable (max ~120 characters of content ideally; hard cap conceptually shorter than a sentence dump).
- Description: tighter wording, bullets ok as plain text lines if helpful; omit fluff.
- Use the same language as the inputs.`

  const assistant = await hfChatCompletionText({
    systemPrompt:
      'You improve task wording for a task manager. Output raw JSON only, no markdown fences.',
    userPrompt,
    maxTokens: 600,
    temperature: 0.25,
    preferredModel: preferredModel ?? DEFAULT_HF_CHAT_MODEL,
  })

  return parseEnhanced(assistant, tIn, dIn)
}
