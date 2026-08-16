import {
  useCallback,
  useEffect,
  useMemo,
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
import TaskList, {
  type Task,
} from './TaskList'

import StatsPanel from './StatsPanel'
import ErrorBoundary from './ErrorBoundary'

import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TOGGLE_TASK,
  type TaskAction,
} from '../reducers/taskReducer'

interface TaskAppProps {
  tasks?: Task[]

  setTasks?: Dispatch<
    SetStateAction<Task[]>
  >

  dispatch?: (
    action: TaskAction,
  ) => void

  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean

  onDelete?: (
    id: string | number,
  ) => void

  linkToTaskDetail?: boolean
}

const PRIORITY_ORDER: Record<
  string,
  number
> = {
  High: 0,
  Medium: 1,
  Low: 2,
}

const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
]

function normalizeDueDate(
  value: unknown,
): string | undefined {
  if (
    typeof value !== 'string' ||
    !value
  ) {
    return undefined
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : undefined
}

function normalizeTask(
  task: Partial<Task>,
  index: number,
): Task {
  return {
    id:
      task.id ??
      `restored-${Date.now()}-${index}`,

    title: task.title ?? '',

    description:
      task.description ?? '',

    priority:
      task.priority ?? 'Medium',

    completed:
      task.completed === true,

    category:
      typeof task.category === 'string' &&
      task.category.trim()
        ? task.category.trim()
        : 'General',

    tags: Array.isArray(task.tags)
      ? [
          ...new Set(
            task.tags
              .filter(
                (tag): tag is string =>
                  typeof tag === 'string',
              )
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        ]
      : [],

    dueDate: normalizeDueDate(
      task.dueDate,
    ),
  }
}

export default function TaskApp({
  tasks = [],
  setTasks,
  dispatch,
  showForm = false,
  countFormat = 'tasks',
  showFilterBar = false,
  showStatsPanel = false,
  onDelete,
  linkToTaskDetail = false,
}: TaskAppProps) {
  const [filter, setFilter] =
    useState<TaskFilter>('all')

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('all')

  const [sortOrder, setSortOrder] =
    useState<TaskSort>('recent')

  const [rawSearch, setRawSearch] =
    useState('')

  const [
    effectiveSearch,
    setEffectiveSearch,
  ] = useState('')

  const [editingId, setEditingId] =
    useState<
      string | number | null
    >(null)

  const searchInputRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        setEffectiveSearch(rawSearch)
      }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [rawSearch])

  const categories = useMemo(
    () => [
      ...new Set(
        [
          ...DEFAULT_CATEGORIES,
          ...tasks.map(
            (task) =>
              task.category || 'General',
          ),
        ].filter(Boolean),
      ),
    ],
    [tasks],
  )

  const handleAddTask = useCallback(
    (task: Task) => {
      const normalizedTask =
        normalizeTask(
          task,
          tasks.length,
        )

      if (setTasks) {
        setTasks((previousTasks) => [
          ...previousTasks,
          normalizedTask,
        ])
        return
      }

      dispatch?.({
        type: ADD_TASK,
        payload: normalizedTask,
      })
    },
    [dispatch, setTasks, tasks.length],
  )

  const handleToggle = useCallback(
    (id: string | number) => {
      if (setTasks) {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed:
                    !task.completed,
                }
              : task,
          ),
        )
        return
      }

      dispatch?.({
        type: TOGGLE_TASK,
        payload: id,
      })
    },
    [dispatch, setTasks],
  )

  const handleDelete = useCallback(
    (id: string | number) => {
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
        type: DELETE_TASK,
        payload: id,
      })
    },
    [dispatch, setTasks, onDelete, editingId],
  )

  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: {
        title: string
        description: string
        priority: string
        category?: string
        tags?: string[]
        dueDate?: string
      },
    ) => {
      const title = updates.title.trim()

      if (!title) {
        return
      }

      const updatedTask = {
        title,
        description:
          updates.description.trim(),
        priority: updates.priority,
        category:
          updates.category?.trim() ||
          'General',
        tags: updates.tags ?? [],
        dueDate: normalizeDueDate(
          updates.dueDate,
        ),
      }

      if (setTasks) {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updatedTask,
                }
              : task,
          ),
        )

        setEditingId(null)
        return
      }

      dispatch?.({
        type: UPDATE_TASK,
        payload: {
          id,
          ...updatedTask,
        },
      })

      setEditingId(null)
    },
    [dispatch, setTasks],
  )

  const sortedTasks = useMemo(() => {
    const statusFilteredTasks =
      filter === 'active'
        ? tasks.filter(
            (task) => !task.completed,
          )
        : filter === 'completed'
          ? tasks.filter(
              (task) => task.completed,
            )
          : tasks

    const categoryFilteredTasks =
      categoryFilter === 'all'
        ? statusFilteredTasks
        : statusFilteredTasks.filter(
            (task) =>
              (task.category ||
                'General') ===
              categoryFilter,
          )

    const normalizedSearch =
      effectiveSearch
        .trim()
        .toLowerCase()

    const searchedTasks =
      normalizedSearch
        ? categoryFilteredTasks.filter(
            (task) =>
              task.title
                .toLowerCase()
                .includes(normalizedSearch) ||
              task.description
                .toLowerCase()
                .includes(normalizedSearch),
          )
        : categoryFilteredTasks

    return [
      ...searchedTasks,
    ].sort((a, b) => {
      switch (sortOrder) {
        case 'priority-high':
          return (
            (PRIORITY_ORDER[a.priority] ??
              99) -
            (PRIORITY_ORDER[b.priority] ??
              99)
          )

        case 'priority-low':
          return (
            (PRIORITY_ORDER[b.priority] ??
              99) -
            (PRIORITY_ORDER[a.priority] ??
              99)
          )

        case 'alphabetical':
          return a.title.localeCompare(
            b.title,
            undefined,
            {
              sensitivity: 'base',
            },
          )

        case 'due-date':
          if (!a.dueDate && !b.dueDate) {
            return 0
          }

          if (!a.dueDate) {
            return 1
          }

          if (!b.dueDate) {
            return -1
          }

          return a.dueDate.localeCompare(
            b.dueDate,
          )

        case 'recent':
        default:
          return 0
      }
    })
  }, [tasks, filter, categoryFilter, effectiveSearch, sortOrder])

  const countText =
    showFilterBar
      ? `Showing ${sortedTasks.length} of ${tasks.length} tasks`
      : countFormat === 'completed'
        ? `${
            tasks.filter(
              (task) => task.completed,
            ).length
          } of ${
            tasks.length
          } completed`
        : `${tasks.length} Tasks`

  const isSearching =
    rawSearch !== effectiveSearch

  const handleClearSearch = useCallback(() => {
    setRawSearch('')
    setEffectiveSearch('')

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }, [])

  const handleStartEdit = useCallback(
    (id: string | number) => {
      if (id === -1) {
        setEditingId(null)
        return
      }

      setEditingId(id)
    },
    [],
  )

  return (
    <div>
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
          categories={categories}
        />
      )}

      {showStatsPanel && (
        <StatsPanel tasks={tasks} />
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
            onClearSearch={
              handleClearSearch
            }
            searchInputRef={
              searchInputRef
            }
            categories={categories}
            categoryFilter={
              categoryFilter
            }
            onCategoryChange={
              setCategoryFilter
            }
          />

          {isSearching && (
            <div id="searching-indicator">
              Searching...
            </div>
          )}
        </>
      )}

      <ErrorBoundary>
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
            onUpdateTask={
              handleUpdateTask
            }
            editingId={editingId}
            onStartEdit={
              handleStartEdit
            }
            linkToTaskDetail={linkToTaskDetail}
          />
        )}
      </ErrorBoundary>
    </div>
  )
}