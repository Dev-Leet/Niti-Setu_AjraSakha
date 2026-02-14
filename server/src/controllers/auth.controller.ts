import { Request, Response, NextFunction } from 'express';
import { User } from '@models/index.js';
import { AuthRequest } from '@middleware/index.js';
import { AppError } from '@utils/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@utils/index.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, phone } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');
      } 

      const user = await User.create({ email, passwordHash: password, phone, role: 'farmer' });

      const accessToken = generateAccessToken(user._id.toString(), user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+passwordHash');
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      if (!user.isActive) {
        throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
      }

      user.lastLogin = new Date();
      await user.save();

      const accessToken = generateAccessToken(user._id.toString(), user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new AppError('Refresh token required', 401);
      }

      const { userId } = verifyRefreshToken(token);
      const user = await User.findById(userId);

      if (!user || !user.isActive) {
        throw new AppError('Invalid token', 401);
      }

      const accessToken = generateAccessToken(user._id.toString(), user.role);

      res.json({ success: true, data: { accessToken } });
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('refreshToken');
      res.json({ success: true, data: { message: 'Logged out successfully' } });
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};