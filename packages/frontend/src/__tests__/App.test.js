import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../components/SudokuGame', () => () => <div data-testid="sudoku-game" />);

describe('App Component', () => {
  test('renders the header', () => {
    render(<App />);
    expect(screen.getByText('AI Bootcamp Capstone')).toBeInTheDocument();
    expect(screen.getByText('Your project starts here')).toBeInTheDocument();
  });

  test('renders SudokuGame as main content', () => {
    render(<App />);
    expect(screen.getByTestId('sudoku-game')).toBeInTheDocument();
  });
});