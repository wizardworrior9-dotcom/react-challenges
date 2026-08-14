import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';

describe('Challenge 13: Due Dates and Sorting', () => {
  const TASKS_WITH_DUE = [
    { id: 1, title: 'T1', description: 'D1', priority: 'High', completed: false, dueDate: '2025-12-31' },
  ];

  it('TaskCard should render title', () => {
    render(<TaskCard title="T" description="D" priority="High" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('TaskList should render tasks', () => {
    render(<TaskList tasks={TASKS_WITH_DUE} countText="1 Tasks" />);
    expect(screen.getByText('T1')).toBeInTheDocument();
  });
});
