import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  landholding: z.object({
    totalArea: z.number().positive('Area must be positive'),
    ownershipType: z.enum(['owned', 'leased', 'shared']),
    irrigationType: z.string().optional(),
  }),
  cropTypes: z.array(z.string()).min(1, 'At least one crop required'),
  socialCategory: z.enum(['General', 'SC', 'ST', 'OBC']),
  bankDetails: z.object({
    accountNumber: z.string(),
    ifscCode: z.string(),
    bankName: z.string(),
  }).optional(),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Invalid Aadhar number').optional(),
});