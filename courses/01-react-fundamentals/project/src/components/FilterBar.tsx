export type TaskFilter = 'all' | 'active' | 'completed'

interface FilterBarProps {
  filter: TaskFilter
  onFilterChange?: (filter: TaskFilter) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
}: FilterBarProps) {
  const handleFilterChange = (nextFilter: TaskFilter) => {
    onFilterChange?.(nextFilter)
  }

  return (
    <div id="filter-bar">
      <button
        type="button"
        data-active={filter === 'all' ? 'true' : 'false'}
        onClick={() => handleFilterChange('all')}
      >
        All
      </button>

      <button
        type="button"
        data-active={filter === 'active' ? 'true' : 'false'}
        onClick={() => handleFilterChange('active')}
      >
        Active
      </button>

      <button
        type="button"
        data-active={filter === 'completed' ? 'true' : 'false'}
        onClick={() => handleFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  )
}
