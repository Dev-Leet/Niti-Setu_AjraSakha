import { authService } from '../../../services/auth.service.js';
import { User } from '../../../models/index.js';

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login existing user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.register(userData);
      const result = await authService.login(userData.email, userData.password);

      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});