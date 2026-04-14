import { login, logout, profile, refresh, register } from '#controllers/auth';
import {
  register as registerService,
  login as loginService,
  profile as profileService,
  refresh as refreshService,
  logout as logoutService,
} from '#services/auth';
import type { Prisma } from 'generated/prisma/client';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  profile: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
}));

const mockuser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    active: true,
    role: 'USER',
  },
  mockTokens = {
    accessToken: '<access_token>',
    refreshToken: '<refresh_token>',
  },
  mockRegister = {
    user: mockuser,
    tokens: mockTokens,
  };

describe('Controlador de autenticación', () => {
  test('Deberia registrar un nuevo usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'Carlos',
          email: 'carlos@example.com',
          password: 'password123',
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(registerService).mockResolvedValue(mockRegister as never);

    await register(req, res, next);

    expect(registerService).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Logged in successfully',
      data: mockRegister,
    });
  });

  test('Deberia manejar errores al registrar un nuevo usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          name: 'Carlos',
          email: 'carlos@example.com',
          password: 'password123',
        },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('register error');

    vi.mocked(registerService).mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia loggear un nuevo usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/login',
        body: {
          email: 'carlos@gmail.com',
          password: 'password123',
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(loginService).mockResolvedValue(mockRegister as never);

    await login(req, res, next);

    expect(loginService).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Logged in successfully',
      data: mockRegister,
    });
  });

  test('Deberia manejar errores al loggear un usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/login',
        body: {
          email: 'carlos@gmail.com',
          password: 'password123',
        },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('login error');

    vi.mocked(loginService).mockRejectedValue(error as unknown);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia retornar el perfil de un usuario', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/auth/profile',
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(profileService).mockResolvedValue(
      mockuser as unknown as Prisma.UserModel,
    );

    await profile(req, res, next);

    expect(profileService).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Profile retrieved successfully',
      data: mockuser,
    });
  });

  test('Debe manejar errores cuando profile falle', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/auth/profile',
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('profile error');

    vi.mocked(profileService).mockRejectedValue(error);

    await profile(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe refrescar el token de un usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/refresh',
        cookies: { refreshToken: '<refresh_token>' },
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(refreshService).mockResolvedValue(mockTokens as never);

    await refresh(req, res, next);

    expect(refreshService).toHaveBeenCalledWith(req.cookies.refreshToken, 1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Tokens refreshed successfully',
      data: mockTokens,
    });
  });

  test('Debe manejar errores cuando refres falla', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/refresh',
        cookies: { refreshToken: '<refresh_token>' },
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('refresh error');

    vi.mocked(refreshService).mockRejectedValue(error);

    await refresh(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe cerrar la sesión de un usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/logout',
        cookies: { refreshToken: '<refresh_token>' },
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(logoutService).mockResolvedValue(undefined);

    await logout(req, res, next);

    expect(logoutService).toHaveBeenCalledWith(req.cookies.refreshToken);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  });

  test('Debe manejar errores cuando logout falle', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/auth/logout',
        cookies: { refreshToken: '<refresh_token>' },
        user: { id: 1 },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('logout error');

    vi.mocked(logoutService).mockRejectedValue(error);

    await logout(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
