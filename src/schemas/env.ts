import { z } from 'zod';

export const env = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'staging', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.trim().split(','))
    .default(['http://localhost:3000']),
  LIMIT: z.coerce.number().default(100),
  LIMIT_MESSAGE: z
    .string()
    .default('Too many requests from this IP, please try again later.'),
  // Add other environment variables as needed
});

export type Env = z.infer<typeof env>;
