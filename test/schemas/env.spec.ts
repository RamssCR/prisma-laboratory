import { describe, expect, test } from 'vitest';
import { env } from '#schemas/env';

describe('Env Schema', () => {
  test('valid env passes validation', () => {
    const validEnv = {
      NODE_ENV: 'development' as const,
      PORT: 3000,
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'supersecretrefresh',
      JWT_EXPIRES_IN: '1h',
      JWT_REFRESH_EXPIRES_IN: '7d',
      LIMIT: 30,
      LIMIT_MESSAGE: 'Too many requests, please try again later.',
      ALLOWED_ORIGINS: 'http://localhost:3000, http://example.com',
      DEBUG: 'true',
    };
    expect(() => env.parse(validEnv)).not.toThrow();
  });

  test('debug is false', () => {
    const debugEnv = {
      NODE_ENV: 'development' as const,
      PORT: 3000,
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'supersecretrefresh',
      DEBUG: 'false',
    };
    const parsed = env.parse(debugEnv);
    expect(parsed.DEBUG).toBe(false);
  });

  test('invalid env fails validation', () => {
    const invalidEnv = {
      NODE_ENV: 'invalid_env',
      PORT: -1,
      JWT_SECRET: '',
      JWT_REFRESH_SECRET: '',
    };
    expect(() => env.parse(invalidEnv)).toThrow();
  });
});
