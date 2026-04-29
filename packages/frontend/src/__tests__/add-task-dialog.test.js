import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskDialog from '../components/add-task-dialog';

describe('AddTaskDialog', () => {
  test('does not render dialog content when closed', () => {
    render(<AddTaskDialog open={false} onClose={jest.fn()} onAdd={jest.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders dialog with title and fields when open', () => {
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task title')).toBeInTheDocument();
    expect(screen.getByLabelText('Task description')).toBeInTheDocument();
  });

  test('shows validation error when submitting with an empty title', async () => {
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  test('clears validation error when user types in the title field', async () => {
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Task title'), 'A');
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });

  test('calls onAdd with form data when submitted with a valid title', async () => {
    const onAdd = jest.fn();
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Task title'), 'Buy groceries');
    await userEvent.type(screen.getByLabelText('Task description'), 'Milk and eggs');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Buy groceries',
        description: 'Milk and eggs',
        priority: 'medium',
      }),
    );
  });

  test('calls onClose when cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(<AddTaskDialog open={true} onClose={onClose} onAdd={jest.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('changes priority and submits with the new value', async () => {
    const onAdd = jest.fn();
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Task title'), 'Urgent task');
    await userEvent.click(screen.getByRole('button', { name: /^high$/i }));
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Urgent task', priority: 'high' }),
    );
  });

  test('resets form after successful submission', async () => {
    const onAdd = jest.fn();
    render(<AddTaskDialog open={true} onClose={jest.fn()} onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Task title'), 'Task to reset');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(screen.getByLabelText('Task title')).toHaveValue('');
  });
});
