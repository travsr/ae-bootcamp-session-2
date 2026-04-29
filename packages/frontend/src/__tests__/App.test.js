import React, { act } from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const SAMPLE_TODOS = [
  {
    id: 1,
    title: 'First Task',
    description: 'Desc 1',
    due_date: '2026-12-01',
    category: 'Work',
    tags: ['review'],
    priority: 'high',
    completed: false,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Second Task',
    description: '',
    due_date: null,
    category: 'Personal',
    tags: [],
    priority: 'low',
    completed: true,
    created_at: '2026-01-02T00:00:00.000Z',
  },
];

const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(SAMPLE_TODOS));
  }),

  rest.post('/api/todos', (req, res, ctx) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Task title is required' }));
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title,
        description: '',
        due_date: null,
        category: null,
        tags: [],
        priority: 'medium',
        completed: false,
        created_at: new Date().toISOString(),
      }),
    );
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Todo deleted successfully', id: Number(req.params.id) }));
  }),

  rest.patch('/api/todos/:id/complete', (req, res, ctx) => {
    const id = Number(req.params.id);
    const todo = SAMPLE_TODOS.find((t) => t.id === id);
    return res(ctx.status(200), ctx.json({ ...(todo || {}), id, completed: true }));
  }),

  rest.put('/api/todos/:id', (req, res, ctx) => {
    const id = Number(req.params.id);
    return res(ctx.status(200), ctx.json({ ...req.body, id }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the page title', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
  });

  test('renders tasks loaded from API', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('First Task')).toBeInTheDocument();
      expect(screen.getByText('Second Task')).toBeInTheDocument();
    });
  });

  test('completed task title has strikethrough style', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText('Second Task')).toBeInTheDocument();
    });
    const completedTitle = screen.getByText('Second Task');
    expect(completedTitle).toHaveStyle('text-decoration: line-through');
  });

  test('opens Add Task dialog when button is clicked', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    const addButton = screen.getByRole('button', { name: /add new task/i });
    await userEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  test('closes dialog on cancel', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getByRole('button', { name: /add new task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows error alert when API fails', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  test('closes error alert when close button is clicked', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByRole('alert'));

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('creates a new task via dialog and closes the dialog', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getByRole('button', { name: /add new task/i }));
    await userEvent.type(screen.getByLabelText('Task title'), 'My New Task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows error when creating task fails', async () => {
    server.use(
      rest.post('/api/todos', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getByRole('button', { name: /add new task/i }));
    await userEvent.type(screen.getByLabelText('Task title'), 'Failing Task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
    });
  });

  test('deletes a task when delete button is clicked', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('First Task')).not.toBeInTheDocument();
    });
  });

  test('shows error when deleting a task fails', async () => {
    server.use(
      rest.delete('/api/todos/:id', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to delete task/i)).toBeInTheDocument();
    });
  });

  test('toggles task completion when checkbox is clicked', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    });
  });

  test('shows error when toggling task completion fails', async () => {
    server.use(
      rest.patch('/api/todos/:id/complete', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to update task/i)).toBeInTheDocument();
    });
  });

  test('updates a task when edit is saved', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getAllByRole('button', { name: /edit task/i })[0]);
    const titleInput = screen.getByLabelText('Edit task title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Task Title');
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    await waitFor(() => {
      expect(screen.getByText('Updated Task Title')).toBeInTheDocument();
    });
  });

  test('shows error when updating a task fails', async () => {
    server.use(
      rest.put('/api/todos/:id', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({ error: 'Server error' })),
      ),
    );
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getAllByRole('button', { name: /edit task/i })[0]);
    const titleInput = screen.getByLabelText('Edit task title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Task Title');
    await userEvent.click(screen.getByRole('button', { name: /save task/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/failed to update task/i)).toBeInTheDocument();
    });
  });

  test('changes the sort order', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^sort by$/i }));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Due Date'));

    await waitFor(() => {
      expect(screen.getByText('First Task')).toBeInTheDocument();
    });
  });

  test('changes the category filter', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^category$/i }));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Work'));

    await waitFor(() => {
      expect(screen.getByText('Category: Work')).toBeInTheDocument();
    });
  });
});