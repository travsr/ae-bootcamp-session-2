import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCard from './task-card';

function TaskList({ todos, onUpdate, onDelete, onToggleComplete }) {
  if (todos.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        No tasks found. Add one above!
      </Typography>
    );
  }

  return (
    <Box>
      {todos.map((todo) => (
        <TaskCard
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </Box>
  );
}

export default TaskList;
