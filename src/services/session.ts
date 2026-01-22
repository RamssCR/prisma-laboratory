import { prisma } from '#config/db';
import { hashValue } from '#libs/bcrypt';
import { SEVEN_DAYS } from '#utils/constants';

/**
 * Crea una sesion para un usuario con un token hasheado
 * @param userId Id del usuario
 * @param rawToken Token en texto plano
 * @returns Sesion creada
 * @example
 * await create(1, '<rawToken>')
 */
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

/**
 * Busca una sesion por su id
 * @param id Id de la sesion
 * @returns Sesion encontrada
 * @example
 * await findUnique(1)
 */
export const findUnique = (id: number) =>
  prisma.session.findUnique({ where: { id } });

/**
 * Revoca una sesion por su id
 * @param id Id de la sesion
 * @returns Nada
 * @example
 * await revoke(1)
 */
export const revoke = async (id: number) => {
  await prisma.session.update({
    where: { id },
    data: { revoked: true, revokedAt: new Date() },
  });
};

/**
 * Revoca todas las sesiones activas de un usuario
 * @param userId Id del usuario
 * @returns Nada
 * @example
 * await revokeAll(1)
 */
export const revokeAll = (userId: number) =>
  prisma.session.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true, revokedAt: new Date() },
  });
