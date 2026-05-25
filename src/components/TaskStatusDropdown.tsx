import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types/task'

type TaskStatusDropdownProps = Readonly<{
  task: Task
  onCompletedChange: (id: string, completed: boolean) => void
  /** 'list' = compact footer sizing; 'card' matches card badges */
  variant?: 'list' | 'card'
}>

/** Chevron for expanded state hint */
function Chevron({ expanded }: Readonly<{ expanded: boolean }>) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 opacity-70 transition-transform ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function TaskStatusDropdown({
  task,
  onCompletedChange,
  variant = 'list',
}: TaskStatusDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const done = task.completed

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const pillClass =
    variant === 'card'
      ? `inline-flex min-h-[1.625rem] items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
          done
            ? 'border-transparent bg-[var(--success-soft)] text-[var(--success)]'
            : 'border-[color-mix(in_srgb,var(--warning)_38%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--text)]'
        }`
      : `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
          done
            ? 'bg-[var(--success-soft)] text-[var(--success)]'
            : 'bg-[color-mix(in_srgb,var(--warning)_14%,transparent)] text-[var(--warning)]'
        }`

  return (
    <div className="relative" ref={wrapRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={`${pillClass} cursor-pointer outline-none ring-[var(--accent)] transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={done ? `Status: Completed. Change status.` : `Status: Pending. Change status.`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        {done ? 'Completed' : 'Pending'}
        <Chevron expanded={open} />
      </button>
      {open && (
        <ul
          className="absolute right-0 top-[calc(100%+6px)] z-[80] min-w-[10.5rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-lg)]"
          role="listbox"
          aria-label="Task status"
        >
          {!done ? (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="flex w-full items-center px-3 py-2.5 text-left text-[0.8125rem] font-medium text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
                onClick={(e) => {
                  e.stopPropagation()
                  onCompletedChange(task.id, true)
                  setOpen(false)
                }}
              >
                Mark completed
              </button>
            </li>
          ) : (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="flex w-full items-center px-3 py-2.5 text-left text-[0.8125rem] font-medium text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
                onClick={(e) => {
                  e.stopPropagation()
                  onCompletedChange(task.id, false)
                  setOpen(false)
                }}
              >
                Mark pending
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
