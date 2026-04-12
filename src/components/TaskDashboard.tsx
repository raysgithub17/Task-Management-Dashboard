import { useEffect, useMemo, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useTheme } from '../hooks/useTheme'
import type { PriorityFilter, StatusFilter, Task } from '../types/task'
import { emptyFormValues, type TaskFormValues } from '../lib/taskFormDefaults'
import { CreateTaskModal } from './CreateTaskModal'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { EditTaskModal } from './EditTaskModal'
import { TaskCard } from './TaskCard'
import { TaskListItem } from './TaskListItem'
import { TaskStats } from './TaskStats'
import { TaskViewToolbar } from './TaskViewToolbar'

type ViewMode = 'list' | 'card'

function filterTasks(
  tasks: Task[],
  search: string,
  status: StatusFilter,
  priority: PriorityFilter,
): Task[] {
  const q = search.trim().toLowerCase()
  return tasks.filter((t) => {
    if (status === 'pending' && t.completed) return false
    if (status === 'completed' && !t.completed) return false
    if (priority !== 'all' && t.priority !== priority) return false
    if (q) {
      const inTitle = t.title.toLowerCase().includes(q)
      const inDesc = t.description.toLowerCase().includes(q)
      if (!inTitle && !inDesc) return false
    }
    return true
  })
}

export function TaskDashboard() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks()
  const { theme, toggleTheme } = useTheme()

  const [createOpen, setCreateOpen] = useState(false)
  const [createValues, setCreateValues] = useState<TaskFormValues>(() => {
    const v = emptyFormValues()
    const today = new Date().toISOString().slice(0, 10)
    return { ...v, dueDate: today }
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const [editing, setEditing] = useState<Task | null>(null)
  const [editValues, setEditValues] = useState<TaskFormValues>(() => emptyFormValues())
  const [deleting, setDeleting] = useState<Task | null>(null)

  const openEdit = (task: Task) => {
    setEditing(task)
    setEditValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    })
  }

  const openCreate = () => {
    const today = new Date().toISOString().slice(0, 10)
    setCreateValues({ ...emptyFormValues(), dueDate: today })
    setCreateOpen(true)
  }

  const filtered = useMemo(
    () => filterTasks(tasks, search, statusFilter, priorityFilter),
    [tasks, search, statusFilter, priorityFilter],
  )

  const total = tasks.length
  const pending = tasks.filter((t) => !t.completed).length
  const completed = tasks.filter((t) => t.completed).length

  const handleCreate = () => {
    if (!createValues.title.trim() || !createValues.dueDate) return
    addTask({
      title: createValues.title.trim(),
      description: createValues.description.trim(),
      priority: createValues.priority,
      dueDate: createValues.dueDate,
    })
  }

  const saveEdit = () => {
    if (!editing) return
    updateTask(editing.id, {
      title: editValues.title.trim(),
      description: editValues.description.trim(),
      priority: editValues.priority,
      dueDate: editValues.dueDate,
    })
  }

  const confirmDelete = () => {
    if (deleting) {
      deleteTask(deleting.id)
      setDeleting(null)
    }
  }

  useEffect(() => {
    if (!createOpen && !editing && !deleting && !filterMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setEditing(null)
      setDeleting(null)
      setCreateOpen(false)
      setFilterMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [createOpen, editing, deleting, filterMenuOpen])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pt-0.5 pb-1">
        <span className="text-[0.8125rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Tasks
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[0.8125rem] font-medium text-[var(--text)] shadow-[var(--shadow)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="text-[var(--text-muted)]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          <span className="text-[0.95rem] leading-none opacity-85" aria-hidden>
            {theme === 'dark' ? '☀' : '☾'}
          </span>
        </button>
      </div>

      <TaskStats total={total} pending={pending} completed={completed} />

      <section
        className="flex min-h-[280px] flex-col overflow-visible rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
        aria-labelledby="tasks-heading"
      >
        <div className="relative z-[5] border-b border-[var(--border)] bg-[var(--surface)] px-[1.1rem] pb-3.5 pt-4">
          <div className="mb-3.5 flex items-baseline gap-2">
            <h1 id="tasks-heading" className="text-lg font-semibold tracking-tight text-[var(--text)]">
              Inbox
            </h1>
            <span className="text-[0.8125rem] font-medium tabular-nums text-[var(--text-muted)]">
              {filtered.length}
              {total !== filtered.length && (
                <span className="opacity-75"> / {total}</span>
              )}
            </span>
          </div>
          <TaskViewToolbar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilter={setPriorityFilter}
            viewMode={viewMode}
            onViewMode={setViewMode}
            onCreateClick={openCreate}
            filterOpen={filterMenuOpen}
            onFilterOpenChange={setFilterMenuOpen}
          />
        </div>

        <div className="relative z-[1] flex-1 bg-[var(--bg)] p-2.5">
          {filtered.length === 0 ? (
            <div className="mx-1 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-10 text-center text-[var(--text-muted)]">
              <p className="mb-3">
                {tasks.length === 0
                  ? 'No tasks yet. Create one to get started.'
                  : 'No tasks match your filters.'}
              </p>
              {tasks.length > 0 &&
                (search || statusFilter !== 'all' || priorityFilter !== 'all') && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('all')
                      setPriorityFilter('all')
                    }}
                  >
                    Clear filters
                  </button>
                )}
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-1" role="list">
              {filtered.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2.5">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CreateTaskModal
        open={createOpen}
        values={createValues}
        onValuesChange={setCreateValues}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <EditTaskModal
        task={editing}
        values={editValues}
        onValuesChange={setEditValues}
        onClose={() => setEditing(null)}
        onSave={saveEdit}
      />
      <DeleteConfirmDialog
        task={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
