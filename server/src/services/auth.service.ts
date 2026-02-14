import { User } from '@models/index.js';
import { AppError } from '@utils/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@utils/index.js';

interface CreateUserDTO {
  email: string;
  password: string;
  phone?: string;
  role?: 'farmer' | 'admin' | 'auditor';
}

export const authService = {
  async register(userData: CreateUserDTO) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');
    } 

    const user = await User.create({
      email: userData.email,
      passwordHash: userData.password,
      phone: userData.phone,
      role: userData.role || 'farmer',
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    return { user, accessToken, refreshToken };
  },

  async login(email: string, password: string) {
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

    return { user, accessToken, refreshToken };
  },

  async refreshToken(token: string) {
    const { userId } = verifyRefreshToken(token);
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError('Invalid token', 401);
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    return { accessToken };
  },
};