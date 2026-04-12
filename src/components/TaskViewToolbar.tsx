import { useEffect, useRef } from 'react'
import type { PriorityFilter, StatusFilter } from '../types/task'

type ViewMode = 'list' | 'card'

interface TaskViewToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: StatusFilter
  onStatusFilter: (v: StatusFilter) => void
  priorityFilter: PriorityFilter
  onPriorityFilter: (v: PriorityFilter) => void
  viewMode: ViewMode
  onViewMode: (v: ViewMode) => void
  onCreateClick: () => void
  filterOpen: boolean
  onFilterOpenChange: (open: boolean) => void
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4h12M2 8h12M2 12h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={active ? 1 : 0.45}
      />
    </svg>
  )
}

function CardIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.45} />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.45} />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.45} />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.45} />
    </svg>
  )
}

export function TaskViewToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilter,
  priorityFilter,
  onPriorityFilter,
  viewMode,
  onViewMode,
  onCreateClick,
  filterOpen,
  onFilterOpenChange,
}: TaskViewToolbarProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all'

  useEffect(() => {
    if (!filterOpen) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onFilterOpenChange(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [filterOpen, onFilterOpenChange])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-[34px] min-w-[160px] flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 transition focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-soft)]">
        <span className="flex shrink-0 text-[var(--text-muted)]" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.25" />
            <path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </span>
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          type="search"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.8125rem] outline-none placeholder:text-[var(--text-muted)] placeholder:opacity-85"
          placeholder="Search title or description…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            className={`inline-flex h-[34px] items-center gap-1.5 rounded-md border bg-[var(--surface-elevated)] px-2.5 text-[0.8125rem] font-medium transition hover:border-[var(--border-strong)] hover:text-[var(--text)] ${
              filterOpen
                ? 'border-[var(--accent)] text-[var(--text)] ring-2 ring-[var(--accent-soft)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            } ${hasActiveFilters ? 'text-[var(--text)]' : ''}`}
            aria-expanded={filterOpen}
            aria-haspopup="true"
            aria-controls="filter-popover"
            onClick={() => onFilterOpenChange(!filterOpen)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 3.5h10M4.5 7h5M6 10.5h2"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
            Filter
            {hasActiveFilters && (
              <span className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
            )}
          </button>
          {filterOpen && (
            <div
              id="filter-popover"
              className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[220px] rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 shadow-[var(--shadow-lg)]"
              role="dialog"
              aria-label="Filter tasks"
            >
              <div className="px-2">
                <span className="block px-2 pb-1 pt-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Status
                </span>
                <div className="flex flex-col gap-0.5" role="group">
                  {(
                    [
                      ['all', 'All'],
                      ['pending', 'Pending'],
                      ['completed', 'Completed'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`w-full rounded-md px-2 py-1.5 text-left text-[0.8125rem] font-medium transition hover:bg-[var(--surface-elevated)] ${
                        statusFilter === value
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--text)]'
                      }`}
                      onClick={() => onStatusFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="my-2 h-px bg-[var(--border)]" />
              <div className="px-2">
                <span className="block px-2 pb-1 pt-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Priority
                </span>
                <div className="flex flex-col gap-0.5" role="group">
                  {(
                    [
                      ['all', 'All'],
                      ['low', 'Low'],
                      ['medium', 'Medium'],
                      ['high', 'High'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`w-full rounded-md px-2 py-1.5 text-left text-[0.8125rem] font-medium transition hover:bg-[var(--surface-elevated)] ${
                        priorityFilter === value
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--text)]'
                      }`}
                      onClick={() => onPriorityFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="inline-flex rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] p-0.5"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            className={`flex h-[30px] w-8 items-center justify-center rounded transition ${
              viewMode === 'list'
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            onClick={() => onViewMode('list')}
            title="List view"
            aria-pressed={viewMode === 'list'}
          >
            <ListIcon active={viewMode === 'list'} />
          </button>
          <button
            type="button"
            className={`flex h-[30px] w-8 items-center justify-center rounded transition ${
              viewMode === 'card'
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            onClick={() => onViewMode('card')}
            title="Card view"
            aria-pressed={viewMode === 'card'}
          >
            <CardIcon active={viewMode === 'card'} />
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-[34px] items-center justify-center rounded-md bg-[var(--accent)] px-3.5 text-[0.8125rem] font-semibold tracking-tight text-white transition hover:bg-[var(--accent-hover)] active:scale-[0.98]"
          onClick={onCreateClick}
        >
          Create task
        </button>
      </div>
    </div>
  )
}
