import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { AuditLog } from '@models/AuditLog.model.js';

const AUDITABLE_ACTIONS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const auditLog = (resource: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!AUDITABLE_ACTIONS.includes(req.method) || !req.userId) {
      return next();
    }

    const originalSend = res.send;
    res.send = function (data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        AuditLog.create({
          userId: req.userId,
          action: `${req.method} ${req.path}`,
          resource,
          resourceId: resourceId || undefined,
          changes: req.body,
          metadata: { status: res.statusCode },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        }).catch(err => console.error('Audit log failed:', err));
      }
      return originalSend.call(this, data);
    };

    next();
  };
};