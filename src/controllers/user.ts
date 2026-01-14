import type { RequestHandler } from 'express';
import { create, findMany } from '#services/user';
import status from 'http-status';

/**
 *
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns - Respuesta creacion usuario
 *
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
