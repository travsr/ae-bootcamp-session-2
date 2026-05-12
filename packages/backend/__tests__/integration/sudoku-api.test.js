const request = require('supertest');
const { app } = require('../../src/app');

describe('Integration: GET /api/sudoku', () => {
  ['easy', 'medium', 'hard'].forEach(difficulty => {
    it(`returns correct structure for difficulty=${difficulty}`, async () => {
      const response = await request(app).get(`/api/sudoku?difficulty=${difficulty}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('difficulty', difficulty);

      const { puzzle, solution } = response.body;

      // Both are 9x9 arrays
      expect(Array.isArray(puzzle)).toBe(true);
      expect(puzzle).toHaveLength(9);
      expect(Array.isArray(solution)).toBe(true);
      expect(solution).toHaveLength(9);
      puzzle.forEach(row => expect(row).toHaveLength(9));
      solution.forEach(row => expect(row).toHaveLength(9));
    });
  });

  it('returns medium difficulty when param is invalid', async () => {
    const response = await request(app).get('/api/sudoku?difficulty=extreme');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('difficulty', 'medium');
  });

  it('solution cells are all non-zero', async () => {
    const response = await request(app).get('/api/sudoku?difficulty=medium');
    const { solution } = response.body;
    solution.forEach(row => {
      row.forEach(cell => expect(cell).toBeGreaterThan(0));
    });
  });

  it('clue cells in puzzle match corresponding cells in solution', async () => {
    const response = await request(app).get('/api/sudoku?difficulty=easy');
    const { puzzle, solution } = response.body;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== 0) {
          expect(puzzle[r][c]).toBe(solution[r][c]);
        }
      }
    }
  });
});
