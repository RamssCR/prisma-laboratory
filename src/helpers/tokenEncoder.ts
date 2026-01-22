import type { Encoded } from '#types/token';

/**
 * Codifica un objeto en un token base64
 * @param object Objeto que contiene el token y el id
 * @returns Token codificado en base64
 * @example
 * const token = tokenEncoder({ id: 1, token: 'abc123' });
 * console.log(token); // base64 string
 */
export const tokenEncoder = <T = Encoded>(object: T) =>
  Buffer.from(JSON.stringify(object)).toString('base64');

/**
 * Decodifica un token base64 a un objeto
 * @param encoded Token codificado en base64
 * @returns Objeto decodificado o null si no se puede decodificar
 * @example
 * const decoded = tokenDecoder<{ id: number; token: string }>(token);
 * console.log(decoded); // { id: 1, token: 'abc123' }
 */
export const tokenDecoder = <T = Encoded>(encoded: string): T | null => {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};
