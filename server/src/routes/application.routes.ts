import { Router, Response, NextFunction } from 'express';
import { applicationTrackerService } from '@services/application/tracker.service.js';
import { authenticate, AuthRequest } from '@middleware/auth.middleware.js';

const router = Router();

router.post('/submit', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { schemeId, schemeName } = req.body;

    if (!schemeId || !schemeName) {
      res.status(400).json({ success: false, message: 'Scheme ID and name required' });
      return;
    }

    const application = await applicationTrackerService.createApplication(
      req.userId!,
      schemeId,
      schemeName
    );

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.get('/my-applications', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applications = await applicationTrackerService.getApplicationsByUser(req.userId!);
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
});

router.get('/:applicationId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applicationId = Array.isArray(req.params.applicationId) ? req.params.applicationId[0] : req.params.applicationId;
    const application = await applicationTrackerService.getApplicationById(applicationId);

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.put('/:applicationId/status', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applicationId = Array.isArray(req.params.applicationId) ? req.params.applicationId[0] : req.params.applicationId;
    const { status, notes } = req.body;

    const application = await applicationTrackerService.updateApplicationStatus(
      applicationId,
      status,
      notes
    );

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

export default router;