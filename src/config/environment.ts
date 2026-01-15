import { env } from '#schemas/env';
import { treeifyError } from 'zod';
import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';

if (process.env.NODE_ENV !== 'development')
  loadEnvFile(resolve(process.cwd(), '.env'));

const parsed = env.safeParse(process.env);

if (!parsed.success) {
  console.error(treeifyError(parsed.error)?.properties);
  process.exit(1);
}

export const {
  NODE_ENV,
  ALLOWED_ORIGINS,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  LIMIT,
  LIMIT_MESSAGE,
  PORT,
  DATABASE_URL,
} = parsed.data;
