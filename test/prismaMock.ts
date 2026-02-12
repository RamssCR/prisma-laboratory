import { vi } from 'vitest';
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended';
import type { PrismaClient } from 'generated/prisma/client';

/**
 * REGLA DE ORO EN VITEST:
 * Las variables usadas dentro de `vi.mock` DEBEN empezar con la palabra "mock".
 * Vitest las elevará automáticamente después de los imports, evitando el ReferenceError.
 */
export const mockPrisma = mockDeep<PrismaClient>();

vi.mock('../src/config/db', () => ({
  // Exportamos tanto la propiedad 'prisma' como el 'default'
  // para cubrir cualquier forma en que lo importes en tu código.
  prisma: mockPrisma,
  default: mockPrisma,
}));

// Exportamos un alias para que tus tests lo sigan reconociendo como prismaMock si quieres
export const prismaMock = mockPrisma as unknown as DeepMockProxy<PrismaClient>;
