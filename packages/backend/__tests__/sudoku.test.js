const {
  isValid,
  generateSolvedGrid,
  countSolutions,
  generatePuzzle,
} = require('../src/sudoku');

// Helper: count non-zero cells in a 9×9 grid
function countClues(grid) {
  return grid.reduce((sum, row) => sum + row.filter(v => v !== 0).length, 0);
}

// Helper: verify every row/col/box contains 1-9 exactly once
function isFullyValid(grid) {
  const expected = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Rows
  for (let r = 0; r < 9; r++) {
    if (!setsEqual(new Set(grid[r]), expected)) return false;
  }

  // Columns
  for (let c = 0; c < 9; c++) {
    const col = grid.map(row => row[c]);
    if (!setsEqual(new Set(col), expected)) return false;
  }

  // 3×3 boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          box.push(grid[r][c]);
        }
      }
      if (!setsEqual(new Set(box), expected)) return false;
    }
  }

  return true;
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

describe('isValid', () => {
  it('returns false when a duplicate exists in the same row', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    grid[0][0] = 5;
    expect(isValid(grid, 0, 4, 5)).toBe(false);
  });

  it('returns false when a duplicate exists in the same column', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    grid[0][3] = 7;
    expect(isValid(grid, 4, 3, 7)).toBe(false);
  });

  it('returns false when a duplicate exists in the same 3×3 box', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    grid[0][0] = 3;
    expect(isValid(grid, 2, 2, 3)).toBe(false);
  });

  it('returns true for a valid placement', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    grid[0][0] = 1;
    grid[1][1] = 2;
    expect(isValid(grid, 2, 2, 3)).toBe(true);
  });
});

describe('generateSolvedGrid', () => {
  it('returns a 9×9 array', () => {
    const grid = generateSolvedGrid();
    expect(grid).toHaveLength(9);
    grid.forEach(row => expect(row).toHaveLength(9));
  });

  it('every row contains digits 1–9 exactly once', () => {
    const grid = generateSolvedGrid();
    for (let r = 0; r < 9; r++) {
      expect(new Set(grid[r]).size).toBe(9);
      expect(Math.min(...grid[r])).toBe(1);
      expect(Math.max(...grid[r])).toBe(9);
    }
  });

  it('every column contains digits 1–9 exactly once', () => {
    const grid = generateSolvedGrid();
    for (let c = 0; c < 9; c++) {
      const col = grid.map(row => row[c]);
      expect(new Set(col).size).toBe(9);
    }
  });

  it('every 3×3 box contains digits 1–9 exactly once', () => {
    const grid = generateSolvedGrid();
    expect(isFullyValid(grid)).toBe(true);
  });
});

describe('countSolutions', () => {
  it('returns 1 for a known uniquely-solvable puzzle', () => {
    // A well-known minimal puzzle with a unique solution
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('returns > 1 for an under-constrained grid', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    expect(countSolutions(grid, 2)).toBeGreaterThan(1);
  });
});

describe('generatePuzzle', () => {
  it('easy: clue count is within 34–38', () => {
    const { puzzle } = generatePuzzle('easy');
    const clues = countClues(puzzle);
    expect(clues).toBeGreaterThanOrEqual(34);
    expect(clues).toBeLessThanOrEqual(38);
  });

  it('medium: clue count is within 28–32', () => {
    const { puzzle } = generatePuzzle('medium');
    const clues = countClues(puzzle);
    expect(clues).toBeGreaterThanOrEqual(28);
    expect(clues).toBeLessThanOrEqual(32);
  });

  it('hard: clue count is within 22–26', () => {
    const { puzzle } = generatePuzzle('hard');
    const clues = countClues(puzzle);
    expect(clues).toBeGreaterThanOrEqual(22);
    expect(clues).toBeLessThanOrEqual(26);
  });

  it('solution is a fully solved valid grid', () => {
    const { solution } = generatePuzzle('easy');
    expect(isFullyValid(solution)).toBe(true);
  });

  it('solution clues match the puzzle clues', () => {
    const { puzzle, solution } = generatePuzzle('medium');
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== 0) {
          expect(solution[r][c]).toBe(puzzle[r][c]);
        }
      }
    }
  });
});
