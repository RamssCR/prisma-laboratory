import jwt from 'jsonwebtoken';

export type DecodedToken<T> = T & jwt.JwtPayload;

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
