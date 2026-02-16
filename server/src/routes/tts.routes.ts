import { Router, Response, NextFunction } from 'express';
import { ttsService } from '@services/tts/tts.service.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.post('/speak', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Text is required' });
      return;
    }

    if (!['en', 'hi', 'mr', 'ta'].includes(language)) {
      res.status(400).json({ success: false, message: 'Invalid language' });
      return;
    }

    const audioBuffer = await ttsService.generateSpeech({ text, language });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    next(error);
  }
});

router.post('/stream', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Text is required' });
      return;
    }

    const audioStream = await ttsService.streamSpeech({ text, language });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });

    audioStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;