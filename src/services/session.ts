import { prisma } from '#config/db';
import { hashValue } from '#libs/bcrypt';
import { SEVEN_DAYS } from '#utils/constants';
import type { Prisma } from 'generated/prisma/client';

export const create = async (
  userId: number,
  rawToken: string,
): Promise<Prisma.SessionModel> => {
  const hashedToken = await hashValue(rawToken);

  const token = await prisma.session.create({
    data: {
      user: { connect: { id: userId } },
      token: hashedToken,
      expiresAt: new Date(Date.now() + SEVEN_DAYS),
    },
  });

  return token;
};

export const revoke = async (id: number): Promise<void> => {
  await prisma.session.update({
    where: { id },
    data: { revoked: true, revokedAt: new Date() },
  });
};
