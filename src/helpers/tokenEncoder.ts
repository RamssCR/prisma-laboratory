import type { Encoded } from '#types/token';

export const tokenEncoder = <T = Encoded>(object: T) =>
  Buffer.from(JSON.stringify(object)).toString('base64');

export const tokenDecoder = <T = Encoded>(encoded: string): T | null => {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};
