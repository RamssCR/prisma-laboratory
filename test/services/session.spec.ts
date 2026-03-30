import { hashValue } from '#libs/bcrypt';
import { create, findUnique, revoke, revokeAll } from '#services/session';
import { SEVEN_DAYS } from '#utils/constants';
import { prismaMock } from 'test/prismaMock';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('#libs/bcrypt', () => ({
  hashValue: vi.fn(),
}));

const rawToken = 'raw-token-123';
const hashedToken = 'hashed-token-xyz';
const now = new Date('2026-02-27T08:00:00Z');
const expectedExpiry = new Date(now.getTime() + SEVEN_DAYS);

const session = {
  id: 100,
  userId: 1,
  revoked: false,
  token: hashedToken,
  createdAt: now,
  revokedAt: null,
  expiresAt: expectedExpiry,
};

describe('Session service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });
  test('Debe crear una sesion', async () => {
    vi.setSystemTime(now);

    vi.mocked(hashValue).mockResolvedValue(hashedToken);
    prismaMock.session.create.mockResolvedValue(session);

    const result = await create(1, rawToken);

    expect(hashValue).toHaveBeenCalledWith(rawToken);
    expect(prismaMock.session.create).toHaveBeenCalledWith({
      data: {
        user: { connect: { id: 1 } },
        token: hashedToken,
        expiresAt: expectedExpiry,
      },
    });
    expect(result.token).toBe(hashedToken);
  });

  test('Debe encontrar una sesion por id', async () => {
    prismaMock.session.findUnique.mockResolvedValue(session);
    const result = await findUnique(1);
    expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toBe(session);
  });

  test('Debe revocar una sesion', async () => {
    const revokeDate = new Date('2026-02-27T09:00:00Z');
    vi.setSystemTime(revokeDate);
    await revoke(1);
    expect(prismaMock.session.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { revoked: true, revokedAt: revokeDate },
    });
  });

  test('Debe revocar todas las sesiones activas de un usuario', async () => {
    const revokeDate = new Date('2026-02-27T09:00:00Z');
    vi.setSystemTime(revokeDate);
    await revokeAll(1);
    expect(prismaMock.session.updateMany).toHaveBeenCalledWith({
      where: { userId: 1, revoked: false },
      data: { revoked: true, revokedAt: revokeDate },
    });
  });
});
