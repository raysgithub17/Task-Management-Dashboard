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
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-[3px]"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="my-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-[var(--danger)] to-[color-mix(in_srgb,var(--danger)_45%,var(--accent))]" aria-hidden />
        <div className="p-6">
          <h2 id="delete-title" className="text-xl font-bold tracking-tight text-[var(--text)]">
            Delete task?
          </h2>
          <p id="delete-desc" className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            This will permanently remove <strong className="text-[var(--text)]">{task.title || 'this task'}</strong>.
            This action cannot be undone.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[var(--danger)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_color-mix(in_srgb,var(--danger)_50%,transparent)] transition hover:brightness-110 active:scale-[0.98]"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
