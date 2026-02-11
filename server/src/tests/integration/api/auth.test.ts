import request from 'supertest';
import { app } from '@/app.js';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login existing user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });
});