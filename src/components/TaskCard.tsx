import type { Task } from '../types/task'
import { priorityBadgeClass } from '../lib/priorityStyles'

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
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const done = task.completed

  return (
    <article
      className={`flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3.5 transition hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)] ${done ? 'opacity-75' : ''}`}
    >
      <header className="flex items-center justify-between">
        <label className="relative flex cursor-pointer">
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
        <span
          className={`rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${priorityBadgeClass[task.priority]}`}
        >
          {task.priority}
        </span>
      </header>
      <h3
        className={`text-base font-semibold text-[var(--text)] ${done ? 'text-[var(--text-muted)] line-through' : ''}`}
      >
        {task.title}
      </h3>
      {task.description ? (
        <p className={`flex-1 text-sm leading-snug text-[var(--text-muted)] ${done ? 'line-through' : ''}`}>
          {task.description}
        </p>
      ) : (
        <p className="flex-1 text-sm italic text-[var(--text-muted)]">No description</p>
      )}
      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">{formatDueDate(task.dueDate)}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
            done
              ? 'bg-[var(--success-soft)] text-[var(--success)]'
              : 'bg-[var(--warning)] text-[#09090b]'
          }`}
        >
          {done ? 'Completed' : 'Pending'}
        </span>
      </footer>
      <div className="flex gap-1 border-t border-[var(--border)] pt-2">
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
