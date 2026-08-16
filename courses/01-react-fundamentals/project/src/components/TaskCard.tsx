import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'

interface TaskCardProps {
  taskId?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string

  onToggle?: (
    id: string | number,
  ) => void

  onDelete?: (
    id: string | number,
  ) => void

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category?: string
      tags?: string[]
      dueDate?: string
    },
  ) => void

  editingId?: string | number | null

  onStartEdit?: (
    id: string | number,
  ) => void

  linkToTaskDetail?: boolean
}

function getDueStatus(
  dueDate?: string,
  completed = false,
) {
  if (!dueDate || completed) {
    return null
  }

  const [year, month, day] =
    dueDate.split('-').map(Number)

  const due = new Date(
    year,
    month - 1,
    day,
  )

  const today = new Date()

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  const difference = Math.round(
    (due.getTime() -
      todayOnly.getTime()) /
      (1000 * 60 * 60 * 24),
  )

  if (difference < 0) {
    return 'overdue' as const
  }

  if (difference === 0) {
    return 'due-today' as const
  }

  if (difference <= 3) {
    return 'due-soon' as const
  }

  return null
}

function TaskCard({
  taskId,
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onStartEdit,
  linkToTaskDetail = false,
}: TaskCardProps) {
  const isEditing =
    editingId !== null &&
    editingId !== undefined &&
    editingId === taskId

  const [editTitle, setEditTitle] =
    useState(title)

  const [
    editDescription,
    setEditDescription,
  ] = useState(description)

  const [editPriority, setEditPriority] =
    useState(priority)

  const [editCategory, setEditCategory] =
    useState(category)

  const [editTags, setEditTags] =
    useState(tags.join(', '))

  const [editDueDate, setEditDueDate] =
    useState(dueDate ?? '')

  const [editError, setEditError] =
    useState('')

  useEffect(() => {
    if (isEditing) {
      setEditTitle(title)
      setEditDescription(description)
      setEditPriority(priority)
      setEditCategory(category)
      setEditTags(tags.join(', '))
      setEditDueDate(dueDate ?? '')
      setEditError('')
    }
  }, [
    isEditing,
    title,
    description,
    priority,
    category,
    tags,
    dueDate,
  ])

  const handleSave = () => {
    if (!editTitle.trim()) {
      setEditError('Title is required')
      return
    }

    if (
      onUpdateTask &&
      taskId !== undefined
    ) {
      const parsedTags = [
        ...new Set(
          editTags
            .split(',')
            .map((tag) =>
              tag.trim(),
            )
            .filter(Boolean),
        ),
      ]

      onUpdateTask(taskId, {
        title: editTitle.trim(),
        description:
          editDescription.trim(),
        priority: editPriority,
        category:
          editCategory.trim() ||
          'General',
        tags: parsedTags,
        dueDate:
          editDueDate || undefined,
      })
    }
  }

  const handleDelete = () => {
    if (
      !onDelete ||
      taskId === undefined
    ) {
      return
    }

    if (
      window.confirm('Are you sure?')
    ) {
      onDelete(taskId)
    }
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(dueDate ?? '')
    setEditError('')
    onStartEdit?.(-1)
  }

  const dueStatus = getDueStatus(
    dueDate,
    completed,
  )

  return (
    <article
      id="task-card"
      data-completed={
        completed
          ? 'true'
          : 'false'
      }
      data-overdue={
        dueStatus === 'overdue'
          ? 'true'
          : 'false'
      }
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {
            if (
              taskId !== undefined
            ) {
              onToggle(taskId)
            }
          }}
        />
      )}

      {isEditing ? (
        <div>
          <label htmlFor={`edit-title-${taskId}`}>
            Title
          </label>

          <input
            id={`edit-title-${taskId}`}
            value={editTitle}
            onChange={(event) => {
              setEditTitle(
                event.target.value,
              )
              setEditError('')
            }}
          />

          <label
            htmlFor={`edit-description-${taskId}`}
          >
            Description
          </label>

          <textarea
            id={`edit-description-${taskId}`}
            value={editDescription}
            onChange={(event) =>
              setEditDescription(
                event.target.value,
              )
            }
          />

          <label
            htmlFor={`edit-priority-${taskId}`}
          >
            Priority
          </label>

          <select
            id={`edit-priority-${taskId}`}
            value={editPriority}
            onChange={(event) =>
              setEditPriority(
                event.target.value,
              )
            }
          >
            <option value="Low">
              Low
            </option>
            <option value="Medium">
              Medium
            </option>
            <option value="High">
              High
            </option>
          </select>

          <label
            htmlFor={`edit-category-${taskId}`}
          >
            Category
          </label>

          <input
            id={`edit-category-${taskId}`}
            value={editCategory}
            onChange={(event) =>
              setEditCategory(
                event.target.value,
              )
            }
          />

          <label
            htmlFor={`edit-tags-${taskId}`}
          >
            Tags
          </label>

          <input
            id={`edit-tags-${taskId}`}
            value={editTags}
            onChange={(event) =>
              setEditTags(
                event.target.value,
              )
            }
          />

          <label
            htmlFor={`edit-due-date-${taskId}`}
          >
            Due Date
          </label>

          <input
            id={`edit-due-date-${taskId}`}
            type="date"
            value={editDueDate}
            onChange={(event) =>
              setEditDueDate(
                event.target.value,
              )
            }
          />

          {editError && (
            <div
              id="task-edit-error"
              role="alert"
            >
              {editError}
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
          >
            Save
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <h2
            style={{
              textDecoration:
                completed
                  ? 'line-through'
                  : 'none',
            }}
          >
            {linkToTaskDetail && taskId !== undefined ? (
              <Link
                to={`/challenge/21-react-router/task/${taskId}`}
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          <p
            style={{
              textDecoration:
                completed
                  ? 'line-through'
                  : 'none',
            }}
          >
            {description}
          </p>

          <div>
            Priority:{' '}
            <Badge variant="priority">
              {priority}
            </Badge>
          </div>

          <div id="task-category">
            Category:{' '}
            <Badge variant="category">
              {category}
            </Badge>
          </div>

          <div id="task-tags">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="tag"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {completed && (
            <StatusIndicator
              status="completed"
            />
          )}

          {dueDate && (
            <div
              id="task-due-date"
              data-overdue={
                dueStatus ===
                'overdue'
                  ? 'true'
                  : 'false'
              }
            >
              Due Date:{' '}
              {new Date(
                `${dueDate}T00:00:00`,
              ).toLocaleDateString()}

              {dueStatus && (
                <StatusIndicator
                  status={dueStatus}
                />
              )}
            </div>
          )}

          {onUpdateTask && (
            <Button
              variant="secondary"
              onClick={() => {
                if (
                  taskId !== undefined
                ) {
                  onStartEdit?.(
                    taskId,
                  )
                }
              }}
            >
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </>
      )}
    </article>
  )
}

export default React.memo(TaskCard)