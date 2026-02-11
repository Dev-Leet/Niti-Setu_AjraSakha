import { Router } from 'express';
import { adminController } from '@controllers/admin.controller.js';
import { authenticate, authorize } from '@middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.getUsers);
router.post('/schemes', adminController.createScheme);
router.put('/schemes/:id', adminController.updateScheme);
router.delete('/schemes/:id', adminController.deleteScheme);

export default router;