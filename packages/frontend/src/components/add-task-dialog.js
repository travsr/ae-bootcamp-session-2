import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PRIORITIES, PRIORITY_LABELS, DEFAULT_CATEGORIES } from '../constants';

const INITIAL_FORM = {
  title: '',
  description: '',
  due_date: null,
  category: '',
  tags: [],
  priority: 'medium',
};

function AddTaskDialog({ open, onClose, onAdd }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [titleError, setTitleError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'title') setTitleError('');
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

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setTitleError('Title is required');
      return;
    }
    onAdd(form);
    setForm(INITIAL_FORM);
    setTitleError('');
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setTitleError('');
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="add-task-dialog-title">
        <DialogTitle id="add-task-dialog-title">Add New Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={handleChange('title')}
              error={!!titleError}
              helperText={titleError}
              required
              fullWidth
              inputProps={{ 'aria-label': 'Task title' }}
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
              fullWidth
              inputProps={{ 'aria-label': 'Task description' }}
            />
            <DatePicker
              label="Due Date"
              value={form.due_date ? dayjs(form.due_date) : null}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={form.category}
                onChange={handleChange('category')}
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
                  <Chip
                    key={option}
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add tags" />
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary" aria-label="Cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Add task">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default AddTaskDialog;
