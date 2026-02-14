import { z } from 'zod';

export const saveSchemeSchema = z.object({
  schemeId: z.string().min(1, 'Scheme ID is required'),
  notes: z.string().optional(),
}); 