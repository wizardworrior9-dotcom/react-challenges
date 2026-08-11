interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  taskId,
}: TaskCardProps) {
  const handleToggle = () => {
    if (onToggle && taskId !== undefined) {
      onToggle(taskId)
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

      <h2
        style={{
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        {description}
      </p>

      <span>Priority: {priority}</span>
    </article>
  )
}