import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
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

const STORAGE_KEY = 'task-app-tasks'

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

  /*
   * Challenge 09:
   * rawSearch is updated immediately as the user types.
   */
  const [rawSearch, setRawSearch] = useState('')

  /*
   * Challenge 11:
   * effectiveSearch is the debounced value used for filtering.
   */
  const [effectiveSearch, setEffectiveSearch] = useState('')

  const [editingId, setEditingId] = useState<
    string | number | null
  >(null)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const hasLoadedStorage = useRef(false)

  /*
   * Challenge 10:
   * Load tasks from localStorage when the component mounts.
   */
  useEffect(() => {
    if (!setTasks) {
      hasLoadedStorage.current = true
      return
    }

    try {
      const storedTasks =
        window.localStorage.getItem(STORAGE_KEY)

      if (storedTasks) {
        const parsedTasks: unknown = JSON.parse(storedTasks)

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks as Task[])
        }
      }
    } catch {
      // Invalid localStorage data is ignored.
    } finally {
      hasLoadedStorage.current = true
    }
  }, [setTasks])

  /*
   * Challenge 10:
   * Save whenever tasks change.
   */
  useEffect(() => {
    if (!setTasks || !hasLoadedStorage.current) {
      return
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks),
      )
    } catch {
      // Storage failures should not crash the application.
    }
  }, [tasks, setTasks])

  /*
   * Challenge 11:
   * Debounce search by 300ms.
   *
   * Every time rawSearch changes:
   * 1. Start a new timeout.
   * 2. After 300ms, update effectiveSearch.
   * 3. Cleanup clears the previous timeout.
   */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setEffectiveSearch(rawSearch)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [rawSearch])

  /*
   * Searching is active while the raw input and effective
   * search value are different.
   */
  const isSearching =
    rawSearch !== effectiveSearch

  const handleAddTask = (task: Task) => {
    if (setTasks) {
      setTasks((previousTasks) => [
        ...previousTasks,
        task,
      ])
      return
    }

    dispatch?.({
      type: 'ADD_TASK',
      payload: task,
    })
  }

  const handleToggle = (id: string | number) => {
    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task,
        ),
      )
      return
    }

    dispatch?.({
      type: 'TOGGLE_TASK',
      payload: id,
    })
  }

  const handleDelete = (id: string | number) => {
    if (onDelete) {
      onDelete(id)
      return
    }

    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== id,
        ),
      )

      if (editingId === id) {
        setEditingId(null)
      }

      return
    }

    dispatch?.({
      type: 'DELETE_TASK',
      payload: id,
    })
  }

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    },
  ) => {
    const title = updates.title.trim()

    if (!title) {
      return
    }

    const updatedFields = {
      title,
      description: updates.description.trim(),
      priority: updates.priority,
    }

    if (setTasks) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                ...updatedFields,
              }
            : task,
        ),
      )

      setEditingId(null)
      return
    }

    dispatch?.({
      type: 'UPDATE_TASK',
      payload: {
        id,
        ...updatedFields,
      },
    })

    setEditingId(null)
  }

  /*
   * Challenge 06:
   * First filter by status.
   */
  const statusFilteredTasks =
    filter === 'active'
      ? tasks.filter((task) => !task.completed)
      : filter === 'completed'
        ? tasks.filter((task) => task.completed)
        : tasks

  /*
   * Challenge 11:
   * Search using ONLY effectiveSearch.
   *
   * rawSearch is deliberately not used here.
   */
  const normalizedSearch =
    effectiveSearch.trim().toLowerCase()

  const searchedTasks = normalizedSearch
    ? statusFilteredTasks.filter((task) => {
        const title = task.title.toLowerCase()
        const description =
          task.description.toLowerCase()

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        )
      })
    : statusFilteredTasks

  /*
   * Challenge 07:
   * Sort after filtering and searching.
   */
  const sortedTasks = [...searchedTasks].sort(
    (a, b) => {
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
          return a.title.localeCompare(
            b.title,
            undefined,
            {
              sensitivity: 'base',
            },
          )

        case 'recent':
        default:
          return 0
      }
    },
  )

  const countText = showFilterBar
    ? `Showing ${sortedTasks.length} of ${tasks.length} tasks`
    : countFormat === 'completed'
      ? `${
          tasks.filter(
            (task) => task.completed,
          ).length
        } of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  const handleClearSearch = () => {
    setRawSearch('')
    setEffectiveSearch('')

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const handleStartEdit = (
    id: string | number,
  ) => {
    if (id === -1) {
      setEditingId(null)
      return
    }

    setEditingId(id)
  }

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {showFilterBar && (
        <>
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            searchText={rawSearch}
            onSearchChange={setRawSearch}
            onClearSearch={handleClearSearch}
            searchInputRef={searchInputRef}
          />

          {isSearching && (
            <div id="searching-indicator">
              Searching...
            </div>
          )}
        </>
      )}

      {showFilterBar &&
      sortedTasks.length === 0 ? (
        <>
          <div id="task-count">
            {countText}
          </div>

          <div id="filter-empty-message">
            {normalizedSearch
              ? `No tasks found for "${effectiveSearch.trim()}"`
              : 'No tasks match this filter'}
          </div>
        </>
      ) : (
        <TaskList
          tasks={sortedTasks}
          countText={countText}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          onStartEdit={handleStartEdit}
          linkToTaskDetail={false}
        />
      )}
    </div>
  )
}