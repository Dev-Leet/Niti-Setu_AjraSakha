import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { voiceService } from '@services/voice.service.js';
import { voiceValidationService } from '@services/voice/validation.service.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/transcribe', authenticate, upload.single('audio'), async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      message: 'Server-side transcription not available. Use browser Web Speech API on client.',
    });
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