import type { Priority } from '../types/task'
import type { TaskFormValues } from '../lib/taskFormDefaults'

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const fieldInputClass =
  'w-full rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]'

interface TaskFormFieldsProps {
  values: TaskFormValues
  onChange: (values: TaskFormValues) => void
  idPrefix?: string
}

export function TaskFormFields({ values, onChange, idPrefix = '' }: TaskFormFieldsProps) {
  const p = idPrefix ? `${idPrefix}-` : ''

  const set = <K extends keyof TaskFormValues>(key: K, v: TaskFormValues[K]) => {
    onChange({ ...values, [key]: v })
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
