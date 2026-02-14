import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import eligibilityRoutes from './eligibility.routes.js';
import schemeRoutes from './scheme.routes.js';
import voiceRoutes from './voice.routes.js';
import documentRoutes from './document.routes.js';
import analyticsRoutes from './analytics.routes.js';
import adminRoutes from './admin.routes.js';
import exportRoutes from './export.routes.js';
import preferencesRoutes from './preferences.routes.js';
import healthRoutes from './health.routes.js';

const router = Router(); 

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/schemes', schemeRoutes);
router.use('/voice', voiceRoutes);
router.use('/documents', documentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/export', exportRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/health', healthRoutes);

export default router;