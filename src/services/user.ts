import { prisma } from '#config/db';
import { hashValue } from '#libs/bcrypt';
import type { UserSchema } from '#schemas/user';

/**
 * Crea un usuario en la base de datos
 * @param data - datos del usuario que se va a crear
 * @returns - informacion del usuario creado
 * @example
 * await createUser({ name: Arnulfo, email: arnulfo@gmail.com, password: 1234 })
 */
export const create = async (data: UserSchema) => {
  const user = await prisma.user.create({
    data: { ...data, password: await hashValue(data.password) },
  });
  return user;
};

export const findMany = async () => {
  const user = await prisma.user.findMany();
  return user;
};
