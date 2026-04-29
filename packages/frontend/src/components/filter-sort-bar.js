import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { PRIORITIES, PRIORITY_LABELS, DEFAULT_CATEGORIES, SORT_OPTIONS } from '../constants';

function FilterSortBar({ filters, sortBy, onFilterChange, onSortChange }) {
  const handleFilterChange = (field) => (e) => {
    onFilterChange({ ...filters, [field]: e.target.value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
        Filter &amp; Sort
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="flex-end">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="filter-category-label">Category</InputLabel>
          <Select
            labelId="filter-category-label"
            label="Category"
            value={filters.category || ''}
            onChange={handleFilterChange('category')}
            aria-label="Filter by category"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {DEFAULT_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="filter-priority-label">Priority</InputLabel>
          <Select
            labelId="filter-priority-label"
            label="Priority"
            value={filters.priority || ''}
            onChange={handleFilterChange('priority')}
            aria-label="Filter by priority"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>{PRIORITY_LABELS[p]}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            label="Status"
            value={filters.completed !== undefined ? String(filters.completed) : ''}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                ...filters,
                completed: val === '' ? undefined : val === 'true',
              });
            }}
            aria-label="Filter by completion status"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="false">Incomplete</MenuItem>
            <MenuItem value="true">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort By"
            value={sortBy || 'created_at'}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort tasks"
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {(filters.category || filters.priority || filters.completed !== undefined) && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {filters.category && (
              <Chip
                label={`Category: ${filters.category}`}
                size="small"
                onDelete={() => onFilterChange({ ...filters, category: '' })}
              />
            )}
            {filters.priority && (
              <Chip
                label={`Priority: ${PRIORITY_LABELS[filters.priority]}`}
                size="small"
                onDelete={() => onFilterChange({ ...filters, priority: '' })}
              />
            )}
            {filters.completed !== undefined && (
              <Chip
                label={`Status: ${filters.completed ? 'Completed' : 'Incomplete'}`}
                size="small"
                onDelete={() => {
                  const updated = { ...filters };
                  delete updated.completed;
                  onFilterChange(updated);
                }}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default FilterSortBar;
