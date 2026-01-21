import { prisma } from '#config/db';
import { hashValue } from '#libs/bcrypt';
import { SEVEN_DAYS } from '#utils/constants';

export const create = async (userId: number, rawToken: string) => {
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

export const findUnique = (id: number) =>
  prisma.session.findUnique({ where: { id } });

export const revoke = async (id: number) => {
  await prisma.session.update({
    where: { id },
    data: { revoked: true, revokedAt: new Date() },
  });
};

export const revokeAll = (userId: number) =>
  prisma.session.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true, revokedAt: new Date() },
  });
