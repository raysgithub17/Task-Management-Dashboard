interface TaskStatsProps {
  total: number
  pending: number
  completed: number
  /** Tasks created in the last 7 days (shown on Total card). */
  addedThisWeek: number
}

function SparkTotal() {
  return (
    <svg className="h-8 w-16 shrink-0 text-[var(--accent)] opacity-70" viewBox="0 0 60 20" fill="none" aria-hidden>
      <path d="M0 15 Q10 5 20 12 T40 4 T60 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SparkPending() {
  return (
    <svg className="h-8 w-16 shrink-0 text-[var(--warning)] opacity-75" viewBox="0 0 60 20" fill="none" aria-hidden>
      <path d="M0 10 Q12 18 24 8 T48 14 T60 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SparkCompleted() {
  return (
    <svg className="h-8 w-16 shrink-0 text-[var(--success)] opacity-75" viewBox="0 0 60 20" fill="none" aria-hidden>
      <path d="M0 18 Q15 2 30 15 T60 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconStack() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_11%,transparent)] text-[var(--accent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </div>
  )
}

function IconClock() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--warning)_14%,transparent)] text-[var(--warning)] ring-1 ring-[color-mix(in_srgb,var(--warning)_15%,transparent)]"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
}

function IconCheck() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)] ring-1 ring-[color-mix(in_srgb,var(--success)_15%,transparent)]"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
}

export function TaskStats({ total, pending, completed, addedThisWeek }: TaskStatsProps) {
  const cards = [
    {
      key: 'total',
      label: 'Total',
      value: total,
      colorClass: 'text-[var(--text-display)] dark:text-[var(--text)]',
      icon: <IconStack />,
      spark: <SparkTotal />,
      sub:
        addedThisWeek > 0 ? (
          <span className="text-[11px] font-medium text-[var(--success)]">(+{addedThisWeek} this week)</span>
        ) : null,
    },
    {
      key: 'pending',
      label: 'Pending',
      value: pending,
      colorClass: 'text-[var(--warning)]',
      icon: <IconClock />,
      spark: <SparkPending />,
      sub: null,
    },
    {
      key: 'completed',
      label: 'Completed',
      value: completed,
      colorClass: 'text-[var(--success)]',
      icon: <IconCheck />,
      spark: <SparkCompleted />,
      sub: null,
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3" role="region" aria-label="Task counts">
      {cards.map((c) => (
        <article
          key={c.key}
          className="flex items-center justify-between gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--border)_85%,var(--accent))] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-5 shadow-[var(--shadow-card)] backdrop-blur-md transition hover:shadow-[var(--shadow-lg)] dark:bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {c.icon}
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{c.label}</p>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className={`text-2xl font-bold tabular-nums leading-none tracking-tight ${c.colorClass}`}>
                  {c.value}
                </span>
                {c.sub}
              </div>
            </div>
          </div>
          {c.spark}
        </article>
      ))}
    </div>
  )
}
