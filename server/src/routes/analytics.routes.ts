import { Router } from 'express';
import { analyticsController } from '@controllers/analytics.controller.js';
import { authenticate, authorize } from '@middleware/auth.middleware.js';


const router = Router();

router.use(authenticate);

router.get('/user/stats', analyticsController.getUserStats);
router.post('/track', analyticsController.trackEvent);

router.get('/system/stats', authorize('admin'), analyticsController.getSystemStats);

export default router;