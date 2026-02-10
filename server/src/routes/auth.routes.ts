import { Router } from 'express';
import { authController } from '@controllers/auth.controller.js';
import { validateRequest } from '@middleware/validateRequest.js';
import { loginSchema, registerSchema } from '@validators/auth.validator.js';
import { authLimiter } from '@middleware/rateLimiter.js';
import { authenticate } from '@middleware/auth.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;