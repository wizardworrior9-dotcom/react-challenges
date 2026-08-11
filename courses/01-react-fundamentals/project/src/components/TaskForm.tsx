import { useState, type FormEvent } from 'react'
import type { Task } from './TaskList'

interface TaskFormProps {
  onAddTask?: (task: Task) => void
  categories?: string[]
}

const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
]

function parseTags(value: string): string[] {
  return [
    ...new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ]
}

export default function TaskForm({
  onAddTask,
  categories = DEFAULT_CATEGORIES,
}: TaskFormProps) {
  const availableCategories = [
    ...new Set(
      ['General', ...categories].filter(Boolean),
    ),
  ]

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('General')
  const [tagsInput, setTagsInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const newTask: Task = {
      id:
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : Date.now(),

      title: title.trim(),

      description: description.trim(),

      priority,

      completed: false,

      category: category || 'General',

      tags: parseTags(tagsInput),

      ...(dueDate
        ? { dueDate }
        : {}),
    }

    onAddTask?.(newTask)

    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)
          setError('')
        }}
        placeholder="Task title"
      />

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        placeholder="Task description"
      />

      <select
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value)
        }
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        id="task-category-input"
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
      >
        {availableCategories.map(
          (availableCategory) => (
            <option
              key={availableCategory}
              value={availableCategory}
            >
              {availableCategory}
            </option>
          ),
        )}
      </select>

      <input
        id="task-tags-input"
        type="text"
        value={tagsInput}
        onChange={(event) =>
          setTagsInput(event.target.value)
        }
        placeholder="Tags (comma separated)"
      />

      <label htmlFor="task-due-date">
        Due Date
      </label>

      <input
        id="task-due-date"
        type="date"
        value={dueDate}
        onChange={(event) =>
          setDueDate(event.target.value)
        }
      />

      {error && (
        <div id="task-form-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}