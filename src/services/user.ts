import { prisma } from '#config/db';
import { hashValue } from '#libs/bcrypt';
import type { UserSchema } from '#schemas/user';

/**
 * Crea un usuario en la base de datos
 * @param data - datos del usuario que se va a crear
 * @returns informacion del usuario creado
 * @example
 * await createUser({ name: Arnulfo, email: arnulfo@gmail.com, password: 1234 })
 */
export const create = async (data: UserSchema) =>
  await prisma.user.create({
    data: { ...data, password: await hashValue(data.password) },
  });

/**
 * Busca todos los usuarios de la base de datos
 * @returns los usuarios listados de la base de datos
 * @example
 * await findMany()
 * // returns - users: [{...}, {...}]
 */
export const findMany = () => prisma.user.findMany();

/**
 * Busca un usuario por su email
 * @param email - Correo electronico
 * @returns Usuario existente
 * @example
 * await findByEmail('alejo@email.com')
 * // returns { id: 1, name: 'alejo', email: 'alejo@email.com', ...}
 */
export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

/**
 * Busca un usuario por su id
 * @param id numero de usuario en base de datos
 * @returns Unico usuario encontrado
 * @example
 * await findUnique(1)
 * // returns { id: 1, name: 'alejo', email: '
 */
export const findUnique = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    omit: { password: true, createdAt: true, updatedAt: true },
  });

/**
 * Actualiza un usuario por su email
 * @param email - Email del usuario
 * @param data - Informacion a actualiza
 * @returns nada
 * @example
 * await update('alejo@email.com', { name: 'carlos', ... })
 */
export const update = (email: string, data: Partial<UserSchema>) =>
  prisma.user.update({
    where: { email },
    data,
  });

/**
 * Realiza una operacion de eliminacion logica para el modelo User
 * @param id id del registro
 * @example
 * await softDelete(2)
 */
export const softDelete = (id: number) =>
  prisma.user.update({
    where: { id },
    data: { active: false },
  });
