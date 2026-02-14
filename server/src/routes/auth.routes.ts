import { Router } from 'express';
import { authController } from '@controllers/auth.controller.js';
import { validateRequest } from '@middleware/index.js';
import { registerSchema, loginSchema } from '@validators/auth.validator.js';
import { authLimiter } from '@middleware/index.js';
import { authenticate } from '@middleware/index.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router; 