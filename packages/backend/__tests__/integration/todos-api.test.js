const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) db.close();
});

beforeEach(() => {
  db.exec('DELETE FROM todos');
});

const createTodo = async (overrides = {}) => {
  const payload = { title: 'Integration Task', priority: 'medium', ...overrides };
  const response = await request(app)
    .post('/api/todos')
    .send(payload)
    .set('Accept', 'application/json');
  expect(response.status).toBe(201);
  return response.body;
};

describe('Todos API Integration', () => {
  describe('GET /api/todos', () => {
    it('returns all todos', async () => {
      await createTodo({ title: 'Task A' });
      await createTodo({ title: 'Task B' });

      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('filters by priority', async () => {
      await createTodo({ title: 'High Task', priority: 'high' });
      await createTodo({ title: 'Low Task', priority: 'low' });

      const response = await request(app).get('/api/todos?priority=high');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('High Task');
    });

    it('filters by completion status', async () => {
      const todo = await createTodo({ title: 'Done Task' });
      await request(app).patch(`/api/todos/${todo.id}/complete`);
      await createTodo({ title: 'Open Task' });

      const response = await request(app).get('/api/todos?completed=false');
      expect(response.status).toBe(200);
      expect(response.body.every((t) => t.completed === false)).toBe(true);
    });

    it('filters by category', async () => {
      await createTodo({ title: 'Work Task', category: 'Work' });
      await createTodo({ title: 'Home Task', category: 'Personal' });

      const response = await request(app).get('/api/todos?category=Work');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].category).toBe('Work');
    });

    it('filters by tag', async () => {
      await createTodo({ title: 'Tagged Task', tags: ['review', 'backend'] });
      await createTodo({ title: 'Untagged Task', tags: [] });

      const response = await request(app).get('/api/todos?tag=review');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].tags).toContain('review');
    });

    it('sorts by due_date', async () => {
      await createTodo({ title: 'Later Task', due_date: '2027-06-01' });
      await createTodo({ title: 'Earlier Task', due_date: '2026-01-01' });

      const response = await request(app).get('/api/todos?sortBy=due_date');
      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Earlier Task');
      expect(response.body[1].title).toBe('Later Task');
    });

    it('sorts by priority (high before medium before low)', async () => {
      await createTodo({ title: 'LowPriTask', priority: 'low' });
      await createTodo({ title: 'HighPriTask', priority: 'high' });
      await createTodo({ title: 'MedPriTask', priority: 'medium' });

      const response = await request(app).get('/api/todos?sortBy=priority');
      expect(response.status).toBe(200);

      const titles = response.body.map((t) => t.title);
      expect(titles.indexOf('HighPriTask')).toBeLessThan(titles.indexOf('MedPriTask'));
      expect(titles.indexOf('MedPriTask')).toBeLessThan(titles.indexOf('LowPriTask'));
    });

    it('returns 400 for invalid priority filter', async () => {
      const response = await request(app).get('/api/todos?priority=critical');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/todos', () => {
    it('creates a todo with all fields', async () => {
      const payload = {
        title: 'Full Integration Task',
        description: 'Desc',
        due_date: '2026-09-01',
        category: 'Work',
        tags: ['test'],
        priority: 'high',
      };
      const response = await request(app)
        .post('/api/todos')
        .send(payload)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(payload.title);
      expect(response.body.tags).toEqual(payload.tags);
      expect(response.body.completed).toBe(false);
    });

    it('returns 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ priority: 'low' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title is required');
    });

    it('returns 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Task', priority: 'urgent' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid priority value');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates a todo', async () => {
      const todo = await createTodo({ title: 'Before Update' });
      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ title: 'After Update', priority: 'high' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('After Update');
      expect(response.body.priority).toBe('high');
    });

    it('returns 404 for unknown id', async () => {
      const response = await request(app)
        .put('/api/todos/999999')
        .send({ title: 'X' });
      expect(response.status).toBe(404);
    });

    it('returns 400 when title is cleared', async () => {
      const todo = await createTodo();
      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ title: '' });
      expect(response.status).toBe(400);
    });

    it('returns 400 for invalid priority', async () => {
      const todo = await createTodo();
      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ title: 'Valid Title', priority: 'critical' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid priority value');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    it('toggles completion from false to true', async () => {
      const todo = await createTodo({ title: 'Toggle Me' });
      const response = await request(app).patch(`/api/todos/${todo.id}/complete`);
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('toggles completion from true to false', async () => {
      const todo = await createTodo({ title: 'Toggle Back' });
      await request(app).patch(`/api/todos/${todo.id}/complete`);
      const response = await request(app).patch(`/api/todos/${todo.id}/complete`);
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(false);
    });

    it('returns 404 for unknown id', async () => {
      const response = await request(app).patch('/api/todos/999999/complete');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo', async () => {
      const todo = await createTodo({ title: 'Delete Me' });
      const response = await request(app).delete(`/api/todos/${todo.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Todo deleted successfully', id: todo.id });

      const verify = await request(app).delete(`/api/todos/${todo.id}`);
      expect(verify.status).toBe(404);
    });

    it('returns 404 for unknown id', async () => {
      const response = await request(app).delete('/api/todos/999999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('returns 400 for invalid id', async () => {
      const response = await request(app).delete('/api/todos/abc');
      expect(response.status).toBe(400);
    });
  });
});
