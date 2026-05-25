import { useState } from 'react'
import type { Priority } from '../types/task'
import { enhanceTaskTitleDescription } from '../lib/huggingfaceEnhance'
import type { TaskFormValues } from '../lib/taskFormDefaults'

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const fieldInputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-[var(--text-muted)] placeholder:opacity-75 focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-soft)]'

type TaskFormFieldsProps = Readonly<{
  values: TaskFormValues
  onChange: (values: TaskFormValues) => void
  idPrefix?: string
}>

export function TaskFormFields({ values, onChange, idPrefix = '' }: TaskFormFieldsProps) {
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const p = idPrefix ? `${idPrefix}-` : ''

  const set = <K extends keyof TaskFormValues>(key: K, v: TaskFormValues[K]) => {
    if (aiError) setAiError(null)
    onChange({ ...values, [key]: v })
  }

  const canEnhance = values.title.trim().length > 0 || values.description.trim().length > 0

  const handleAiEnhance = async () => {
    if (!canEnhance || aiBusy) return
    setAiBusy(true)
    setAiError(null)
    try {
      const next = await enhanceTaskTitleDescription(values.title, values.description)
      onChange({ ...values, title: next.title, description: next.description })
    } catch (e) {
      const msg =
        import.meta.env.DEV && e instanceof Error
          ? e.message
          : "Couldn’t enhance. Check your connection and try again."
      setAiError(msg)
    } finally {
      setAiBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor={`${p}title`} className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
          Title
        </label>
        <input
          id={`${p}title`}
          type="text"
          className={fieldInputClass}
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={200}
        />
      </div>
      <div>
        <label
          htmlFor={`${p}description`}
          className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]"
        >
          Description
        </label>
        <textarea
          id={`${p}description`}
          className={`${fieldInputClass} min-h-[4.5rem] resize-y`}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Add details…"
          rows={3}
          maxLength={2000}
        />
      </div>
      <div>
        <button
          type="button"
          id={`${p}ai-enhance`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_38%,var(--border))] bg-[var(--accent-soft)] px-4 py-2.5 text-xs font-semibold text-[var(--accent)] shadow-[var(--shadow)] transition hover:border-[var(--border-strong)] hover:bg-[color-mix(in_srgb,var(--accent-soft)_120%,transparent)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={!canEnhance || aiBusy}
          aria-busy={aiBusy}
          onClick={handleAiEnhance}
        >
          {aiBusy ? 'Enhancing…' : 'Enhance title & description with AI'}
        </button>
        {aiError ? (
          <p
            id={`${p}ai-enhance-error`}
            role="alert"
            className="mt-2 text-xs leading-snug text-[var(--danger)]"
          >
            {aiError}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${p}priority`}
            className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]"
          >
            Priority
          </label>
          <select
            id={`${p}priority`}
            className={fieldInputClass}
            value={values.priority}
            onChange={(e) => set('priority', e.target.value as Priority)}
          >
            {priorities.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${p}due`} className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
            Due date
          </label>
          <input
            id={`${p}due`}
            type="date"
            className={fieldInputClass}
            value={values.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )
}
