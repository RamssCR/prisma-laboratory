import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { decodeToken } from '#libs/jwt';
import { verifyToken } from '#middlewares/verifyToken';
import { logger } from '#utils/logger';

vi.mock('#libs/jwt', () => ({
  decodeToken: vi.fn(),
}));

describe('Middleware verifyToken', () => {
  test('Debe llamar a next() si el token es válido', async () => {
    vi.mocked(decodeToken).mockResolvedValue({
      id: 1,
      role: 'user',
      accessLevel: 'basic',
    });
    const req = createRequest({
      cookies: { token: 'valid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(vi.mocked(decodeToken)).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('Debe responder con 401 si no se proporciona token', async () => {
    const req = createRequest({
      cookies: {},
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  test('Debe responder con 401 si el token es inválido', async () => {
    const spiedLogger = vi.spyOn(logger, 'error').mockImplementation(vi.fn());
    vi.mocked(decodeToken).mockRejectedValue(new Error('Invalid token'));
    const req = createRequest({
      cookies: { token: 'invalid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(spiedLogger).toHaveBeenCalledWith(
      'Token verification failed: ',
      'Invalid token',
    );
  });

  test('Debe llamar a next() si el token es válido en el encabezado', async () => {
    vi.mocked(decodeToken).mockResolvedValue({
      id: 2,
      role: 'admin',
    });
    const req = createRequest({
      headers: { authorization: 'Bearer valid-token-header' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('No registra excepciones que no sean Error', async () => {
    vi.spyOn(logger, 'error').mockImplementation(vi.fn());
    vi.mocked(decodeToken).mockRejectedValue('Some string error');
    const req = createRequest({
      cookies: { token: 'invalid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
  });
});
