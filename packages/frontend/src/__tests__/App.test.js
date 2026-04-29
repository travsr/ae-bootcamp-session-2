import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

    const addButton = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  test('closes dialog on cancel', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => screen.getByText('First Task'));

    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
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
});

      render(<App />);
    });
    expect(screen.getByText('React Frontend with Node Backend')).toBeInTheDocument();
    expect(screen.getByText('Connected to in-memory database')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'New Test Item');
    });
    
    const submitButton = screen.getByText('Add Item');
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });
});