import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the header', () => {
    render(<App />);
    expect(screen.getByText('AI Bootcamp Capstone')).toBeInTheDocument();
    expect(screen.getByText('Your project starts here')).toBeInTheDocument();
  });

  test('renders the welcome section', () => {
    render(<App />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText(/clean starting point/i)).toBeInTheDocument();
  });
});