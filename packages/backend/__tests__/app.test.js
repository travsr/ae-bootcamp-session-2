const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) db.close();
});

describe('GET /', () => {
  it('should return health check status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

const createTodo = async (overrides = {}) => {
  const payload = { title: 'Test Task', priority: 'medium', ...overrides };
  const response = await request(app)
    .post('/api/todos')
    .send(payload)
    .set('Accept', 'application/json');
  expect(response.status).toBe(201);
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/todos', () => {
    it('should return an array of todos', async () => {
      await createTodo({ title: 'Sample Task' });
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return todos with expected shape', async () => {
      await createTodo({ title: 'Shape Test Task' });
      const response = await request(app).get('/api/todos');
      const todo = response.body[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('description');
      expect(todo).toHaveProperty('priority');
      expect(todo).toHaveProperty('completed');
      expect(todo).toHaveProperty('tags');
      expect(Array.isArray(todo.tags)).toBe(true);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a todo with all fields', async () => {
      const payload = {
        title: 'Full Task',
        description: 'Details here',
        due_date: '2026-12-31',
        category: 'Work',
        tags: ['urgent', 'review'],
        priority: 'high',
      };
      const response = await request(app)
        .post('/api/todos')
        .send(payload)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(payload.title);
      expect(response.body.description).toBe(payload.description);
      expect(response.body.due_date).toBe(payload.due_date);
      expect(response.body.category).toBe(payload.category);
      expect(response.body.tags).toEqual(payload.tags);
      expect(response.body.priority).toBe(payload.priority);
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ priority: 'low' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Task title is required');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '   ' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Task title is required');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Task', priority: 'urgent' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid priority value');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update all fields of an existing todo', async () => {
      const todo = await createTodo({ title: 'To Update' });
      const update = {
        title: 'Updated Title',
        description: 'New description',
        priority: 'low',
        category: 'Personal',
        tags: ['updated'],
        due_date: '2027-01-15',
      };
      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send(update)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(update.title);
      expect(response.body.priority).toBe(update.priority);
      expect(response.body.category).toBe(update.category);
      expect(response.body.tags).toEqual(update.tags);
    });

    it('should return 404 for unknown id', async () => {
      const response = await request(app)
        .put('/api/todos/999999')
        .send({ title: 'X' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Todo not found');
    });

    it('should return 400 for non-numeric id', async () => {
      const response = await request(app)
        .put('/api/todos/abc')
        .send({ title: 'Test' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid todo ID is required');
    });

    it('should return 400 for invalid priority', async () => {
      const todo = await createTodo({ title: 'Task to update' });
      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ title: 'Updated', priority: 'critical' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid priority value');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    it('should toggle completed status', async () => {
      const todo = await createTodo({ title: 'Toggle Task' });
      expect(todo.completed).toBe(false);

      const toggled = await request(app).patch(`/api/todos/${todo.id}/complete`);
      expect(toggled.status).toBe(200);
      expect(toggled.body.completed).toBe(true);

      const toggledBack = await request(app).patch(`/api/todos/${todo.id}/complete`);
      expect(toggledBack.status).toBe(200);
      expect(toggledBack.body.completed).toBe(false);
    });

    it('should return 404 for unknown id', async () => {
      const response = await request(app).patch('/api/todos/999999/complete');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Todo not found');
    });

    it('should return 400 for non-numeric id', async () => {
      const response = await request(app).patch('/api/todos/abc/complete');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid todo ID is required');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete an existing todo', async () => {
      const todo = await createTodo({ title: 'To Delete' });
      const response = await request(app).delete(`/api/todos/${todo.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Todo deleted successfully', id: todo.id });
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app).delete('/api/todos/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Todo not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/todos/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid todo ID is required');
    });
  });
});