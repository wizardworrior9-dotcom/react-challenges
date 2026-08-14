import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';

describe('Challenge 08: Task Editing', () => {
  const TASKS = [
    { id: 1, title: 'Original', description: 'Desc', priority: 'High', completed: false },
  ];

  it('TaskCard should render title and description', () => {
    render(<TaskCard title="Original" description="Desc" priority="High" />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('TaskList should pass tasks to TaskCard', () => {
    render(
      <TaskList
        tasks={TASKS}
        countText="1 Tasks"
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('TaskList should have id="task-list"', () => {
    const { container } = render(<TaskList tasks={TASKS} countText="1" />);
    expect(container.querySelector('#task-list')).toBeInTheDocument();
  });
});
