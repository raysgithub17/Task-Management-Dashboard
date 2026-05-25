import type { Task } from '../types/task'
import { extractJsonObject, hfChatCompletionText } from './huggingfaceChat'

export {
  DEFAULT_HF_CHAT_MODEL,
  HF_CHAT_MODEL_FALLBACK_CHAIN,
} from './huggingfaceChat'

export type AiInsightsResult = {
  summary: string
  recommendations: string[]
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

/** Compact task list for the model; caps count and field length to stay within limits. */
export function tasksToModelContext(tasks: Task[], maxTasks = 35): string {
  const slice = tasks.slice(0, maxTasks)
  const lines = slice.map((t, i) => {
    const status = t.completed ? 'completed' : 'pending'
    const desc = t.description ? truncate(t.description.trim().replace(/\s+/g, ' '), 160) : ''
    const tail = desc ? ` — ${desc}` : ''
    return `${i + 1}. [${status}] ${t.priority} priority, due ${t.dueDate}: ${truncate(t.title.trim(), 120)}${tail}`
  })
  const more =
    tasks.length > maxTasks ? `\n… and ${tasks.length - maxTasks} more task(s) not listed.` : ''
  return lines.join('\n') + more
}

function parseInsightsJson(raw: string): AiInsightsResult {
  const parsed = JSON.parse(raw) as unknown
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('AI response was not a JSON object')
  }
  const o = parsed as Record<string, unknown>
  const summary = typeof o.summary === 'string' ? o.summary.trim() : ''
  let recommendations: string[] = []
  if (Array.isArray(o.recommendations)) {
    recommendations = o.recommendations
      .filter((x): x is string => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
  }
  if (!summary && recommendations.length === 0) {
    throw new Error('AI returned empty summary and recommendations')
  }
  return { summary, recommendations }
}

export async function fetchTaskAiInsights(
  tasks: Task[],
  preferredModel?: string,
): Promise<AiInsightsResult> {
  const context = tasksToModelContext(tasks)
  const userPrompt = `Here is the user's current task list (one line per task):

${context || '(no tasks)'}

Respond with ONLY a single JSON object and no other text. Use this exact shape:
{"summary":"<2-4 sentences overview of workload, urgency, and completed vs pending>","recommendations":["<specific actionable tip 1>","<tip 2>","<tip 3>"]}

Guidelines:
- Base everything only on the tasks given; do not invent tasks.
- Recommendations should be concrete (what to do next, what to reschedule, batching similar work).
- If there are no tasks, summary should say so and recommendations can suggest adding a few starter tasks.`

  const assistant = await hfChatCompletionText({
    systemPrompt:
      'You are a concise productivity assistant. Output valid JSON only, no markdown fences unless the user requires it — they do not: return raw JSON only.',
    userPrompt,
    maxTokens: 900,
    temperature: 0.4,
    preferredModel,
  })

  try {
    return parseInsightsJson(extractJsonObject(assistant))
  } catch {
    return {
      summary: assistant.trim(),
      recommendations: [],
    }
  }
}
