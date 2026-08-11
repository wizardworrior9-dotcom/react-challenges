import { useState, type Dispatch, type SetStateAction } from 'react'
import FilterBar, { type TaskFilter } from './FilterBar'
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
  showFilterBar = false,
  onDelete,
}: TaskAppProps) {
  const [filter, setFilter] = useState<TaskFilter>('all')

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

  const handleDelete = (id: string | number) => {
    if (onDelete) {
      onDelete(id)
      return
    }

    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id),
      )
      return
    }

    if (dispatch) {
      dispatch({
        type: 'DELETE_TASK',
        payload: id,
      })
    }
  }

  const filteredTasks =
    filter === 'active'
      ? tasks.filter((task) => !task.completed)
      : filter === 'completed'
        ? tasks.filter((task) => task.completed)
        : tasks

  const countText =
    showFilterBar
      ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
      : countFormat === 'completed'
        ? `${tasks.filter((task) => task.completed).length} of ${tasks.length} completed`
        : `${tasks.length} Tasks`

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
        />
      )}

      {showFilterBar && filteredTasks.length === 0 ? (
        <>
          <div id="task-count">{countText}</div>
          <div id="filter-empty-message">
            No tasks match this filter
          </div>
        </>
      ) : (
        <TaskList
          tasks={filteredTasks}
          countText={countText}
          onToggle={handleToggle}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )}
    </div>
  )
}