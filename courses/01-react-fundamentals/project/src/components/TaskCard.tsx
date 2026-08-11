interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard(_props: TaskCardProps) {
  return (
    <article id="task-card">
      <h2>{_props.title}</h2>
      <p>{_props.description}</p>
      <span>Priority: {_props.priority}</span>
    </article>
  )
}