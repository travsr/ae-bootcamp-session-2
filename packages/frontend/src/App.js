import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import theme from './theme';
import { API_BASE } from './constants';
import AddTaskDialog from './components/add-task-dialog';
import FilterSortBar from './components/filter-sort-bar';
import TaskList from './components/task-list';

const DEFAULT_FILTERS = {};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('created_at');

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.completed !== undefined) params.set('completed', String(filters.completed));
    if (sortBy) params.set('sortBy', sortBy);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [filters, sortBy]);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}${buildQueryString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (formData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      setDialogOpen(false);
      await fetchTodos();
    } catch (err) {
      setDialogOpen(false);
      setError('Failed to create task: ' + err.message);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/complete`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600} color="primary">
            To Do App
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            aria-label="Add new task"
          >
            Add Task
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FilterSortBar
          filters={filters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <CircularProgress aria-label="Loading tasks" />
          </Box>
        ) : (
          <TaskList
            todos={todos}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        )}

        <AddTaskDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={handleCreate}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;