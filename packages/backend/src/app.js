const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_SORT_FIELDS = ['due_date', 'priority', 'category', 'created_at'];
const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    due_date TEXT,
    category TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    priority TEXT NOT NULL DEFAULT 'medium',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('In-memory database initialized');

const parseTodo = (row) => {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    completed: row.completed === 1,
  };
};

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// GET /api/todos — list with optional filter + sort
app.get('/api/todos', (req, res) => {
  try {
    const { category, tag, priority, completed, sortBy } = req.query;

    let query = 'SELECT * FROM todos WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (completed !== undefined) {
      query += ' AND completed = ?';
      params.push(completed === 'true' || completed === '1' ? 1 : 0);
    }

    const sortField = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
    query += ` ORDER BY ${sortField} ASC`;

    let todos = db.prepare(query).all(...params).map(parseTodo);

    if (tag) {
      todos = todos.filter((t) => t.tags.includes(tag));
    }

    if (sortBy === 'priority') {
      todos.sort((a, b) => (PRIORITY_ORDER[a.priority] || 99) - (PRIORITY_ORDER[b.priority] || 99));
    }

    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos — create
app.post('/api/todos', (req, res) => {
  try {
    const { title, description = '', due_date = null, category = null, tags = [], priority = 'medium' } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const stmt = db.prepare(`
      INSERT INTO todos (title, description, due_date, category, tags, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title.trim(),
      description,
      due_date || null,
      category || null,
      JSON.stringify(Array.isArray(tags) ? tags : []),
      priority,
    );

    const newTodo = parseTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid));
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id — full update
app.put('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const {
      title = existing.title,
      description = existing.description,
      due_date = existing.due_date,
      category = existing.category,
      tags,
      priority = existing.priority,
      completed = existing.completed,
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const updatedTags = tags !== undefined ? tags : JSON.parse(existing.tags || '[]');

    db.prepare(`
      UPDATE todos
      SET title = ?, description = ?, due_date = ?, category = ?, tags = ?,
          priority = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title.trim(),
      description,
      due_date || null,
      category || null,
      JSON.stringify(Array.isArray(updatedTags) ? updatedTags : []),
      priority,
      completed ? 1 : 0,
      id,
    );

    const updated = parseTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(id));
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH /api/todos/:id/complete — toggle completion
app.patch('/api/todos/:id/complete', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const newCompleted = existing.completed === 1 ? 0 : 1;
    db.prepare(`
      UPDATE todos SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(newCompleted, id);

    const updated = parseTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(id));
    res.json(updated);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ message: 'Todo deleted successfully', id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = { app, db };