import type { Dispatch, SetStateAction } from 'react'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks = [],
  setTasks,
  dispatch,
  showForm = false,
  countFormat = 'tasks',
}: TaskAppProps) {
  const handleAddTask = (task: Task) => {
    if (setTasks) {
      setTasks((previousTasks) => [...previousTasks, task])
      return
    }

    if (dispatch) {
      dispatch({
        type: 'ADD_TASK',
        payload: task,
      })
    }
  }

  const handleToggle = (id: string | number) => {
    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed }
            : task,
        ),
      )
      return
    }

    if (dispatch) {
      dispatch({
        type: 'TOGGLE_TASK',
        payload: id,
      })
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length

  const countText =
    countFormat === 'completed'
      ? `${completedCount} of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      <TaskList
        tasks={tasks}
        countText={countText}
        onToggle={handleToggle}
      />
    </div>
  )
}