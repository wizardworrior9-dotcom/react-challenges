import { useMemo } from 'react'
import type { Task } from './TaskList'

interface StatsPanelProps {
  tasks?: Task[]
  total?: number
  completed?: number
  active?: number
  overdue?: number
}

function isOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) {
    return false
  }

  const [year, month, day] = task.dueDate
    .split('-')
    .map(Number)

  const dueDate = new Date(year, month - 1, day)

  const today = new Date()
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  return dueDate < todayOnly
}

export default function StatsPanel({
  tasks,
  total,
  completed,
  active,
  overdue,
}: StatsPanelProps) {
  const stats = useMemo(() => {
    if (tasks) {
      const totalTasks = tasks.length

      const completedTasks = tasks.filter(
        (task) => task.completed,
      ).length

      const activeTasks = tasks.filter(
        (task) => !task.completed,
      ).length

      const overdueTasks = tasks.filter(
        (task) => isOverdue(task),
      ).length

      const percentage =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks / totalTasks) * 100,
            )

      const categories: Record<string, number> = {}
      const priorities: Record<string, number> = {}

      tasks.forEach((task) => {
        const category = task.category || 'General'
        const priority = task.priority || 'Medium'

        categories[category] =
          (categories[category] || 0) + 1

        priorities[priority] =
          (priorities[priority] || 0) + 1
      })

      return {
        total: totalTasks,
        completed: completedTasks,
        active: activeTasks,
        overdue: overdueTasks,
        percentage,
        categories,
        priorities,
      }
    }

    const safeTotal = total ?? 0
    const safeCompleted = completed ?? 0
    const safeActive = active ?? 0
    const safeOverdue = overdue ?? 0

    return {
      total: safeTotal,
      completed: safeCompleted,
      active: safeActive,
      overdue: safeOverdue,
      percentage:
        safeTotal === 0
          ? 0
          : Math.round(
              (safeCompleted / safeTotal) * 100,
            ),
      categories: {},
      priorities: {},
    }
  }, [
    tasks,
    total,
    completed,
    active,
    overdue,
  ])

  return (
    <section id="stats-panel">
      <h2>Task Statistics</h2>

      <div>
        <strong>Total Tasks</strong>
        <span>{stats.total}</span>
      </div>

      <div>
        <strong>Completed</strong>
        <span>
          {stats.completed} ({stats.percentage}%)
        </span>
      </div>

      <div>
        <strong>Active</strong>
        <span>{stats.active}</span>
      </div>

      <div>
        <strong>Overdue</strong>
        <span>{stats.overdue}</span>
      </div>

      <div
        role="progressbar"
        aria-label="Task completion progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={stats.percentage}
      >
        <div
          style={{
            width: `${stats.percentage}%`,
            height: '12px',
          }}
        />
      </div>

      <p>{stats.percentage}% complete</p>

      {Object.keys(stats.categories).length > 0 && (
        <div id="category-breakdown">
          <h3>By Category</h3>

          {Object.entries(stats.categories).map(
            ([category, count]) => (
              <div key={category}>
                <span>{category}</span>
                <span>{count}</span>
              </div>
            ),
          )}
        </div>
      )}

      {Object.keys(stats.priorities).length > 0 && (
        <div id="priority-breakdown">
          <h3>By Priority</h3>

          {Object.entries(stats.priorities).map(
            ([priority, count]) => (
              <div key={priority}>
                <span>{priority}</span>
                <span>{count}</span>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  )
}