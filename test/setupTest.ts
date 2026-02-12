import { afterEach, vi } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from './prismaMock';

// Cleaners run after each test (no need to add them manually)
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.resetModules();
  vi.useRealTimers();
  mockReset(prismaMock);
});

vi.stubEnv('NODE_ENV', 'test');

// Stub your other environment variables here as needed
