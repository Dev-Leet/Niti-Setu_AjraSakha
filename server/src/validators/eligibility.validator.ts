import { z } from 'zod';

export const eligibilityCheckSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
}); 