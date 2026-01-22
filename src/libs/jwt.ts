import jwt from 'jsonwebtoken';

export type DecodedToken<T> = T & jwt.JwtPayload;

/**
 * Crea un token JWT firmado
 * @param payload - El contenido a codificar en el token (string, objeto o Buffer)
 * @param secret - La clave secreta utilizada para firmar el token
 * @param options - Opciones adicionales de configuración para la firma (expiración, algoritmo, etc.)
 * @returns Promise que se resuelve con el token JWT firmado como string
 */
export const createToken = (
  payload: string | object | Buffer,
  secret: jwt.Secret,
  options?: jwt.SignOptions,
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      resolve(jwt.sign(payload, secret, options));
    } catch (error) {
      reject(error);
    }
  });

/**
 * Decodifica un token JWT
 * @param token - El token JWT a decodificar
 * @param secret - La clave secreta utilizada para verificar el token
 * @returns Promise que se resuelve con el contenido decodificado del token
 */
export const decodeToken = <T>(
  token: string,
  secret: jwt.Secret | jwt.PublicKey,
): Promise<DecodedToken<T>> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) return reject(error);
      return resolve(decoded as DecodedToken<T>);
    });
  });
