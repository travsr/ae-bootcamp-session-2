import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SudokuGame from '../components/SudokuGame';

// Minimal fully-solved puzzle to use in API responses
function makeSolvedPuzzle() {
  const solution = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => ((r * 9 + c) % 9) + 1)
  );
  // One empty cell so the board isn't immediately "complete"
  const puzzle = solution.map(row => [...row]);
  puzzle[0][0] = 0;
  return { puzzle, solution };
}

function mockFetchSuccess(data) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockFetchFailure() {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));
}

describe('SudokuGame Component', () => {
  afterEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  test('on mount only the difficulty selector is shown — no board and no loading indicator', () => {
    render(<SudokuGame />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('clicking a difficulty button triggers an API call with the correct difficulty param', async () => {
    const { puzzle, solution } = makeSolvedPuzzle();
    mockFetchSuccess({ puzzle, solution });

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Medium'));

    expect(global.fetch).toHaveBeenCalledWith('/api/sudoku?difficulty=medium');
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  test('while the API call is pending a loading indicator is visible', async () => {
    let resolveRequest;
    global.fetch = jest.fn().mockReturnValue(
      new Promise(resolve => {
        resolveRequest = resolve;
      })
    );

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Easy'));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Clean up by resolving the promise
    const { puzzle, solution } = makeSolvedPuzzle();
    resolveRequest({ ok: true, json: () => Promise.resolve({ puzzle, solution }) });
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  test('after a successful API response the board is rendered and loading indicator is gone', async () => {
    const { puzzle, solution } = makeSolvedPuzzle();
    mockFetchSuccess({ puzzle, solution });

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Hard'));

    await waitFor(() => expect(screen.getAllByRole('textbox').length).toBe(81));
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  test('after the board calls onComplete the success message and Play Again button are shown', async () => {
    const { puzzle, solution } = makeSolvedPuzzle();
    mockFetchSuccess({ puzzle, solution });

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() => expect(screen.getAllByRole('textbox').length).toBe(81));

    // Fill the only empty cell (0,0) with the correct value
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: String(solution[0][0]) } });

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('clicking Play Again triggers a new API call and returns to playing state', async () => {
    const { puzzle, solution } = makeSolvedPuzzle();
    mockFetchSuccess({ puzzle, solution });

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() => expect(screen.getAllByRole('textbox').length).toBe(81));

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: String(solution[0][0]) } });
    expect(screen.getByText('Play Again')).toBeInTheDocument();

    mockFetchSuccess({ puzzle, solution });
    fireEvent.click(screen.getByText('Play Again'));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getAllByRole('textbox').length).toBe(81));
    expect(screen.queryByText(/congratulations/i)).not.toBeInTheDocument();
  });

  test('when the API returns an error an error message is displayed', async () => {
    mockFetchFailure();

    render(<SudokuGame />);
    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() =>
      expect(screen.getByText(/failed to load puzzle/i)).toBeInTheDocument()
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
