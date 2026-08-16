import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import type { Task } from './TaskList'

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'Description one',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'Description two',
    priority: 'Medium',
    completed: false,
    category: 'Work',
    tags: [],
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'Description three',
    priority: 'Low',
    completed: false,
    category: 'Personal',
    tags: [],
  },
  {
    id: 4,
    title: 'Fourth Task',
    description: 'Description four',
    priority: 'Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 5,
    title: 'Fifth Task',
    description: 'Description five',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
]

function getTasks(): Task[] {
  try {
    const storedTasks =
      window.localStorage.getItem(
        'task-app-tasks',
      )

    if (storedTasks) {
      const parsedTasks = JSON.parse(
        storedTasks,
      )

      if (Array.isArray(parsedTasks)) {
        return parsedTasks as Task[]
      }
    }
  } catch {
    return INITIAL_TASKS
  }

  return INITIAL_TASKS
}

export default function TaskDetailPage() {
  const { id } =
    useParams<{ id: string }>()

  const navigate = useNavigate()

  const tasks = getTasks()

  const task = tasks.find(
    (item) => String(item.id) === id,
  )

  return (
    <main id="task-detail-page">
      <button
        id="task-detail-back"
        type="button"
        onClick={() =>
          navigate(
            '/challenge/21-react-router',
          )
        }
      >
        Back to list
      </button>

      {task ? (
        <article>
          <h1>{task.title}</h1>

          <p>{task.description}</p>

          <p>
            Priority:{' '}
            <strong>
              {task.priority}
            </strong>
          </p>

          <p>
            Status:{' '}
            <strong>
              {task.completed
                ? 'Completed'
                : 'Active'}
            </strong>
          </p>

          <p>
            Category:{' '}
            <strong>
              {task.category ||
                'General'}
            </strong>
          </p>

          {task.tags &&
            task.tags.length > 0 && (
              <p>
                Tags:{' '}
                {task.tags.join(', ')}
              </p>
            )}

          {task.dueDate && (
            <p>
              Due Date:{' '}
              {task.dueDate}
            </p>
          )}
        </article>
      ) : (
        <div>
          <h1>Task not found</h1>

          <p>
            No task exists with ID {id}.
          </p>
        </div>
      )}
    </main>
  )
}