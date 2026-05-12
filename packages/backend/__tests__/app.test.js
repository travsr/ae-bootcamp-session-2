const request = require('supertest');
const { app } = require('../src/app');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/hello', () => {
    it('should return a hello message', async () => {
      const response = await request(app).get('/api/hello');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/status', () => {
    it('should return status and timestamp', async () => {
      const response = await request(app).get('/api/status');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/sudoku', () => {
    it('returns 200 with puzzle, solution, and difficulty for easy', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=easy');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('puzzle');
      expect(response.body).toHaveProperty('solution');
      expect(response.body).toHaveProperty('difficulty', 'easy');
    });

    it('returns 200 with correct shape for medium', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=medium');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('puzzle');
      expect(response.body).toHaveProperty('solution');
      expect(response.body).toHaveProperty('difficulty', 'medium');
    });

    it('returns 200 with correct shape for hard', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=hard');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('puzzle');
      expect(response.body).toHaveProperty('solution');
      expect(response.body).toHaveProperty('difficulty', 'hard');
    });

    it('defaults to medium when no difficulty param is provided', async () => {
      const response = await request(app).get('/api/sudoku');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('difficulty', 'medium');
    });

    it('defaults to medium for an invalid difficulty param', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=invalid');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('difficulty', 'medium');
    });

    it('returns puzzle as a 9x9 nested array', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=easy');
      const { puzzle } = response.body;
      expect(Array.isArray(puzzle)).toBe(true);
      expect(puzzle).toHaveLength(9);
      puzzle.forEach(row => {
        expect(Array.isArray(row)).toBe(true);
        expect(row).toHaveLength(9);
      });
    });

    it('returns solution as a 9x9 nested array with no zeros', async () => {
      const response = await request(app).get('/api/sudoku?difficulty=easy');
      const { solution } = response.body;
      expect(Array.isArray(solution)).toBe(true);
      expect(solution).toHaveLength(9);
      solution.forEach(row => {
        expect(Array.isArray(row)).toBe(true);
        expect(row).toHaveLength(9);
        row.forEach(cell => expect(cell).not.toBe(0));
      });
    });
  });
});