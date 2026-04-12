import type { Priority } from '../types/task'

export interface TaskFormValues {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

export function emptyFormValues(): TaskFormValues {
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  }
}
