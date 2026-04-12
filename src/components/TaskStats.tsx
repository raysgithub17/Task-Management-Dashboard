interface TaskStatsProps {
  total: number
  pending: number
  completed: number
}

export function TaskStats({ total, pending, completed }: TaskStatsProps) {
  return (
    <div
      className="flex flex-wrap items-stretch overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] max-[420px]:flex-col"
      role="region"
      aria-label="Task counts"
    >
      <div className="flex min-w-[5.5rem] flex-1 flex-col gap-0.5 px-[1.1rem] py-3.5 transition hover:bg-[var(--surface-elevated)] max-[420px]:border-b max-[420px]:border-[var(--border)]">
        <span className="order-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Total
        </span>
        <span className="order-2 text-[1.375rem] font-semibold leading-tight tracking-tight text-[var(--text)]">
          {total}
        </span>
      </div>
      <span className="w-px shrink-0 self-stretch bg-[var(--border)] max-[420px]:hidden" aria-hidden />
      <div className="flex min-w-[5.5rem] flex-1 flex-col gap-0.5 px-[1.1rem] py-3.5 transition hover:bg-[var(--surface-elevated)] max-[420px]:border-b max-[420px]:border-[var(--border)]">
        <span className="order-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Pending
        </span>
        <span className="order-2 text-[1.375rem] font-semibold leading-tight tracking-tight text-[var(--warning)]">
          {pending}
        </span>
      </div>
      <span className="w-px shrink-0 self-stretch bg-[var(--border)] max-[420px]:hidden" aria-hidden />
      <div className="flex min-w-[5.5rem] flex-1 flex-col gap-0.5 px-[1.1rem] py-3.5 transition hover:bg-[var(--surface-elevated)]">
        <span className="order-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Completed
        </span>
        <span className="order-2 text-[1.375rem] font-semibold leading-tight tracking-tight text-[var(--success)]">
          {completed}
        </span>
      </div>
    </div>
  )
}
