import type { Task } from '../types/task'
import type { TaskFormValues } from '../lib/taskFormDefaults'
import { TaskFormFields } from './TaskFormFields'

interface EditTaskModalProps {
  task: Task | null
  values: TaskFormValues
  onValuesChange: (v: TaskFormValues) => void
  onClose: () => void
  onSave: () => void
}

export function EditTaskModal({
  task,
  values,
  onValuesChange,
  onClose,
  onSave,
}: EditTaskModalProps) {
  if (!task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.title.trim() || !values.dueDate) return
    onSave()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-[480px] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 id="edit-task-title" className="text-lg font-bold text-[var(--text)]">
            Edit task
          </h2>
          <button
            type="button"
            className="rounded-md p-1 text-2xl leading-none text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <TaskFormFields idPrefix="edit" values={values} onChange={onValuesChange} />
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-[0.98]"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
