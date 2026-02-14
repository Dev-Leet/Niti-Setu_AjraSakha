import { Router } from 'express';
import { profileController } from '@controllers/profile.controller.js';
import { authenticate } from '@middleware/auth.middleware.js';
import { validateRequest } from '@middleware/validation.middleware.js';
import { profileSchema } from '@validators/profile.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(profileSchema), profileController.create);
router.get('/', profileController.get);
router.patch('/', validateRequest(profileSchema.partial()), profileController.update);
router.delete('/', profileController.delete);

export default router; 