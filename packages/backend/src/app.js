const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// Example: GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Example: GET /api/status
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = { app };