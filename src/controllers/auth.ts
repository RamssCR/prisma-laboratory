import type { RequestHandler } from 'express';
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
  profile as profileService,
  refresh as refreshService,
} from '#services/auth';
import { NODE_ENV } from '#config/environment';
import { ONE_DAY, SEVEN_DAYS } from '#utils/constants';

/**
 * Registra un nuevo usuario en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Usuario registrado junto con tokens de autenticacion
 * @example
 * // Solicitud POST a /api/auth/register
 * // Respuesta: { "success": true, "data": { user: {...}, tokens: {...} } }
 */
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { tokens, user } = await registerService(req.body);

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: ONE_DAY,
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: SEVEN_DAYS,
      })
      .json({
        success: true,
        message: 'Logged in successfully',
        data: { user, tokens },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve el perfil del usuario autenticado
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Perfil del usuario autenticado
 * @example
 * // Solicitud GET a /api/auth/profile
 * // Respuesta: { "success": true, "data": {...} }
 */
export const profile: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.id as number;
    const user = await profileService(id);

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Inicia sesion de un usuario existente
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Usuario autenticado junto con tokens
 * @example
 * // Solicitud POST a /api/auth/login
 * // Respuesta: { "success": true, "data": { user: {...}, tokens: {...} } }
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { tokens, user } = await loginService(req.body);

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: ONE_DAY,
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: SEVEN_DAYS,
      })
      .json({
        success: true,
        message: 'Logged in successfully',
        data: { user, tokens },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresca los tokens de autenticacion del usuario
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Nuevos tokens de autenticacion
 * @example
 * // Solicitud POST a /api/auth/refresh
 * // Respuesta: { "success": true, "data": { ... } }
 */
export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.id as number;
    const { refreshToken } = req.cookies;
    const tokens = await refreshService(refreshToken, id);

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: ONE_DAY,
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: SEVEN_DAYS,
      })
      .json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Cierra la sesion del usuario autenticado
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Mensaje de exito
 * @example
 * // Solicitud POST a /api/auth/logout
 * // Respuesta: { "success": true, "data": null }
 */
export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutService(refreshToken);
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({ success: true, message: 'Logged out successfully', data: null });
  } catch (error) {
    next(error);
  }
};
