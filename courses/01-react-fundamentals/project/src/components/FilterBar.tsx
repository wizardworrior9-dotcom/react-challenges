export type TaskFilter = 'all' | 'active' | 'completed'

export type TaskSort =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'

interface FilterBarProps {
  filter?: TaskFilter
  onFilterChange?: (filter: TaskFilter) => void
  sortOrder?: TaskSort
  onSortChange?: (sortOrder: TaskSort) => void
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sortOrder = 'recent',
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        type="button"
        data-active={filter === 'all' ? 'true' : 'false'}
        onClick={() => onFilterChange?.('all')}
      >
        All
      </button>

      <button
        type="button"
        data-active={filter === 'active' ? 'true' : 'false'}
        onClick={() => onFilterChange?.('active')}
      >
        Active
      </button>

      <button
        type="button"
        data-active={filter === 'completed' ? 'true' : 'false'}
        onClick={() => onFilterChange?.('completed')}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) =>
          onSortChange?.(event.target.value as TaskSort)
        }
      >
        <option value="recent">Recently Added</option>
        <option value="priority-high">
          Priority: High to Low
        </option>
        <option value="priority-low">
          Priority: Low to High
        </option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  )
}
