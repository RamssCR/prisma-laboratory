import { z } from 'zod';

export const userSchema = z.object({
  email: z.email().max(255),
  name: z.string().min(3),
  password: z.string().min(6).max(128),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export type UserSchema = z.infer<typeof userSchema>;
