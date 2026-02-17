import { z } from 'zod';

export const vehicleSchema = z.object({
  model: z.string().min(3),
  year: z.number().int().positive().min(1950),
  displacement: z.number().int().positive().min(2),
  active: z.boolean().default(true),
  brandId: z.number().int().positive(),
});

export type VehicleSchema = z.infer<typeof vehicleSchema>;
