import { z } from 'zod';

export const compatibilitySchema = z.object({
  productId: z.number().int().positive(),
  vehicleId: z.array(z.number()),
  notes: z.string().min(3).optional(),
  active: z.boolean().default(true),
});

export type CompatibilitySchema = z.infer<typeof compatibilitySchema>;
