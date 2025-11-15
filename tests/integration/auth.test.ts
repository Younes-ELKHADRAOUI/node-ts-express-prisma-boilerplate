import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

describe('Authentication Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123',
    name: 'Test User',
  };

  describe('POST /auth/register', () => {
    it('should validate email format', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'invalid-email',
        password: 'TestPassword123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate password strength', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate name length', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'TestPassword123',
        name: 'T',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /auth/login', () => {
    it('should validate email format', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid-email',
        password: 'TestPassword123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /auth/password-reset/request', () => {
    it('should validate email format', async () => {
      const response = await request(app).post('/auth/password-reset/request').send({
        email: 'invalid-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should accept valid email without revealing if user exists', async () => {
      const response = await request(app).post('/auth/password-reset/request').send({
        email: 'nonexistent@example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('If the email exists');
    });
  });

  describe('POST /auth/password-reset/confirm', () => {
    it('should validate token requirement', async () => {
      const response = await request(app).post('/auth/password-reset/confirm').send({
        token: '',
        newPassword: 'NewPassword123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate new password strength', async () => {
      const response = await request(app).post('/auth/password-reset/confirm').send({
        token: 'some-token',
        newPassword: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
