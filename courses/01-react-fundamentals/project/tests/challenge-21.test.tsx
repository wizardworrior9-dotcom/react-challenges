import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TaskDetailPage from '../src/components/TaskDetailPage';

describe('Challenge 21: React Router - Routing and Navigation', () => {
  it('TaskDetailPage should use useParams and render task detail or not found', () => {
    render(
      <MemoryRouter initialEntries={['/challenge/21-react-router/task/1']}>
        <Routes>
          <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    const page = document.getElementById('task-detail-page');
    expect(page).toBeInTheDocument();
  });

  it('TaskDetailPage should have back button with id task-detail-back', () => {
    render(
      <MemoryRouter initialEntries={['/challenge/21-react-router/task/999']}>
        <Routes>
          <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    const back = document.getElementById('task-detail-back');
    expect(back).toBeInTheDocument();
  });
});
