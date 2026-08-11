import { useEffect, useState } from 'react'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    },
  ) => void
  taskId?: string | number
  editingId?: string | number | null
  onStartEdit?: (id: string | number) => void
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
  onUpdateTask,
  taskId,
  editingId,
  onStartEdit,
}: TaskCardProps) {
  const isEditing =
    editingId !== undefined &&
    editingId !== null &&
    taskId !== undefined &&
    editingId === taskId

  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPriority, setEditPriority] = useState(priority)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (isEditing) {
      setEditTitle(title)
      setEditDescription(description)
      setEditPriority(priority)
      setEditError('')
    }
  }, [isEditing, title, description, priority])

  const handleToggle = () => {
    if (onToggle && taskId !== undefined) {
      onToggle(taskId)
    }
  }

  const handleDelete = () => {
    if (onDelete && taskId !== undefined) {
      if (window.confirm('Are you sure?')) {
        onDelete(taskId)
      }
    }
  }

  const handleStartEdit = () => {
    if (onStartEdit && taskId !== undefined) {
      setEditTitle(title)
      setEditDescription(description)
      setEditPriority(priority)
      setEditError('')
      onStartEdit(taskId)
    }
  }

  const handleSave = () => {
    if (!editTitle.trim()) {
      setEditError('Title is required')
      return
    }

    if (onUpdateTask && taskId !== undefined) {
      onUpdateTask(taskId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      })
    }
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditError('')

    if (onStartEdit) {
      onStartEdit(-1)
    }
  }

  return (
    <article
      id="task-card"
      data-completed={completed ? 'true' : 'false'}
      style={{
        backgroundColor: completed ? '#e8f5e9' : undefined,
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          aria-label={`Mark ${title} as completed`}
        />
      )}

      {isEditing ? (
        <div>
          <input
            type="text"
            aria-label="Edit title"
            value={editTitle}
            onChange={(event) => {
              setEditTitle(event.target.value)
              if (editError) {
                setEditError('')
              }
            }}
          />

          <textarea
            aria-label="Edit description"
            value={editDescription}
            onChange={(event) =>
              setEditDescription(event.target.value)
            }
          />

          <select
            aria-label="Edit priority"
            value={editPriority}
            onChange={(event) =>
              setEditPriority(event.target.value)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {editError && (
            <div id="task-edit-error" role="alert">
              {editError}
            </div>
          )}

          <button type="button" onClick={handleSave}>
            Save
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <h2
            style={{
              textDecoration: completed
                ? 'line-through'
                : 'none',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              textDecoration: completed
                ? 'line-through'
                : 'none',
            }}
          >
            {description}
          </p>

          <span>Priority: {priority}</span>

          {onUpdateTask && (
            <button type="button" onClick={handleStartEdit}>
              Edit
            </button>
          )}

          {onDelete && (
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </>
      )}
    </article>
  )
}