import { login, logout, profile, refresh, register } from '#services/auth';
import { findByEmail, create as createUser, findUnique } from '#services/user';
import { compareValue } from '#libs/bcrypt';
import { createToken } from '#libs/jwt';
import {
  create as createSession,
  revoke,
  findUnique as findToken,
  revokeAll,
} from '#services/session';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { UserSchema } from '#schemas/user';

vi.mock('#services/user', () => ({
  create: vi.fn(),
  findByEmail: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock('#libs/bcrypt', () => ({
  compareValue: vi.fn(),
}));

vi.mock('#libs/jwt', () => ({
  createToken: vi.fn(),
}));

vi.mock('#services/session', () => ({
  create: vi.fn(),
  revoke: vi.fn(),
  findUnique: vi.fn(),
  revokeAll: vi.fn(),
}));

vi.mock('#helpers/tokenEncoder', () => ({
  tokenEncoder: vi.fn(),
  tokenDecoder: vi.fn(),
}));

vi.mock('#config/environment', () => ({
  JWT_EXPIRES_IN: '1h',
  JWT_SECRET: 'access-secret',
  JWT_REFRESH_SECRET: 'refresh-secret',
  JWT_REFRESH_EXPIRES_IN: '7d',
}));

describe('Servicio de Autenticación - Login', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
  };

  const loginData = {
    email: 'test@example.com',
    password: 'password123',
  } as UserSchema;

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('debe lanzar error si el usuario no es encontrado', async () => {
    vi.mocked(findByEmail).mockResolvedValue(null as never);

    await expect(login(loginData)).rejects.toThrow('Invalid email or password');
    expect(compareValue).not.toHaveBeenCalled();
  });

  test('debe lanzar error si la contraseña no coincide', async () => {
    vi.mocked(findByEmail).mockResolvedValue(mockUser as never);
    vi.mocked(compareValue).mockResolvedValue(false as never);

    await expect(login(loginData)).rejects.toThrow('Invalid email or password');
  });

  test('debe retornar usuario y tokens en login exitoso', async () => {
    vi.mocked(findByEmail).mockResolvedValue(mockUser as never);
    vi.mocked(compareValue).mockResolvedValue(true as never);

    vi.mocked(createToken)
      .mockResolvedValueOnce('access-token' as never)
      .mockResolvedValueOnce('raw-refresh-token' as never);

    vi.mocked(createSession).mockResolvedValue({ id: 99 } as never);
    vi.mocked(tokenEncoder).mockReturnValue('encoded-refresh-token' as never);

    const result = await login(loginData);

    expect(result).toEqual({
      user: mockUser,
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'encoded-refresh-token',
      },
    });

    expect(findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(compareValue).toHaveBeenCalledWith('password123', 'hashedpassword');

    expect(createToken).toHaveBeenCalledTimes(2);
    expect(createToken).toHaveBeenNthCalledWith(1, { id: 1 }, 'access-secret', {
      expiresIn: '1h',
    });
    expect(createToken).toHaveBeenNthCalledWith(
      2,
      { id: 1 },
      'refresh-secret',
      { expiresIn: '7d' },
    );

    expect(createSession).toHaveBeenCalledWith(1, 'raw-refresh-token');
    expect(tokenEncoder).toHaveBeenCalledWith({
      id: 99,
      refreshToken: 'raw-refresh-token',
    });
  });

  test('debe propagar errores de generación de token después de credenciales válidas', async () => {
    vi.mocked(findByEmail).mockResolvedValue(mockUser as never);
    vi.mocked(compareValue).mockResolvedValue(true as never);
    vi.mocked(createToken).mockRejectedValue(new Error('JWT failure'));

    await expect(login(loginData)).rejects.toThrow('JWT failure');
  });
});

describe('Servicio de Autenticación - Registro', () => {
  test('debe lanzar error si el usuario ya existe', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
    };
    vi.mocked(findByEmail).mockResolvedValue(mockUser as never);

    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    } as UserSchema;

    await expect(register(registerData)).rejects.toThrow('User already exists');
  });

  test('debe crear usuario y retornar tokens en registro exitoso', async () => {
    const newUser = {
      id: 2,
      email: 'newuser@example.com',
      password: 'hashedpassword',
      name: 'New User',
    };
    vi.mocked(findByEmail).mockResolvedValue(null as never);
    vi.mocked(createUser).mockResolvedValue(newUser as never);

    vi.mocked(createToken)
      .mockResolvedValueOnce('access-token' as never)
      .mockResolvedValueOnce('raw-refresh-token' as never);

    vi.mocked(createSession).mockResolvedValue({ id: 99 } as never);
    vi.mocked(tokenEncoder).mockReturnValue('encoded-refresh-token' as never);

    const registerData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    } as UserSchema;

    const result = await register(registerData);

    expect(result).toEqual({
      user: newUser,
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'encoded-refresh-token',
      },
    });

    expect(findByEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(createUser).toHaveBeenCalledWith(registerData);
  });
});

describe('Servicio de Autenticación - Perfil', () => {
  test('debe retornar el perfil del usuario', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };
    vi.mocked(findUnique).mockResolvedValue(mockUser as never);

    const result = await profile(1);

    expect(result).toEqual(mockUser);
  });
});

describe('Servicio de Autenticación - Logout', () => {
  test('debe lanzar error si el token es inválido', async () => {
    vi.mocked(tokenDecoder).mockReturnValue(null as never);
    await expect(logout('invalid-token')).rejects.toThrow('Invalid token');
  });

  test('debe revocar sesión en token válido', async () => {
    vi.mocked(tokenDecoder).mockReturnValue({ id: 99 } as never);

    await logout('valid-token');
    expect(tokenDecoder).toHaveBeenCalledWith('valid-token');
    expect(revoke).toHaveBeenCalledWith(99);
  });
});

describe('Servicio de Autenticación - Refrescar', () => {
  test('debe lanzar error si el token es inválido', async () => {
    vi.mocked(tokenDecoder).mockReturnValue(null as never);
    await expect(refresh('invalid-token', 1)).rejects.toThrow('Invalid token');
  });

  test('debe retornar nuevos tokens en token de refresco válido', async () => {
    vi.mocked(tokenDecoder).mockReturnValue({ id: 1 } as never);
    vi.mocked(createToken)
      .mockResolvedValueOnce('new-access-token' as never)
      .mockResolvedValueOnce('new-raw-refresh-token' as never);
    vi.mocked(createSession).mockResolvedValue({ id: 99 } as never);
    vi.mocked(tokenEncoder).mockReturnValue(
      'new-encoded-refresh-token' as never,
    );

    const result = await refresh('valid-refresh-token', 1);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-encoded-refresh-token',
    });
  });

  test('debe revocar todos los tokens si el token de refresco está revocado', async () => {
    vi.mocked(tokenDecoder).mockReturnValue({ id: 1 } as never);
    vi.mocked(findToken).mockResolvedValue({ revoked: true } as never);
    await expect(refresh('revoked-refresh-token', 1)).rejects.toThrow(
      'Token has been revoked',
    );
    expect(revokeAll).toHaveBeenCalledWith(1);
  });
});
