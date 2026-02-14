import { Router } from 'express';
import { eligibilityController } from '@controllers/eligibility.controller.js';
import { authenticate } from '@middleware/auth.middleware.js';
import { eligibilityLimiter } from '@middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/check', eligibilityLimiter, eligibilityController.checkEligibility);
router.get('/history', eligibilityController.getHistory);
router.get('/:id', eligibilityController.getCheckById);

export default router; 