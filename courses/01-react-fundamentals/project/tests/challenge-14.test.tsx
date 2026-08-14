import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsPanel from '../src/components/StatsPanel';
import TaskList from '../src/components/TaskList';

describe('Challenge 14: Task Statistics Dashboard', () => {
  const TASKS = [
    { id: 1, title: 'A', description: 'D', priority: 'High', completed: true },
    { id: 2, title: 'B', description: 'D', priority: 'Medium', completed: false },
  ];

  it('StatsPanel should have id="stats-panel"', () => {
    const { container } = render(<StatsPanel total={2} completed={1} active={1} overdue={0} />);
    expect(container.querySelector('#stats-panel')).toBeInTheDocument();
  });

  it('StatsPanel should display total and completed', () => {
    render(<StatsPanel total={2} completed={1} active={1} overdue={0} />);
    expect(screen.getByText(/total:\s*2/i)).toBeInTheDocument();
    expect(screen.getByText(/completed:\s*1/i)).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    render(<TaskList tasks={TASKS} countText="2 Tasks" />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
