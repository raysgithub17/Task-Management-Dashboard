import { useCallback, useState } from 'react'
import type { Task } from '../types/task'
import {
  DEFAULT_HF_CHAT_MODEL,
  fetchTaskAiInsights,
  type AiInsightsResult,
} from '../lib/huggingfaceInsights'

type Props = Readonly<{
  tasks: Task[]
}>

function buttonLabel(loading: boolean, hasInsights: boolean): string {
  if (loading) return 'Generating…'
  if (hasInsights) return 'Refresh insights'
  return 'Generate insights'
}

function recoKey(text: string): string {
  let h = 0
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(31, h) + text.charCodeAt(i)
    h |= 0
  }
  return `r-${h}`
}

/** Decorative mini-widgets like the Figma “workflow” preview panel. */
function WorkflowInsightsDecor() {
  const cell = (bar: string, wBar: string) => (
    <div className="flex h-10 flex-col justify-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--surface-elevated)_82%,transparent)] p-1.5 ring-1 ring-[color-mix(in_srgb,var(--border)_65%,transparent)] dark:bg-[color-mix(in_srgb,var(--surface)_65%,transparent)]">
      <div className={`h-2 rounded bg-[color-mix(in_srgb,var(--text-muted)_32%,transparent)] ${wBar}`} />
      <div className={`h-1.5 rounded ${bar}`} />
    </div>
  )

  return (
    <div
      className="grid w-full max-w-none grid-cols-2 gap-2 rounded-xl border border-[color-mix(in_srgb,var(--surface)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] p-4 shadow-inner dark:bg-[color-mix(in_srgb,var(--surface)_45%,transparent)] md:max-w-[18rem]"
      aria-hidden
    >
      {cell('bg-[color-mix(in_srgb,var(--accent)_38%,transparent)]', 'w-3/4')}
      {cell('bg-[color-mix(in_srgb,var(--success)_45%,transparent)]', 'w-5/6')}
      {cell('bg-[color-mix(in_srgb,var(--warning)_45%,transparent)]', 'w-2/3')}
      {cell('bg-[color-mix(in_srgb,var(--text-muted)_18%,transparent)]', 'w-4/5')}
    </div>
  )
}

function InsightsBody({ insights }: Readonly<{ insights: AiInsightsResult }>) {
  const showRecoFallback = insights.recommendations.length === 0 && !insights.summary

  return (
    <div className="space-y-4 text-[0.875rem] leading-relaxed text-[var(--text)]">
      {insights.summary ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3.5 backdrop-blur-sm dark:bg-[var(--surface-elevated)]">
          <h3 className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Summary
          </h3>
          <p className="whitespace-pre-wrap text-[var(--text)]">{insights.summary}</p>
        </div>
      ) : null}
      {insights.recommendations.length > 0 ? (
        <div>
          <h3 className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Recommendations
          </h3>
          <ul className="space-y-3">
            {insights.recommendations.map((r) => (
              <li key={recoKey(r)} className="flex gap-3 text-[0.875rem] leading-snug text-[var(--text)]">
                <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {showRecoFallback ? (
        <p className="text-[var(--text-muted)]">No structured recommendations; see summary above.</p>
      ) : null}
    </div>
  )
}

export function TaskAiInsightsPanel({ tasks }: Props) {
  const [insights, setInsights] = useState<AiInsightsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchTaskAiInsights(tasks)
      setInsights(result)
    } catch (e) {
      setInsights(null)
      const message = e instanceof Error ? e.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [tasks])

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[var(--insights-border)] shadow-[var(--insights-shadow)]"
      style={{
        background: `linear-gradient(to right, var(--insights-gradient-from), var(--insights-gradient-via), var(--insights-gradient-to))`,
      }}
      aria-labelledby="ai-insights-heading"
    >
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-md space-y-3">
          <h2 id="ai-insights-heading" className="text-lg font-bold tracking-tight text-[var(--text-display)] dark:text-[var(--text)]">
            Workflow Intelligence
          </h2>
          <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)]">
            Let AI organize and prioritize your tasks, delivering insights dynamically from your current active
            workloads.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={load}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_14px_-2px_color-mix(in_srgb,var(--accent)_52%,transparent)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-55 dark:shadow-black/25"
          >
            {buttonLabel(loading, Boolean(insights))}
          </button>
        </div>
        <WorkflowInsightsDecor />
      </div>

      <div className="space-y-4 border-t border-[color-mix(in_srgb,var(--insights-border)_70%,transparent)] px-6 py-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)] px-4 py-3.5 text-[0.8125rem] text-[var(--danger)]"
          >
            <p className="font-semibold">Could not load AI insights</p>
            <p className="mt-1 whitespace-pre-wrap break-words opacity-95">{error}</p>
            {import.meta.env.DEV ? (
              <p className="mt-2 text-[var(--text-muted)]">
                Dev: ensure <code className="rounded bg-[var(--surface)] px-1 py-0.5 text-[0.75rem]">npm run dev</code>{' '}
                and <code className="rounded bg-[var(--surface)] px-1 py-0.5 text-[0.75rem]">HF_ACCESS_TOKEN</code> in{' '}
                <code className="rounded bg-[var(--surface)] px-1 py-0.5 text-[0.75rem]">.env</code>. The app tries several
                models until one works with your{' '}
                <a
                  href="https://huggingface.co/settings/inference-providers"
                  className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  enabled Inference Providers
                </a>
                ; first: <span className="font-mono text-[0.75rem]">{DEFAULT_HF_CHAT_MODEL}</span>. Optional{' '}
                <span className="font-mono text-[0.75rem]">VITE_HF_CHAT_MODEL</span> in{' '}
                <span className="font-mono text-[0.75rem]">.env</span>.
              </p>
            ) : (
              <p className="mt-2 text-[var(--text-muted)]">
                Check your connection and try again. If this keeps failing, try again later.
              </p>
            )}
          </div>
        )}

        {!insights && !error && !loading && (
          <p className="text-center text-sm font-medium leading-relaxed text-[var(--text-muted)] md:text-left">
            Generate a short summary of your workload and prioritized recommendations.
          </p>
        )}

        {loading && !insights && (
          <p className="text-center text-sm text-[var(--text-muted)] md:text-left">Contacting the model…</p>
        )}

        {insights ? <InsightsBody insights={insights} /> : null}
      </div>
    </section>
  )
}
