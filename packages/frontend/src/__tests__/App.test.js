import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../components/SudokuGame', () => () => <div data-testid="sudoku-game" />);

describe('App Component', () => {
  test('renders the header', () => {
    render(<App />);
    expect(screen.getByText('Sudoku')).toBeInTheDocument();
    expect(screen.getByText('Test your logic skills!')).toBeInTheDocument();
  });

  test('renders SudokuGame as main content', () => {
    render(<App />);
    expect(screen.getByTestId('sudoku-game')).toBeInTheDocument();
  });
});