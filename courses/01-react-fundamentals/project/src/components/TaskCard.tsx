import { useEffect, useState } from 'react'

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
}

function getDueLabel(
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

  const difference =
    Math.round(
      (due.getTime() -
        todayOnly.getTime()) /
        (1000 * 60 * 60 * 24),
    )

  if (difference < 0) {
    return 'Overdue'
  }

  if (difference === 0) {
    return 'Due Today'
  }

  if (difference <= 3) {
    return 'Due Soon'
  }

  return null
}

export default function TaskCard({
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
}: TaskCardProps) {
  const isEditing =
    editingId !== null &&
    editingId !== undefined &&
    editingId === taskId

  const [editTitle, setEditTitle] =
    useState(title)

  const [editDescription, setEditDescription] =
    useState(description)

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

  const dueLabel = getDueLabel(
    dueDate,
    completed,
  )

  const overdue =
    dueLabel === 'Overdue'

  return (
    <article
      id="task-card"
      data-completed={
        completed ? 'true' : 'false'
      }
      data-overdue={
        overdue ? 'true' : 'false'
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
          <input
            value={editTitle}
            onChange={(event) => {
              setEditTitle(
                event.target.value,
              )
              setEditError('')
            }}
            aria-label="Edit title"
          />

          <textarea
            value={editDescription}
            onChange={(event) =>
              setEditDescription(
                event.target.value,
              )
            }
            aria-label="Edit description"
          />

          <select
            value={editPriority}
            onChange={(event) =>
              setEditPriority(
                event.target.value,
              )
            }
            aria-label="Edit priority"
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

          <input
            value={editCategory}
            onChange={(event) =>
              setEditCategory(
                event.target.value,
              )
            }
            aria-label="Edit category"
          />

          <input
            value={editTags}
            onChange={(event) =>
              setEditTags(
                event.target.value,
              )
            }
            aria-label="Edit tags"
          />

          <input
            type="date"
            value={editDueDate}
            onChange={(event) =>
              setEditDueDate(
                event.target.value,
              )
            }
            aria-label="Edit due date"
          />

          {editError && (
            <div
              id="task-edit-error"
              role="alert"
            >
              {editError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
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
            {title}
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
            Priority: {priority}
          </div>

          <div id="task-category">
            Category: {category}
          </div>

          <div id="task-tags">
            {tags.map((tag) => (
              <span
                key={tag}
                data-tag={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          {dueDate && (
            <div
              id="task-due-date"
              data-overdue={
                overdue
                  ? 'true'
                  : 'false'
              }
            >
              Due Date:{' '}
              {new Date(
                `${dueDate}T00:00:00`,
              ).toLocaleDateString()}

              {dueLabel && (
                <span>
                  {' '}
                  {dueLabel}
                </span>
              )}
            </div>
          )}

          {onUpdateTask && (
            <button
              type="button"
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
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={
                handleDelete
              }
            >
              Delete
            </button>
          )}
        </>
      )}
    </article>
  )
}