import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import FilterBar, {
  type TaskFilter,
  type TaskSort,
} from './FilterBar'
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

const PRIORITY_ORDER: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
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
  const [sortOrder, setSortOrder] = useState<TaskSort>('recent')
  const [searchText, setSearchText] = useState('')
  const [editingId, setEditingId] = useState<
    string | number | null
  >(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

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

      if (editingId === id) {
        setEditingId(null)
      }

      return
    }

    if (dispatch) {
      dispatch({
        type: 'DELETE_TASK',
        payload: id,
      })
    }
  }

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    },
  ) => {
    const trimmedTitle = updates.title.trim()

    if (!trimmedTitle) {
      return
    }

    const updatedTask = {
      ...updates,
      title: trimmedTitle,
      description: updates.description.trim(),
    }

    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? { ...task, ...updatedTask }
            : task,
        ),
      )

      setEditingId(null)
      return
    }

    if (dispatch) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id,
          ...updatedTask,
        },
      })

      setEditingId(null)
    }
  }

  // 1. Filter by status.
  const statusFilteredTasks =
    filter === 'active'
      ? tasks.filter((task) => !task.completed)
      : filter === 'completed'
        ? tasks.filter((task) => task.completed)
        : tasks

  // 2. Search the status-filtered tasks.
  const normalizedSearch = searchText.trim().toLowerCase()

  const searchedTasks = normalizedSearch
    ? statusFilteredTasks.filter((task) => {
        const title = task.title.toLowerCase()
        const description = task.description.toLowerCase()

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        )
      })
    : statusFilteredTasks

  // 3. Sort the searched result.
  const sortedTasks = [...searchedTasks].sort((a, b) => {
    switch (sortOrder) {
      case 'priority-high':
        return (
          (PRIORITY_ORDER[a.priority] ?? 99) -
          (PRIORITY_ORDER[b.priority] ?? 99)
        )

      case 'priority-low':
        return (
          (PRIORITY_ORDER[b.priority] ?? 99) -
          (PRIORITY_ORDER[a.priority] ?? 99)
        )

      case 'alphabetical':
        return a.title.localeCompare(b.title, undefined, {
          sensitivity: 'base',
        })

      case 'recent':
      default:
        return 0
    }
  })

  const countText = showFilterBar
    ? `Showing ${sortedTasks.length} of ${tasks.length} tasks`
    : countFormat === 'completed'
      ? `${tasks.filter((task) => task.completed).length} of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  const handleClearSearch = () => {
    setSearchText('')

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchText={searchText}
          onSearchChange={setSearchText}
          onClearSearch={handleClearSearch}
        />
      )}

      {showFilterBar && sortedTasks.length === 0 ? (
        <>
          <div id="task-count">{countText}</div>

          <div id="filter-empty-message">
            {normalizedSearch
              ? `No tasks found for "${searchText.trim()}"`
              : 'No tasks match this filter'}
          </div>
        </>
      ) : (
        <TaskList
          tasks={sortedTasks}
          countText={countText}
          onToggle={handleToggle}
          onDelete={onDelete ? handleDelete : undefined}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          onStartEdit={(id) => {
            if (id === -1) {
              setEditingId(null)
            } else {
              setEditingId(id)
            }
          }}
          linkToTaskDetail={false}
        />
      )}
    </div>
  )
}