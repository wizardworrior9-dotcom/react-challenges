import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';

describe('Challenge 12: Categories and Tags', () => {
  const TASKS_WITH_CATEGORY = [
    { id: 1, title: 'T1', description: 'D1', priority: 'High', completed: false, category: 'Work', tags: ['urgent'] },
  ];

  it('TaskCard should render title and priority', () => {
    render(<TaskCard title="T" description="D" priority="High" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText(/priority:\s*high/i)).toBeInTheDocument();
  });

  it('TaskList should render tasks with extended shape', () => {
    render(<TaskList tasks={TASKS_WITH_CATEGORY} countText="1 Tasks" />);
    expect(screen.getByText('T1')).toBeInTheDocument();
  });
});
