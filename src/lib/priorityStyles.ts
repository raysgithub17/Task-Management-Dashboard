import type { Priority } from '../types/task'

export const priorityBadgeClass: Record<Priority, string> = {
  low: 'rounded bg-[color-mix(in_srgb,var(--priority-low)_18%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--priority-low)]',
  medium: 'rounded bg-[color-mix(in_srgb,var(--priority-med)_18%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--priority-med)]',
  high: 'rounded bg-[color-mix(in_srgb,var(--priority-high)_18%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--priority-high)]',
}
