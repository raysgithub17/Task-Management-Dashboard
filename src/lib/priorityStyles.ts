import type { Priority } from '../types/task'

export const priorityBadgeClass: Record<Priority, string> = {
  low: 'bg-[color-mix(in_srgb,var(--priority-low)_22%,transparent)] text-[var(--priority-low)]',
  medium: 'bg-[color-mix(in_srgb,var(--priority-med)_20%,transparent)] text-[var(--priority-med)]',
  high: 'bg-[color-mix(in_srgb,var(--priority-high)_18%,transparent)] text-[var(--priority-high)]',
}
