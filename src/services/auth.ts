import type { UserSchema } from '#schemas/user';
import type { Prisma } from 'generated/prisma/client';
import { create as createUser, findByEmail } from '#services/user';
import { createToken } from '#libs/jwt';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from '#config/environment';
import type { SignOptions } from 'jsonwebtoken';
import { create as createSession, revoke } from './session';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';
import { compareValue } from '#libs/bcrypt';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const login = async (
  data: UserSchema,
): Promise<{ user: Prisma.UserModel; tokens: Tokens }> => {
  const user = await findByEmail(data.email);
  if (!user || !(await compareValue(data.password, user.password)))
    throw new Error('Invalid email or password');

  return { user, tokens: await generateTokens({ id: user.id }) };
};

export const register = async (
  data: UserSchema,
): Promise<{ user: Prisma.UserModel; tokens: Tokens }> => {
  const storedUser = await findByEmail(data.email);
  if (storedUser) throw new Error('User already exists');

  const user = await createUser(data);
  return { user, tokens: await generateTokens({ id: user.id }) };
};

export const logout = async (token: string): Promise<void> => {
  const decoded = tokenDecoder(token);
  if (!decoded?.id) throw new Error('Invalid token');

  await revoke(decoded.id);
};

export const generateTokens = async (payload: {
  id: number;
}): Promise<Tokens> => {
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
