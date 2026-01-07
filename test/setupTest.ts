import { afterEach, vi } from 'vitest';

// Cleaners run after each test (no need to add them manually)
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.resetModules();
  vi.useRealTimers();
});

vi.stubEnv('NODE_ENV', 'test');

// Stub your other environment variables here as needed
