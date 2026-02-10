import { Router } from 'express';
import multer from 'multer';
import { voiceController } from '@controllers/voice.controller.js';
import { authenticate } from '@middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(authenticate);

router.post('/transcribe', upload.single('audio'), voiceController.transcribe);
router.post('/extract', voiceController.extractProfile);

export default router;