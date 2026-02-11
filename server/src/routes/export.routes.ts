import { Router } from 'express';
import { exportController } from '@controllers/export.controller.js';
import { authenticate } from '@middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/csv/:checkId', exportController.exportCSV);
router.get('/pdf/:checkId', exportController.exportPDF);

export default router;