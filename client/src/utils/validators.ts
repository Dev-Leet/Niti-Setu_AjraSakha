import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
 
export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
 
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  totalArea: z.number().positive('Area must be positive'),
  cropTypes: z.array(z.string()).min(1, 'Select at least one crop'),
  socialCategory: z.enum(['General', 'SC', 'ST', 'OBC']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;