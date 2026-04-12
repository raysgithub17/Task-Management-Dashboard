import type { Task } from '../types/task'
import { priorityBadgeClass } from '../lib/priorityStyles'

function formatDueDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

interface TaskListItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskListItem({ task, onToggle, onEdit, onDelete }: TaskListItemProps) {
  const done = task.completed

  return (
    <article
      className={`flex flex-wrap items-stretch justify-between gap-3 gap-y-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 transition hover:border-[var(--border-strong)] ${done ? 'opacity-[0.72]' : ''}`}
      aria-label={task.title}
    >
      <div className="flex min-w-0 flex-1 gap-3.5">
        <label className="group relative flex shrink-0 cursor-pointer pt-0.5">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          />
          <span
            className="flex h-5 w-5 shrink-0 rounded border-2 border-[var(--border-strong)] transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:shadow-[inset_0_0_0_2px_var(--surface)]"
            aria-hidden
          />
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-x-3">
            <h3
              className={`text-[1.05rem] font-semibold text-[var(--text)] transition ${done ? 'text-[var(--text-muted)] line-through' : ''}`}
            >
              {task.title}
            </h3>
            <span
              className={`rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${priorityBadgeClass[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
          {task.description ? (
            <p
              className={`mt-1.5 text-sm leading-snug text-[var(--text-muted)] ${done ? 'line-through' : ''}`}
            >
              {task.description}
            </p>
          ) : (
            <p className="mt-1.5 text-sm italic text-[var(--text-muted)]">No description</p>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 gap-x-3">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Due {formatDueDate(task.dueDate)}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
                done
                  ? 'bg-[var(--success-soft)] text-[var(--success)]'
                  : 'bg-[var(--warning)] text-[#09090b]'
              }`}
            >
              {done ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-start gap-1 max-[520px]:w-full max-[520px]:justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
