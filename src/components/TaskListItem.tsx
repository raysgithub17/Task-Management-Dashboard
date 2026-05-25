import type { Task } from '../types/task'
import { priorityBadgeClass } from '../lib/priorityStyles'
import { TaskStatusDropdown } from './TaskStatusDropdown'

function formatDueDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

interface TaskListItemProps {
  readonly task: Task
  readonly onCompletedChange: (id: string, completed: boolean) => void
  readonly onEdit: (task: Task) => void
  readonly onDelete: (task: Task) => void
  readonly onOpenDetails: (task: Task) => void
}

const priorityBarClass: Record<Task['priority'], string> = {
  low: 'border-l-[var(--priority-low)]',
  medium: 'border-l-[var(--priority-med)]',
  high: 'border-l-[var(--priority-high)]',
}

export function TaskListItem({
  task,
  onCompletedChange,
  onEdit,
  onDelete,
  onOpenDetails,
}: Readonly<TaskListItemProps>) {
  const openDetails = () => onOpenDetails(task)

  return (
    <li
      className={`group space-y-0 rounded-r-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] ${priorityBarClass[task.priority]} border-l-4`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            role="button"
            tabIndex={0}
            className="min-w-0 cursor-pointer rounded-lg py-0.5 outline-none transition hover:bg-[color-mix(in_srgb,var(--surface-elevated)_45%,transparent)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
            onClick={openDetails}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openDetails()
              }
            }}
            aria-label={`View details: ${task.title}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 title={task.title} className="line-clamp-2 min-w-0 flex-1 text-sm font-bold leading-snug text-[var(--text)]">
                {task.title}
              </h3>
              <span className={`shrink-0 ${priorityBadgeClass[task.priority]}`}>{task.priority}</span>
            </div>
            {task.description ? (
              <p title={task.description} className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--text-muted)]">
                {task.description}
              </p>
            ) : (
              <p className="mt-1.5 text-xs italic text-[var(--text-muted)]">No description</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color-mix(in_srgb,var(--border)_88%,transparent)] pt-3 text-[11px] text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md text-left outline-none ring-[var(--accent)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                onClick={(e) => {
                  e.stopPropagation()
                  openDetails()
                }}
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0 opacity-85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDueDate(task.dueDate)}
              </button>
              <TaskStatusDropdown variant="list" task={task} onCompletedChange={onCompletedChange} />
            </div>
          </div>
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
      </div>
    </li>
  )
}
