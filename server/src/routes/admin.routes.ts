import { Router } from 'express';
import { adminController } from '@controllers/admin.controller.js';
import { authenticate, authorize } from '@middleware/auth.middleware.js';
import { auditLog } from '@middleware/audit.middleware.js';

const router = Router(); 

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.getUsers);
router.post('/schemes', adminController.createScheme);
router.put('/schemes/:id', adminController.updateScheme);
router.delete('/schemes/:id', adminController.deleteScheme);

router.post('/schemes', auditLog('scheme'), adminController.createScheme);
router.put('/schemes/:id', auditLog('scheme'), adminController.updateScheme);
router.delete('/schemes/:id', auditLog('scheme'), adminController.deleteScheme);

export default router;