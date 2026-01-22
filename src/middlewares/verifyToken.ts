import { JWT_SECRET } from '#config/environment';
import { decodeToken } from '#libs/jwt';
import { logger } from '#utils/logger';
import type { Request, RequestHandler } from 'express';
import status from 'http-status';

/**
 * Devuelve el token de acceso desde las cookies de la solicitud
 * @param req Objeto de solicitud de Express
 * @returns Token de acceso o null si no existe
 */
const getTokenFromCookies = (req: Request): string | null => {
  const { accessToken } = req.cookies;
  return accessToken && accessToken !== 'null' && accessToken !== 'undefined'
    ? accessToken
    : null;
};

/**
 * Devuelve el token de acceso desde la cabecera Authorization o las cookies
 * @param req Objeto de solicitud de Express
 * @returns Token de acceso o null si no existe
 */
const getToken = (req: Request): string | null => {
  const headerToken = req.headers?.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split('')[1]
    : null;

  const cookieToken = getTokenFromCookies(req);

  return cookieToken ?? headerToken;
};

/**
 * Middleware para verificar el token de acceso
 * @param req Objeto de solicitud de Express
 * @param res Objeto de respuesta de Express
 * @param next Funcion para manejar el siguiente middleware
 * @returns Llama al siguiente middleware si el token es valido, de lo contrario responde con 401
 */
export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = getToken(req);

  if (!token)
    return res.status(status.UNAUTHORIZED).json({
      success: false,
      message: 'No token provided',
    });
  try {
    const decoded = await decodeToken(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Token verification failed: ', error.message);
    }

    return res.status(status.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
