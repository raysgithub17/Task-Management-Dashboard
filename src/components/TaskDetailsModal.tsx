import type { Task } from '../types/task'
import { priorityBadgeClass } from '../lib/priorityStyles'
import { TaskStatusDropdown } from './TaskStatusDropdown'

type TaskDetailsModalProps = Readonly<{
  task: Task | null
  onClose: () => void
  onEdit: (task: Task) => void
  onCompletedChange: (id: string, completed: boolean) => void
}>

function formatDueDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatCreated(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return '—'
  }
}

export function TaskDetailsModal({ task, onClose, onEdit, onCompletedChange }: TaskDetailsModalProps) {
  if (!task) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[3px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex min-h-0 w-full max-w-[500px] max-h-[min(90dvh,calc(100dvh-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[var(--border)] px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="task-details-title" className="break-words text-xl font-bold tracking-tight text-[var(--text)]">
                  {task.title}
                </h2>
                <span className={`shrink-0 ${priorityBadgeClass[task.priority]}`}>{task.priority}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <TaskStatusDropdown variant="card" task={task} onCompletedChange={onCompletedChange} />
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full p-1.5 text-xl leading-none text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 basis-0 overflow-y-auto overscroll-contain px-6 py-4">
          <div className="space-y-5 text-[var(--text)]">
            <section>
              <h3 className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Description
              </h3>
              {task.description.trim() ? (
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--text-muted)]">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm italic text-[var(--text-muted)]">No description</p>
              )}
            </section>

            <dl className="grid gap-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--border)] pt-4">
                <dt className="font-semibold text-[var(--text-muted)]">Due date</dt>
                <dd className="text-[var(--text)]">{formatDueDate(task.dueDate)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <dt className="font-semibold text-[var(--text-muted)]">Created</dt>
                <dd className="text-[var(--text)]">{formatCreated(task.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="shrink-0 border-t border-[var(--border)] px-6 py-5">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="bg-cta-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
              onClick={() => {
                onEdit(task)
                onClose()
              }}
            >
              Edit task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
