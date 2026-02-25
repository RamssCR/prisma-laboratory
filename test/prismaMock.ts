import { vi } from 'vitest';
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended';
import type { PrismaClient } from 'generated/prisma/client';

/**
 * Las variables usadas dentro de `vi.mock` DEBEN empezar con la palabra "mock".
 * Vitest las elevará automáticamente después de los imports, evitando el ReferenceError.
 */
export const mockPrisma = mockDeep<PrismaClient>();

vi.mock('#config/db', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}));

export const prismaMock = mockPrisma as unknown as DeepMockProxy<PrismaClient>;
