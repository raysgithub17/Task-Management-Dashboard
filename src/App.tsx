import { DashboardBackdrop } from './components/DashboardBackdrop'
import { TaskDashboard } from './components/TaskDashboard'

function App() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <DashboardBackdrop />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-8 sm:px-8">
        <TaskDashboard />
      </div>
    </div>
  )
}

export default App
