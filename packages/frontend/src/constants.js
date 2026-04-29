export const API_BASE = '/api/todos';

export const PRIORITIES = ['high', 'medium', 'low'];

export const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'category', label: 'Category' },
];

export const DEFAULT_CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Finance',
  'Other',
];
