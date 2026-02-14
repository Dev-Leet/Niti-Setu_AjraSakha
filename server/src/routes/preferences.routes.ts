import { Router } from 'express';
import { preferencesController } from '@controllers/preferences.controller.js';
import { authenticate } from '@middleware/index.js';

const router = Router();

router.get('/', authenticate, preferencesController.get);
router.put('/', authenticate, preferencesController.update);

export default router;