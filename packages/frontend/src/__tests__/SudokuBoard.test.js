import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SudokuBoard from '../components/SudokuBoard';

// Minimal 9x9 puzzle: cell (0,0) is a clue (5), cell (0,1) is empty (0).
// All remaining cells are filled as clues matching the solution.
function makePuzzle(overrides = {}) {
  const solution = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => ((r * 9 + c) % 9) + 1)
  );
  const puzzle = solution.map(row => [...row]);
  // Make (0,1) an empty cell
  puzzle[0][1] = 0;
  // Apply any additional empty cells from overrides
  for (const [key, val] of Object.entries(overrides)) {
    const [r, c] = key.split(',').map(Number);
    puzzle[r][c] = val;
  }
  return { puzzle, solution };
}

describe('SudokuBoard Component', () => {
  test('clue cells are rendered as read-only inputs with the correct value', () => {
    const { puzzle, solution } = makePuzzle();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={() => {}} />);
    // Cell (0,0) is a clue with value 1 (((0*9+0)%9)+1 = 1)
    const inputs = screen.getAllByRole('textbox');
    // First input (0,0) should have value "1" and be read-only
    expect(inputs[0].value).toBe('1');
    expect(inputs[0]).toHaveAttribute('readonly');
  });

  test('empty cells are rendered as editable inputs', () => {
    const { puzzle, solution } = makePuzzle();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={() => {}} />);
    const inputs = screen.getAllByRole('textbox');
    // Cell (0,1) is empty — index 1
    expect(inputs[1].value).toBe('');
    expect(inputs[1]).not.toHaveAttribute('readonly');
  });

  test('typing a wrong digit applies the error CSS class', () => {
    const { puzzle, solution } = makePuzzle();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={() => {}} />);
    const inputs = screen.getAllByRole('textbox');
    const emptyCell = inputs[1]; // cell (0,1), correct answer is solution[0][1] = 2
    // Type a wrong digit
    fireEvent.change(emptyCell, { target: { value: '9' } });
    expect(emptyCell).toHaveClass('sudoku-cell--error');
  });

  test('typing the correct digit does not apply the error CSS class', () => {
    const { puzzle, solution } = makePuzzle();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={() => {}} />);
    const inputs = screen.getAllByRole('textbox');
    const emptyCell = inputs[1]; // cell (0,1), correct answer is solution[0][1] = 2
    fireEvent.change(emptyCell, { target: { value: String(solution[0][1]) } });
    expect(emptyCell).not.toHaveClass('sudoku-cell--error');
  });

  test('onComplete is called when all empty cells are correctly filled', () => {
    const { puzzle, solution } = makePuzzle();
    const onComplete = jest.fn();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={onComplete} />);
    const inputs = screen.getAllByRole('textbox');
    const emptyCell = inputs[1]; // only one empty cell: (0,1)
    fireEvent.change(emptyCell, { target: { value: String(solution[0][1]) } });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('onComplete is not called when the board has incorrect values', () => {
    const { puzzle, solution } = makePuzzle();
    const onComplete = jest.fn();
    render(<SudokuBoard puzzle={puzzle} solution={solution} onComplete={onComplete} />);
    const inputs = screen.getAllByRole('textbox');
    const emptyCell = inputs[1];
    // Type a wrong digit
    const wrongDigit = solution[0][1] === 9 ? '1' : String(solution[0][1] + 1);
    fireEvent.change(emptyCell, { target: { value: wrongDigit } });
    expect(onComplete).not.toHaveBeenCalled();
  });
});
