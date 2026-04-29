import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
  Stack,
  Box,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PRIORITIES, PRIORITY_LABELS, DEFAULT_CATEGORIES } from '../constants';

const PRIORITY_COLOR_MAP = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

function TaskCard({ todo, onUpdate, onDelete, onToggleComplete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description || '',
    due_date: todo.due_date || null,
    category: todo.category || '',
    tags: todo.tags || [],
    priority: todo.priority || 'medium',
  });

  const completedStyle = todo.completed
    ? { textDecoration: 'line-through', color: 'text.disabled' }
    : {};

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, due_date: value ? value.format('YYYY-MM-DD') : null }));
  };

  const handleTagsChange = (_, newTags) => {
    setForm((prev) => ({ ...prev, tags: newTags }));
  };

  const handlePriorityChange = (_, newPriority) => {
    if (newPriority) setForm((prev) => ({ ...prev, priority: newPriority }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onUpdate(todo.id, form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      title: todo.title,
      description: todo.description || '',
      due_date: todo.due_date || null,
      category: todo.category || '',
      tags: todo.tags || [],
      priority: todo.priority || 'medium',
    });
    setEditing(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent>
          {editing ? (
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={form.title}
                onChange={handleFieldChange('title')}
                required
                fullWidth
                size="small"
                inputProps={{ 'aria-label': 'Edit task title' }}
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={handleFieldChange('description')}
                multiline
                rows={2}
                fullWidth
                size="small"
                inputProps={{ 'aria-label': 'Edit task description' }}
              />
              <DatePicker
                label="Due Date"
                value={form.due_date ? dayjs(form.due_date) : null}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
              <FormControl fullWidth size="small">
                <InputLabel id={`edit-category-label-${todo.id}`}>Category</InputLabel>
                <Select
                  labelId={`edit-category-label-${todo.id}`}
                  label="Category"
                  value={form.category}
                  onChange={handleFieldChange('category')}
                  aria-label="Category"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={form.tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip key={option} label={option} size="small" {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Add tags" size="small" />
                )}
              />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Priority
                </Typography>
                <ToggleButtonGroup
                  value={form.priority}
                  exclusive
                  onChange={handlePriorityChange}
                  aria-label="Priority"
                  size="small"
                >
                  {PRIORITIES.map((p) => (
                    <ToggleButton key={p} value={p} aria-label={PRIORITY_LABELS[p]}>
                      {PRIORITY_LABELS[p]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <IconButton onClick={handleCancel} size="small" aria-label="Cancel edit" color="default">
                  <CancelIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleSave} size="small" aria-label="Save task" color="primary">
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          ) : (
            <Box display="flex" alignItems="flex-start" gap={1}>
              <Checkbox
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                color="secondary"
              />
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={completedStyle}
                  component="div"
                >
                  {todo.title}
                </Typography>
                {todo.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ...completedStyle }}>
                    {todo.description}
                  </Typography>
                )}
                <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mt: 0.75 }} alignItems="center">
                  {todo.priority && (
                    <Chip
                      label={PRIORITY_LABELS[todo.priority]}
                      size="small"
                      color={PRIORITY_COLOR_MAP[todo.priority] || 'default'}
                      variant="outlined"
                    />
                  )}
                  {todo.category && (
                    <Chip label={todo.category} size="small" color="secondary" variant="outlined" />
                  )}
                  {(todo.tags || []).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                  {todo.due_date && (
                    <Typography variant="caption" color="text.secondary">
                      Due: {todo.due_date}
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton
                  size="small"
                  onClick={() => setEditing(true)}
                  aria-label="Edit task"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(todo.id)}
                  aria-label="Delete task"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default TaskCard;
