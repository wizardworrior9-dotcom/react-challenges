import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterBar from '../src/components/FilterBar';
import TaskList from '../src/components/TaskList';

describe('Challenge 11: useEffect - Debounced Search', () => {
  it('FilterBar should exist for search/debounce integration', () => {
    const { container } = render(<FilterBar filter="all" />);
    expect(container.querySelector('#filter-bar')).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    const tasks = [{ id: 1, title: 'T', description: 'D', priority: 'High', completed: false }];
    render(<TaskList tasks={tasks} countText="1 Tasks" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
