import { Router } from 'express';
import { schemeController } from '@controllers/scheme.controller.js';
import { authenticate } from '@middleware/index.js';

const router = Router();

router.get('/', schemeController.getAll);
router.get('/:schemeId', schemeController.getById);
router.post('/save', authenticate, schemeController.saveScheme);
router.get('/saved/all', authenticate, schemeController.getSavedSchemes);

export default router; 