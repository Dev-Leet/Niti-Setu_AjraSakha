import { Response, NextFunction } from 'express';
import { AuthRequest } from '@middleware/auth.js';
import { User } from '@models/User.js';
import { Scheme } from '@models/Scheme.js';

export const adminController = {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-passwordHash');

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  async createScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheme = await Scheme.create(req.body);

      res.status(201).json({
        success: true,
        data: scheme,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true });

      res.json({
        success: true,
        data: scheme,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteScheme(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await Scheme.findByIdAndDelete(id);

      res.json({
        success: true,
        data: { message: 'Scheme deleted' },
      });
    } catch (error) {
      next(error);
    }
  },
};