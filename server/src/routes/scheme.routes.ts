import { Router } from 'express';
import { schemeController } from '@controllers/scheme.controller.js';
import { authenticate } from '@middleware/auth.js';

const router = Router();

router.get('/', schemeController.getAll);
router.get('/:id', schemeController.getById);

router.use(authenticate);
router.post('/save', schemeController.save);
router.get('/saved/all', schemeController.getSaved);

export default router;