import { useCallback, useEffect, useState } from 'react'
import type { Task } from '../types/task'

const STORAGE_KEY = 'task-dashboard-tasks-v1'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTask)
  } catch {
    return []
  }
}

function isValidTask(x: unknown): x is Task {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    (o.priority === 'low' || o.priority === 'medium' || o.priority === 'high') &&
    typeof o.dueDate === 'string' &&
    typeof o.completed === 'boolean' &&
    typeof o.createdAt === 'number'
  )
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((input: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  return { tasks, addTask, updateTask, deleteTask, toggleComplete }
}
