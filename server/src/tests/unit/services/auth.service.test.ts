import { describe, it, expect, beforeEach } from '@jest/globals';
import { authService } from '../../../services/auth.service';
import { User } from '../../../models/index';

describe('Auth Service', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('register', () => {
    it('creates new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      const result = await authService.register(userData);
      
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('throws error for duplicate email', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      
      await authService.register(userData);
      
      await expect(authService.register(userData)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('authenticates valid credentials', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      const result = await authService.login('test@example.com', 'password123');
      
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
    });

    it('rejects invalid credentials', async () => {
      await expect(
        authService.login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
}); 