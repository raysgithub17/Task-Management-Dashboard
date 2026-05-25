import type { TaskFormValues } from '../lib/taskFormDefaults'
import { TaskFormFields } from './TaskFormFields'

interface CreateTaskModalProps {
  open: boolean
  values: TaskFormValues
  onValuesChange: (v: TaskFormValues) => void
  onClose: () => void
  onCreate: () => void
}

/** Fits viewport incl. mobile browser chrome; explicit height avoids flex intrinsic collapse under items-centered overlay. */
const MODAL_SHELL =
  'flex h-[min(92dvh,calc(100svh-2.5rem))] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] ring-1 ring-black/[0.06] dark:ring-white/[0.08]'

export function CreateTaskModal({
  open,
  values,
  onValuesChange,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.title.trim() || !values.dueDate) return
    onCreate()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-[3px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className={`my-auto ${MODAL_SHELL}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[var(--border)] px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="create-task-title" className="text-xl font-bold tracking-tight text-[var(--text)]">
              Create task
            </h2>
            <button
              type="button"
              className="rounded-full p-1.5 text-xl leading-none text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <form className="flex min-h-0 min-w-0 flex-1 flex-col px-6" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4">
            <TaskFormFields idPrefix="new" values={values} onChange={onValuesChange} />
          </div>
          <div className="shrink-0 border-t border-[var(--border)] py-5">
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cta-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
              >
                Create task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
