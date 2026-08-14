import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../src/components/TaskCard';
import TaskList from '../src/components/TaskList';

describe('Challenge 04: Task Completion Toggle', () => {
  const TASKS = [
    { id: 1, title: 'Task 1', description: 'D1', priority: 'High', completed: false },
    { id: 2, title: 'Task 2', description: 'D2', priority: 'Medium', completed: true },
  ];

  it('TaskCard should render checkbox when onToggle provided', () => {
    const onToggle = vi.fn();
    render(
      <TaskCard title="T" description="D" priority="Low" completed={false} onToggle={onToggle} />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('TaskCard should call onToggle when checkbox clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TaskCard title="T" description="D" priority="Low" completed={false} onToggle={onToggle} />
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('TaskCard should show strike-through when completed', () => {
    const { container } = render(
      <TaskCard title="Done" description="Desc" priority="Low" completed />
    );
    const h2 = container.querySelector('h2');
    expect(h2).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('TaskCard should have data-completed or different style when completed', () => {
    const { container } = render(
      <TaskCard title="T" description="D" priority="Low" completed />
    );
    const article = container.querySelector('#task-card');
    expect(article).toHaveAttribute('data-completed', 'true');
  });

  it('TaskList should pass onToggle to TaskCard when tasks provided', async () => {
    render(
      <TaskList
        tasks={TASKS}
        onToggle={vi.fn()}
        countText="1 of 2 completed"
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);
    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument();
  });

  it('count text should show X of Y completed format', () => {
    render(
      <TaskList tasks={TASKS} onToggle={vi.fn()} countText="1 of 2 completed" />
    );
    const countEl = document.getElementById('task-count');
    expect(countEl).toHaveTextContent(/1 of 2 completed/);
  });
});
