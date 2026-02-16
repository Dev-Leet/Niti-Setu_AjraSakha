import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { voiceService } from '@services/voice.service.js';
import { voiceValidationService } from '@services/voice/validation.service.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/transcribe', authenticate, upload.single('audio'), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Audio file required' });
      return;
    }

    const language = (req.body.language as 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN') || 'en-IN';
    const transcript = await voiceService.transcribe(req.file.buffer, language);

    res.json({ success: true, data: { transcript } });
  } catch (error) {
    next(error);
  }
});

router.post('/extract', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      res.status(400).json({ success: false, message: 'Transcript is required' });
      return;
    }

    const extractedData = await voiceService.extractProfile(transcript);
    const validation = voiceValidationService.validateProfile(extractedData);

    res.json({
      success: true,
      data: {
        profile: extractedData,
        validation,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/validate', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = req.body;
    const validation = voiceValidationService.validateProfile(profile);

    res.json({ success: true, data: validation });
  } catch (error) {
    next(error);
  }
});

export default router;