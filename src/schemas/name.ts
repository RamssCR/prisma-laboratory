import { z } from 'zod';

export const nameSchema = z.object({
  name: z.string().min(2).max(100),
  active: z.boolean().optional(),
});

export type NameSchema = z.infer<typeof nameSchema>;
