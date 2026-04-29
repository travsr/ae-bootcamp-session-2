# Implementation Plan — TODO App Expansion

## 1. Backend API Changes

### Data Model
Replace the `items` table with a `todos` table:

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `title` | TEXT NOT NULL | replaces `name` |
| `description` | TEXT | default `''` |
| `due_date` | TEXT | ISO date string, nullable |
| `category` | TEXT | nullable |
| `tags` | TEXT | JSON array stored as string, default `'[]'` |
| `priority` | TEXT | `'high' \| 'medium' \| 'low'`, default `'medium'` |
| `completed` | INTEGER | `0` or `1` (boolean), default `0` |
| `created_at` | TIMESTAMP | auto |
| `updated_at` | TIMESTAMP | updated on each write |

### Routes (all under `/api/todos`)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/todos` | List todos; query params: `?category=`, `?tag=`, `?priority=`, `?completed=`, `?sortBy=` |
| `POST` | `/api/todos` | Create a todo with all fields |
| `PUT` | `/api/todos/:id` | Update any/all fields of a todo |
| `PATCH` | `/api/todos/:id/complete` | Toggle `completed` status |
| `DELETE` | `/api/todos/:id` | Delete a todo |

Existing `/api/items` routes will be removed.

---

## 2. Frontend Changes

### New Dependencies
- `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- `@mui/x-date-pickers`, `dayjs`

### New / Updated Files

| File | Action | Description |
|---|---|---|
| `src/constants.js` | Create | Named constants: `PRIORITIES`, `SORT_OPTIONS`, `API_BASE` |
| `src/theme.js` | Create | MUI theme — Indigo primary `#3F51B5`, Teal secondary `#009688`, priority colors |
| `src/components/add-task-dialog.js` | Create | MUI `<Dialog>` with all fields for creating a new task |
| `src/components/task-card.js` | Create | MUI `<Card>` with inline editing; completed tasks get strikethrough + `text.disabled` |
| `src/components/task-list.js` | Create | Container rendering the list of `<TaskCard>` components |
| `src/components/filter-sort-bar.js` | Create | Filtering (category, tag, priority, completed) and sorting (due date, priority, category) controls |
| `src/App.js` | Rewrite | `<ThemeProvider>`, responsive `<Container maxWidth="md">`, all state and handlers |
| `src/App.css` | Update | Minimal overrides; most styling via MUI `sx` props |

### State & Handlers in `App.js`

- State: `todos`, `sortBy`, `filters`, `dialogOpen`
- Handlers: `handleCreate`, `handleUpdate`, `handleDelete`, `handleToggleComplete`, `handleFilterChange`, `handleSortChange`

---

## 3. Tests

### Backend Unit Tests — `packages/backend/__tests__/app.test.js`
- Update for new `todos` schema and `/api/todos` paths
- Coverage: GET all, POST create, PUT update, PATCH toggle, DELETE
- Validation: `title` required, `priority` enum, 404 on unknown id

### Integration Tests — `packages/backend/__tests__/integration/todos-api.test.js` (new)
- `GET /api/todos` — returns all todos
- `GET /api/todos?priority=high` — filter by priority
- `GET /api/todos?completed=0` — filter by completion
- `GET /api/todos?sortBy=due_date` — sort by due date
- `POST /api/todos` — create with all fields
- `PUT /api/todos/:id` — full update
- `PATCH /api/todos/:id/complete` — toggle completion
- `DELETE /api/todos/:id` — delete
- Error cases: 400 on missing title, 404 on unknown id

### Frontend Unit Tests — `packages/frontend/src/__tests__/App.test.js`
- Update MSW handlers to `/api/todos`
- Tests: renders task list, opens "Add Task" dialog, creates task, deletes task, marks task complete, filters, sorts

### E2E Tests — `tests/e2e/todo-workflow.spec.js` (new)
- Framework: Playwright, Chromium only, Page Object Model
- 6 tests:
  1. Create a new task with all fields
  2. Edit an existing task inline
  3. Mark a task as complete (verify strikethrough)
  4. Delete a task
  5. Filter tasks by priority
  6. Sort tasks by due date
