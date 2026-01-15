import type { RequestHandler } from 'express';
import { create, findMany, softDelete, update } from '#services/user';
import status from 'http-status';

/**
 * Crea un usuario en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns - Respuesta creacion usuario
 * @example
 * // Solicitud POST a /api/users
 * // Body: { "name": "Juan Pérez", "email": "juan@example.com", "role": "admin" }
 */
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve todos los usuarios de la base de datos
 * @param _req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Array de usuarios listados
 * @example
 * // Solicitud GET a /api/users
 * // Respuesta: { "success": true, "users": [...] }
 */
export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await findMany();
    res.json({
      success: true,
      message: 'Users obtained successfully',
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un usuario en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Usuario actualizado
 * @example
 * // Solicitud PATCH a /api/users/juan@example.com
 * // Body: { "name": "Juan Ignacio" }
 */
export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.params;
    update(email, req.body);

    res.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un usuario de la base de datos (inactiva)
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Respuesta exitosa
 * @example
 * // Solicitud DELETE a /api/users/1
 */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
