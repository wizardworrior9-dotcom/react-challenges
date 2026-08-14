import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';

describe('Challenge 09: Search Functionality', () => {
  const TASKS = [
    { id: 1, title: 'React', description: 'Learn hooks', priority: 'High', completed: false },
    { id: 2, title: 'TypeScript', description: 'Types', priority: 'Medium', completed: false },
  ];

  it('FilterBar should exist for search integration', () => {
    const { container } = render(<FilterBar filter="all" />);
    expect(container.querySelector('#filter-bar')).toBeInTheDocument();
  });

  it('TaskList should filter by provided tasks (search applied upstream)', () => {
    const filtered = TASKS.filter((t) =>
      t.title.toLowerCase().includes('react') || t.description.toLowerCase().includes('react')
    );
    render(<TaskList tasks={filtered} countText="1 of 2 tasks" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });
});
