import type { Task } from '../types/task'
import { priorityBadgeClass } from '../lib/priorityStyles'
import { TaskStatusDropdown } from './TaskStatusDropdown'

function formatDueDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

interface TaskCardProps {
  readonly task: Task
  readonly onCompletedChange: (id: string, completed: boolean) => void
  readonly onEdit: (task: Task) => void
  readonly onDelete: (task: Task) => void
  readonly onOpenDetails: (task: Task) => void
}

export function TaskCard({
  task,
  onCompletedChange,
  onEdit,
  onDelete,
  onOpenDetails,
}: Readonly<TaskCardProps>) {
  return (
    <article
      className={`group relative flex flex-col gap-0 overflow-hidden rounded-r-2xl border border-[var(--border)] border-l-4 bg-[var(--surface)] p-5 pl-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition hover:border-[color-mix(in_srgb,var(--accent)_18%,var(--border))] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] ${
        {
          low: 'border-l-[var(--priority-low)]',
          medium: 'border-l-[var(--priority-med)]',
          high: 'border-l-[var(--priority-high)]',
        }[task.priority]
      }`}
    >
      <header className="mb-3 flex items-start justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`shrink-0 ${priorityBadgeClass[task.priority]}`}>
            {task.priority}
          </span>
          <TaskStatusDropdown variant="card" task={task} onCompletedChange={onCompletedChange} />
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-55 transition group-hover:opacity-100">
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--accent)]"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-semibold text-[var(--danger)] transition hover:text-[color-mix(in_srgb,var(--danger)_85%,black)]"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      </header>
      <button
        type="button"
        className="mt-auto w-full min-h-0 flex-1 cursor-pointer rounded-xl py-0.5 text-left outline-none transition hover:bg-[color-mix(in_srgb,var(--surface-elevated)_45%,transparent)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
        onClick={() => onOpenDetails(task)}
        aria-label={`View details: ${task.title}`}
      >
        <h3 title={task.title} className="line-clamp-2 text-sm font-bold leading-snug text-[var(--text)]">
          {task.title}
        </h3>
        {task.description ? (
          <p title={task.description} className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--text-muted)]">
            {task.description}
          </p>
        ) : (
          <p className="mt-2 text-xs italic text-[var(--text-muted)]">No description</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[color-mix(in_srgb,var(--border)_70%,transparent)] pt-3">
          <span className="text-[0.8125rem] font-medium text-[var(--text-muted)]">{formatDueDate(task.dueDate)}</span>
        </div>
      </button>
    </article>
  )
}
