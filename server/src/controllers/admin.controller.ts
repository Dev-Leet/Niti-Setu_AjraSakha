import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/index.js';
import { User, Scheme, EligibilityCheck } from '@models/index.js';

export const adminController = {
  async getUsers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-passwordHash');
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }, 

  async createScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheme = await Scheme.create(req.body);
      res.status(201).json({ success: true, data: scheme });
    } catch (error) {
      next(error);
    }
  },

  async updateScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ success: true, data: scheme });
    } catch (error) {
      next(error);
    }
  },

  async deleteScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await Scheme.findByIdAndDelete(id);
      res.json({ success: true, data: { message: 'Scheme deleted' } });
    } catch (error) {
      next(error);
    }
  },

  async getDashboardStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalUsers,
        totalSchemes,
        totalChecks,
        popularSchemes,
      ] = await Promise.all([
        User.countDocuments(),
        Scheme.countDocuments({ status: 'active' }),
        EligibilityCheck.countDocuments(),
        EligibilityCheck.aggregate([
          { $unwind: '$results' },
          { $group: { _id: '$results.schemeId', count: { $sum: 1 }, name: { $first: '$results.schemeName' } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

      const avgProcessingTime = await EligibilityCheck.aggregate([
        { $group: { _id: null, avg: { $avg: '$processingTime' } } },
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalSchemes,
          totalChecks,
          avgProcessingTime: avgProcessingTime[0]?.avg || 0,
          popularSchemes,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};