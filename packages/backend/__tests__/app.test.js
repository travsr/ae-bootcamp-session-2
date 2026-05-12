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
});