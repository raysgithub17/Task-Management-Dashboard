import type { Task } from '../types/task'

interface DeleteConfirmDialogProps {
  task: Task | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({ task, onCancel, onConfirm }: DeleteConfirmDialogProps) {
  if (!task) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[380px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-title" className="text-lg font-bold text-[var(--text)]">
          Delete task?
        </h2>
        <p id="delete-desc" className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          This will permanently remove <strong className="text-[var(--text)]">{task.title || 'this task'}</strong>.
          This action cannot be undone.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-[var(--danger)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
