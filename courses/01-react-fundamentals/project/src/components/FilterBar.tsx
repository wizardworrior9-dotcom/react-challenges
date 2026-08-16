import { useEffect, useRef } from 'react'
import type { MutableRefObject, RefObject } from 'react'

export type TaskFilter =
  | 'all'
  | 'active'
  | 'completed'

export type TaskSort =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'
  | 'due-date'

interface FilterBarProps {
  filter?: TaskFilter
  onFilterChange?: (
    filter: TaskFilter,
  ) => void

  sortOrder?: TaskSort
  onSortChange?: (
    sortOrder: TaskSort,
  ) => void

  searchText?: string
  searchQuery?: string
  onSearchChange?: (
    searchText: string,
  ) => void

  onClearSearch?: () => void

  searchInputRef?: RefObject<
    HTMLInputElement | null
  >

  categories?: string[]
  categoryFilter?: string
  onCategoryChange?: (
    category: string,
  ) => void
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sortOrder = 'recent',
  onSortChange,
  searchText,
  searchQuery,
  onSearchChange,
  onClearSearch,
  searchInputRef: externalSearchInputRef,
  categories = [],
  categoryFilter = 'all',
  onCategoryChange,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const queryValue = searchText ?? searchQuery ?? ''

  return (
    <div id="filter-bar">
      <div>
        <button
          type="button"
          data-active={
            filter === 'all'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange?.('all')
          }
        >
          All
        </button>

        <button
          type="button"
          data-active={
            filter === 'active'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange?.('active')
          }
        >
          Active
        </button>

        <button
          type="button"
          data-active={
            filter === 'completed'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange?.('completed')
          }
        >
          Completed
        </button>
      </div>

      <select
        id="category-filter"
        value={categoryFilter}
        onChange={(event) =>
          onCategoryChange?.(
            event.target.value,
          )
        }
      >
        <option value="all">
          All categories
        </option>

        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>

      <div>
        <input
          ref={(node) => {
            const currentRef = searchInputRef as MutableRefObject<HTMLInputElement | null>
            currentRef.current = node
            if (externalSearchInputRef) {
              const extRef = externalSearchInputRef as MutableRefObject<HTMLInputElement | null>
              extRef.current = node
            }
          }}
          id="search-input"
          type="text"
          value={queryValue}
          onChange={(event) =>
            onSearchChange?.(
              event.target.value,
            )
          }
          placeholder="Search tasks..."
        />

        {queryValue && (
          <button
            id="clear-search"
            type="button"
            onClick={onClearSearch}
          >
            Clear search
          </button>
        )}
      </div>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) =>
          onSortChange?.(
            event.target.value as TaskSort,
          )
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="priority-high">
          Priority: High to Low
        </option>

        <option value="priority-low">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>

        <option value="due-date">
          Due Date (Soonest First)
        </option>
      </select>
    </div>
  )
}
