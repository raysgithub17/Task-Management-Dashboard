import { useEffect, useMemo, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useTheme } from '../hooks/useTheme'
import type { PriorityFilter, Task } from '../types/task'
import { emptyFormValues, type TaskFormValues } from '../lib/taskFormDefaults'
import { CreateTaskModal } from './CreateTaskModal'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { EditTaskModal } from './EditTaskModal'
import { TaskDetailsModal } from './TaskDetailsModal'
import { TaskCard } from './TaskCard'
import { TaskListItem } from './TaskListItem'
import { TaskStats } from './TaskStats'
import { TaskAiInsightsPanel } from './TaskAiInsightsPanel'
import { TaskViewToolbar } from './TaskViewToolbar'

type ViewMode = 'list' | 'card'
type MainNav = 'dashboard' | 'completed'

function filterBySearchAndPriority(
  pool: Task[],
  search: string,
  priority: PriorityFilter,
): Task[] {
  const q = search.trim().toLowerCase()
  return pool.filter((t) => {
    if (priority !== 'all' && t.priority !== priority) return false
    if (q) {
      const inTitle = t.title.toLowerCase().includes(q)
      const inDesc = t.description.toLowerCase().includes(q)
      if (!inTitle && !inDesc) return false
    }
    return true
  })
}

function navButtonClass(active: boolean): string {
  return [
    'flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition',
    active
      ? 'border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]'
      : 'border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text)]',
  ].join(' ')
}

function navTabMobileClass(active: boolean): string {
  return [
    'flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition sm:text-sm',
    active
      ? 'border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]'
      : 'border-[var(--border)] bg-[var(--search-bg)] text-[var(--text-muted)] hover:text-[var(--text)]',
  ].join(' ')
}

export function TaskDashboard() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const { theme, toggleTheme } = useTheme()

  const [mainNav, setMainNav] = useState<MainNav>('dashboard')
  const [createOpen, setCreateOpen] = useState(false)
  const [createValues, setCreateValues] = useState<TaskFormValues>(() => {
    const v = emptyFormValues()
    const today = new Date().toISOString().slice(0, 10)
    return { ...v, dueDate: today }
  })

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const [editing, setEditing] = useState<Task | null>(null)
  const [editValues, setEditValues] = useState<TaskFormValues>(() => emptyFormValues())
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [detailsTask, setDetailsTask] = useState<Task | null>(null)

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks])
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks])

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

  const filtered = useMemo(() => {
    const pool =
      mainNav === 'dashboard' ? tasks.filter((t) => !t.completed) : tasks.filter((t) => t.completed)
    return filterBySearchAndPriority(pool, search, priorityFilter)
  }, [mainNav, tasks, search, priorityFilter])

  const poolTotal = mainNav === 'dashboard' ? activeCount : completedCount

  const detailTaskResolved = useMemo(() => {
    if (!detailsTask) return null
    return tasks.find((t) => t.id === detailsTask.id) ?? null
  }, [detailsTask, tasks])

  const addedThisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000
    return tasks.filter((t) => t.createdAt >= cutoff).length
  }, [tasks])

  const total = tasks.length
  const pending = activeCount
  const completed = completedCount

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

  const setTaskCompleted = (id: string, completed: boolean) => {
    updateTask(id, { completed })
  }

  const confirmDelete = () => {
    if (deleting) {
      deleteTask(deleting.id)
      setDeleting(null)
    }
  }

  useEffect(() => {
    if (detailsTask && !tasks.some((t) => t.id === detailsTask.id)) {
      setDetailsTask(null)
    }
  }, [detailsTask, tasks])

  useEffect(() => {
    if (!createOpen && !editing && !deleting && !filterMenuOpen && !detailTaskResolved) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setEditing(null)
      setDeleting(null)
      setCreateOpen(false)
      setFilterMenuOpen(false)
      setDetailsTask(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [createOpen, editing, deleting, filterMenuOpen, detailTaskResolved])

  const sectionTitle = mainNav === 'dashboard' ? 'Inbox' : 'Completed tasks'
  const insightsTasks = mainNav === 'dashboard' ? tasks.filter((t) => !t.completed) : tasks

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-[5] flex gap-2 border-b border-[var(--border)] bg-[var(--bg)] pb-4 pt-0.5 lg:hidden"
      >
        <button
          type="button"
          className={navTabMobileClass(mainNav === 'dashboard')}
          onClick={() => setMainNav('dashboard')}
        >
          Dashboard
          <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums text-[var(--accent)] sm:px-2 sm:text-xs">
            {activeCount}
          </span>
        </button>
        <button
          type="button"
          className={navTabMobileClass(mainNav === 'completed')}
          onClick={() => setMainNav('completed')}
        >
          Completed
          <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums text-[var(--accent)] sm:px-2 sm:text-xs">
            {completedCount}
          </span>
        </button>
      </nav>

      <aside
        aria-label="Main navigation"
        className="hidden w-52 shrink-0 border-r border-[var(--border)] pr-8 lg:block"
      >
        <nav className="sticky top-8 space-y-1.5">
          <button
            type="button"
            className={navButtonClass(mainNav === 'dashboard')}
            onClick={() => setMainNav('dashboard')}
          >
            Dashboard
            <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 text-xs font-bold tabular-nums text-[var(--accent)]">
              {activeCount}
            </span>
          </button>
          <button
            type="button"
            className={navButtonClass(mainNav === 'completed')}
            onClick={() => setMainNav('completed')}
          >
            Completed tasks
            <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 text-xs font-bold tabular-nums text-[var(--accent)]">
              {completedCount}
            </span>
          </button>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-8">
        <header className="flex flex-col gap-4 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Overview</p>
            <h1 className="font-display-heading text-4xl text-[var(--text-display)]">Tasks</h1>
            <p className="max-w-lg text-sm font-medium leading-snug text-[var(--text-muted)]">
              Plan work, hit deadlines, and keep priorities visible at a glance.
            </p>
          </div>
          <button
            type="button"
            className={
              theme === 'dark'
                ? 'inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-elevated)] sm:self-auto'
                : 'inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-[var(--theme-toggle-bg)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--theme-toggle-hover)] sm:self-auto'
            }
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            {theme === 'dark' ? (
              <svg className="h-3.5 w-3.5 text-[var(--warning)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm9.657-5.657l-.707-.707a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414-1.414zm-12.687 12.687l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </header>

        <TaskStats total={total} pending={pending} completed={completed} addedThisWeek={addedThisWeek} />

        {mainNav === 'dashboard' && <TaskAiInsightsPanel tasks={insightsTasks} />}

        <section
          className="flex min-h-[300px] flex-col space-y-6 overflow-visible rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.01)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]"
          aria-labelledby="tasks-heading"
        >
          <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex shrink-0 items-center gap-2.5">
              <h2 id="tasks-heading" className="text-xl font-bold text-[var(--text)]">
                {sectionTitle}
              </h2>
              <span className="inline-flex min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold tabular-nums text-[var(--accent)]">
                {poolTotal}
                {filtered.length !== poolTotal ? (
                  <span className="ml-1 font-semibold opacity-65" title="Matching current filters">
                    ({filtered.length})
                  </span>
                ) : null}
              </span>
            </div>
            <TaskViewToolbar
              className="w-full sm:w-auto"
              search={search}
              onSearchChange={setSearch}
              priorityFilter={priorityFilter}
              onPriorityFilter={setPriorityFilter}
              viewMode={viewMode}
              onViewMode={setViewMode}
              onCreateClick={openCreate}
              filterOpen={filterMenuOpen}
              onFilterOpenChange={setFilterMenuOpen}
              showCreateTask={mainNav === 'dashboard'}
            />
          </div>

          <div className="min-h-0 flex-1">
            {filtered.length === 0 ? (
              <div className="mx-0.5 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--border)_92%,var(--accent))] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-6 py-12 text-center text-[var(--text-muted)]">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"
                  aria-hidden
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                    <path strokeLinecap="round" d="M9 12h6M9 16h6" opacity="0.45" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="mb-3 text-[0.9375rem] leading-relaxed text-[var(--text)]">
                  {tasks.length === 0
                    ? 'No tasks yet. Create one to get started.'
                    : mainNav === 'dashboard'
                      ? poolTotal === 0
                        ? 'No active tasks. Mark items complete from here when you finish them—they will appear under Completed.'
                        : 'No active tasks match your filters.'
                      : poolTotal === 0
                        ? 'Nothing completed yet. Use the status menu on any task (Pending ▾ → Mark completed) to move finished work here.'
                        : 'No completed tasks match your filters.'}
                </p>
                {tasks.length > 0 && (search || priorityFilter !== 'all') && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--surface)] px-5 py-2 text-sm font-semibold text-[var(--accent)] shadow-[var(--shadow)] ring-1 ring-[var(--border)] transition hover:bg-[var(--accent-soft)]"
                    onClick={() => {
                      setSearch('')
                      setPriorityFilter('all')
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : viewMode === 'list' ? (
              <ul className="flex list-none flex-col gap-4 p-0">
                {filtered.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onCompletedChange={setTaskCompleted}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                    onOpenDetails={setDetailsTask}
                  />
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3">
                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onCompletedChange={setTaskCompleted}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                    onOpenDetails={setDetailsTask}
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
        <TaskDetailsModal
          task={detailTaskResolved}
          onClose={() => setDetailsTask(null)}
          onEdit={openEdit}
          onCompletedChange={setTaskCompleted}
        />
      </div>
    </div>
  )
}
