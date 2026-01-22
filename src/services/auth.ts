import type { UserSchema } from '#schemas/user';
import type { Prisma } from 'generated/prisma/client';
import {
  create as createUser,
  findByEmail,
  findUnique as findUser,
} from './user';
import { createToken } from '#libs/jwt';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from '#config/environment';
import type { SignOptions } from 'jsonwebtoken';
import {
  create as createSession,
  revoke,
  findUnique as findToken,
  revokeAll,
} from './session';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';
import { compareValue } from '#libs/bcrypt';

/**
 * Maneja el inicio de sesion de un usuario y la creacion de tokens
 * @param data Datos de inicio de sesion
 * @returns Objeto que contiene el usuario y los tokens
 * @example
 * await login({ email: 'user@example.com', password: 'pass123' })
 */
export const login = async (data: UserSchema) => {
  const user = await findByEmail(data.email);
  if (!user || !(await compareValue(data.password, user.password)))
    throw new Error('Invalid email or password');

  return { user, tokens: await generateTokens({ id: user.id }) };
};

/**
 * Registra un nuevo usuario y genera tokens de autenticacion
 * @param data Datos del usuario
 * @returns Objeto que contiene el usuario y los tokens
 * @example
 * await register({ name: 'Carlos', email: 'carlos@example.com', ... })
 */
export const register = async (data: UserSchema) => {
  const storedUser = await findByEmail(data.email);
  if (storedUser) throw new Error('User already exists');

  const user = await createUser(data);
  return { user, tokens: await generateTokens({ id: user.id }) };
};

/**
 * Obtiene el perfil del usuario por su id
 * @param userId id del usuario
 * @returns Perfil del usuario
 * @example
 * await profile(1)
 */
export const profile = async (userId: number) => {
  return (await findUser(userId)) as Prisma.UserModel;
};

/**
 * Cierra la sesion del usuario asociado al token
 * @param token Token de refresco para revocar
 * @returns Nada
 * @example
 * await logout('<token>')
 */
export const logout = async (token: string) => {
  const decoded = tokenDecoder(token);
  if (!decoded?.id) throw new Error('Invalid token');

  await revoke(decoded.id);
};

/**
 * Refresca los tokens usando un token de refresco valido
 * @param token Token de refresco
 * @param userId Id del usuario
 * @returns Tokens renovados
 * @example
 * await refresh('<refreshToken>', 1)
 */
export const refresh = async (token: string, userId: number) => {
  const decoded = tokenDecoder(token);
  if (!decoded?.id) throw new Error('Invalid token');

  const storedToken = await findToken(decoded.id);
  if (storedToken?.revoked) {
    await revokeAll(userId);
    throw new Error('Token has been revoked');
  }

  return await generateTokens({ id: userId });
};

/**
 * Genera tokens de acceso y refresco para un usuario
 * @param payload Datos del usuario
 * @returns Tokens de acceso y refresco
 * @example
 * await generateTokens({ id: 1 })
 */
export const generateTokens = async (payload: { id: number }) => {
  const [accessToken, refreshToken] = (await Promise.all([
    createToken(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    }),
    createToken(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    }),
  ])) as [string, string];

  const { id } = await createSession(payload.id, refreshToken);
  return { accessToken, refreshToken: tokenEncoder({ id, refreshToken }) };
};
