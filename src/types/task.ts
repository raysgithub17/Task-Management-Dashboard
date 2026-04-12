export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: number
}

export type StatusFilter = 'all' | 'pending' | 'completed'
export type PriorityFilter = 'all' | Priority
