/**
 * Sudoku Engine
 * Pure JS module — no external libraries, no database access.
 */

/**
 * Returns true if placing `num` at grid[row][col] is valid
 * (no duplicate in the same row, column, or 3×3 box).
 * @param {number[][]} grid
 * @param {number} row
 * @param {number} col
 * @param {number} num
 * @returns {boolean}
 */
function isValid(grid, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // Check 3×3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Shuffle an array in place using Fisher-Yates.
 * @param {any[]} arr
 * @returns {any[]}
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Deep-clone a 9×9 grid.
 * @param {number[][]} grid
 * @returns {number[][]}
 */
function cloneGrid(grid) {
  return grid.map(row => row.slice());
}

/**
 * Fills `grid` using randomized backtracking. Returns true if successful.
 * @param {number[][]} grid
 * @returns {boolean}
 */
function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Generate a fully solved, randomised 9×9 grid.
 * @returns {number[][]}
 */
function generateSolvedGrid() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(grid);
  return grid;
}

/**
 * Count solutions up to `limit`. Stops early once `limit` is reached.
 * @param {number[][]} grid
 * @param {number} [limit=2]
 * @returns {number}
 */
function countSolutions(grid, limit = 2) {
  let count = 0;

  function solve(g) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(g, row, col, num)) {
              g[row][col] = num;
              solve(g);
              g[row][col] = 0;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve(cloneGrid(grid));
  return count;
}

/**
 * Clue targets by difficulty.
 */
const CLUE_TARGETS = {
  easy: 36,
  medium: 30,
  hard: 24,
};

/**
 * Remove cells from a solved grid to produce a puzzle with approximately
 * the target number of clue cells. Preserves uniqueness of solution.
 * @param {number[][]} solvedGrid
 * @param {'easy'|'medium'|'hard'} difficulty
 * @returns {number[][]}
 */
function removeCells(solvedGrid, difficulty) {
  const target = CLUE_TARGETS[difficulty] || CLUE_TARGETS.easy;
  const puzzle = cloneGrid(solvedGrid);

  // Build a shuffled list of all 81 cell positions
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  let clues = 81;
  let attempts = 0;
  const MAX_ATTEMPTS = 150;

  for (const [r, c] of positions) {
    if (clues <= target) break;
    if (attempts >= MAX_ATTEMPTS) break;

    attempts++;
    const saved = puzzle[r][c];
    puzzle[r][c] = 0;

    if (countSolutions(puzzle, 2) !== 1) {
      // Restore — removing this cell breaks uniqueness
      puzzle[r][c] = saved;
    } else {
      clues--;
    }
  }

  return puzzle;
}

/**
 * Generate a sudoku puzzle of the given difficulty.
 * @param {'easy'|'medium'|'hard'} difficulty
 * @returns {{ puzzle: number[][], solution: number[][] }}
 */
function generatePuzzle(difficulty) {
  const solution = generateSolvedGrid();
  const puzzle = removeCells(solution, difficulty);
  return { puzzle, solution };
}

module.exports = {
  isValid,
  generateSolvedGrid,
  countSolutions,
  removeCells,
  generatePuzzle,
};
