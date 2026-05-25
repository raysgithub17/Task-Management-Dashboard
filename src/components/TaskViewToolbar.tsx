import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PriorityFilter } from '../types/task'

type ViewMode = 'list' | 'card'

type PopoverMetrics = Readonly<{
  top: number
  left: number
  width: number
  maxHeight: number
}>

function computeFilterPopoverPosition(btn: HTMLElement): PopoverMetrics {
  const pad = 12
  const r = btn.getBoundingClientRect()
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const vTop = window.visualViewport?.offsetTop ?? 0
  const usableBottom = vTop + vh
  const maxW = Math.min(272, vw - pad * 2)
  const left = Math.min(Math.max(pad, r.right - maxW), vw - pad - maxW)
  const top = r.bottom + 8
  const maxHeight = Math.max(168, Math.min(420, usableBottom - top - pad))

  return { top, left, width: maxW, maxHeight }
}

type TaskViewToolbarProps = Readonly<{
  search: string
  onSearchChange: (v: string) => void
  priorityFilter: PriorityFilter
  onPriorityFilter: (v: PriorityFilter) => void
  viewMode: ViewMode
  onViewMode: (v: ViewMode) => void
  onCreateClick: () => void
  filterOpen: boolean
  onFilterOpenChange: (open: boolean) => void
  /** Merged onto the root toolbar row (Figma: full width on mobile). */
  className?: string
  /** Hide “Create task” (e.g. on Completed-only view). */
  showCreateTask?: boolean
}>

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 opacity-95">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function TaskViewToolbar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilter,
  viewMode,
  onViewMode,
  onCreateClick,
  filterOpen,
  onFilterOpenChange,
  className = '',
  showCreateTask = true,
}: TaskViewToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelPos, setPanelPos] = useState<PopoverMetrics | null>(null)

  const hasActiveFilters = priorityFilter !== 'all'

  useLayoutEffect(() => {
    if (!filterOpen) return

    const update = () => {
      const el = btnRef.current
      if (el) setPanelPos(computeFilterPopoverPosition(el))
    }

    let raf = 0
    raf = requestAnimationFrame(update)

    const vv = window.visualViewport
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(raf)
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [filterOpen])

  useEffect(() => {
    if (!filterOpen) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      onFilterOpenChange(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [filterOpen, onFilterOpenChange])

  const filterPanel =
    filterOpen && panelPos ?
      createPortal(
        <div
          ref={panelRef}
          id="filter-popover"
          role="dialog"
          aria-label="Filter tasks"
          aria-modal="true"
          className="overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3 shadow-[var(--shadow-lg)]"
          style={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            width: panelPos.width,
            maxHeight: panelPos.maxHeight,
            zIndex: 1700,
          }}
        >
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
                  className={`w-full rounded-xl px-3 py-2 text-left text-[0.8125rem] font-medium transition hover:bg-[var(--surface-elevated)] ${
                    priorityFilter === value ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}
                  onClick={() => {
                    onPriorityFilter(value)
                    onFilterOpenChange(false)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div
      className={`flex flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 ${className}`.trim()}
    >
      <div className="relative min-w-0 flex-1 sm:max-w-none sm:w-64">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          ref={searchRef}
          id="task-search"
          type="text"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--search-bg)] py-2 pl-10 pr-10 text-xs outline-none transition placeholder:text-[var(--text-muted)] placeholder:opacity-85 focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
          placeholder="Search title or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        {search ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
            aria-label="Clear search"
            onClick={() => {
              onSearchChange('')
              searchRef.current?.focus()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            aria-label={filterOpen ? 'Close filters' : 'Open filters'}
            aria-expanded={filterOpen}
            aria-haspopup="true"
            aria-controls="filter-popover"
            onClick={() => onFilterOpenChange(!filterOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-[var(--search-bg)] text-[var(--text-muted)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-[color-mix(in_srgb,var(--surface-elevated)_70%,transparent)] dark:hover:bg-[var(--surface-elevated)] ${
              filterOpen || hasActiveFilters
                ? 'border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--border)]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {hasActiveFilters ? <span className="sr-only">Filters active</span> : null}
          </button>
        </div>

        {filterPanel}

        <button
          type="button"
          title="List view"
          aria-pressed={viewMode === 'list'}
          aria-label="List view"
          onClick={() => onViewMode('list')}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-[var(--accent)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition ${
            viewMode === 'list'
              ? 'border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)]'
              : 'border-[var(--border)] bg-[var(--search-bg)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)]'
          }`}
        >
          <ListIcon active={viewMode === 'list'} />
        </button>

        <button
          type="button"
          title="Card view"
          aria-pressed={viewMode === 'card'}
          aria-label="Card view"
          onClick={() => onViewMode('card')}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition ${
            viewMode === 'card'
              ? 'border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'border-[var(--border)] bg-[var(--search-bg)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)]'
          }`}
        >
          <CardIcon active={viewMode === 'card'} />
        </button>

        {showCreateTask ?
          <button
            type="button"
            className="bg-cta-gradient inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-white shadow-sm transition"
            onClick={onCreateClick}
          >
            <PlusIcon />
            Create task
          </button>
        : null}
      </div>
    </div>
  )
}
