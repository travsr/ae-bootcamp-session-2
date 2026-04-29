import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../components/task-card';

const baseTodo = {
  id: 1,
  title: 'Test Task',
  description: 'A description',
  due_date: '2026-12-01',
  category: 'Work',
  tags: ['review', 'urgent'],
  priority: 'high',
  completed: false,
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('TaskCard', () => {
  test('renders task title, description, priority, category, tags, and due date', () => {
    render(
      <TaskCard todo={baseTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('review')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('Due: 2026-12-01')).toBeInTheDocument();
  });

  test('renders completed task title with strikethrough style', () => {
    const completedTodo = { ...baseTodo, completed: true };
    render(
      <TaskCard todo={completedTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    expect(screen.getByText('Test Task')).toHaveStyle('text-decoration: line-through');
  });

  test('calls onToggleComplete with the todo id when checkbox is clicked', async () => {
    const onToggleComplete = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={onToggleComplete} />,
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggleComplete).toHaveBeenCalledWith(1);
  });

  test('calls onDelete with the todo id when delete button is clicked', async () => {
    const onDelete = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={jest.fn()} onDelete={onDelete} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /delete task/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('enters edit mode when edit button is clicked', async () => {
    render(
      <TaskCard todo={baseTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));
    expect(screen.getByLabelText('Edit task title')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit task description')).toBeInTheDocument();
  });

  test('calls onUpdate with updated title when save is clicked', async () => {
    const onUpdate = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={onUpdate} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const titleInput = screen.getByLabelText('Edit task title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Task');
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Updated Task' }));
  });

  test('calls onUpdate with updated description when save is clicked', async () => {
    const onUpdate = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={onUpdate} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const descInput = screen.getByLabelText('Edit task description');
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'New description text');
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ description: 'New description text' }));
  });

  test('calls onUpdate with changed priority when save is clicked', async () => {
    const onUpdate = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={onUpdate} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));
    await userEvent.click(screen.getByRole('button', { name: /^low$/i }));
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ priority: 'low' }));
  });

  test('cancels edit and restores the original values', async () => {
    render(
      <TaskCard todo={baseTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const titleInput = screen.getByLabelText('Edit task title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Changed Title');
    await userEvent.click(screen.getByRole('button', { name: /cancel edit/i }));

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByLabelText('Edit task title')).not.toBeInTheDocument();
  });

  test('does not call onUpdate when saving with an empty title', async () => {
    const onUpdate = jest.fn();
    render(
      <TaskCard todo={baseTodo} onUpdate={onUpdate} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit task/i }));

    const titleInput = screen.getByLabelText('Edit task title');
    await userEvent.clear(titleInput);
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Edit task title')).toBeInTheDocument();
  });

  test('renders task without optional fields', () => {
    const minimalTodo = {
      id: 2,
      title: 'Minimal Task',
      description: '',
      due_date: null,
      category: null,
      tags: [],
      priority: 'medium',
      completed: false,
      created_at: '2026-01-01T00:00:00.000Z',
    };
    render(
      <TaskCard todo={minimalTodo} onUpdate={jest.fn()} onDelete={jest.fn()} onToggleComplete={jest.fn()} />,
    );
    expect(screen.getByText('Minimal Task')).toBeInTheDocument();
    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument();
  });
});
