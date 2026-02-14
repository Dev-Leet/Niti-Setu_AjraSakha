import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.middleware.js';
import { AuditLog } from '@models/AuditLog.model.js';

export const auditController = {
  async getLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 50, offset = 0, resource, userId } = req.query;
      const query: any = {};
      if (resource) query.resource = resource;
      if (userId) query.userId = userId;

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(Number(limit))
        .skip(Number(offset));

      const total = await AuditLog.countDocuments(query);
 
      res.json({ success: true, data: logs, total });
    } catch (error) {
      next(error);
    }
  },
};