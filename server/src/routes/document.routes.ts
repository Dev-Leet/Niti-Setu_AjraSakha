import { Router } from 'express';
import multer from 'multer';
import { documentController } from '@controllers/document.controller.js';
import { authenticate, requireRole } from '@middleware/auth.middleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.post('/upload', upload.single('pdf'), documentController.uploadPDF);
router.get('/scheme/:schemeId', documentController.getPDFsByScheme);
router.delete('/:id', documentController.deletePDF);

export default router; 