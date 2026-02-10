import { Router } from 'express';
import { eligibilityController } from '@controllers/eligibility.controller.js';
import { authenticate } from '@middleware/auth.js';
import { eligibilityLimiter } from '@middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

router.post('/check', eligibilityLimiter, eligibilityController.checkEligibility);
router.get('/history', eligibilityController.getHistory);
router.get('/:id', eligibilityController.getCheckById);

export default router;