import { compare, hash } from 'bcryptjs';
/**
 * hashea un valor de texto plano
 * @param value - Texto plano
 * @returns Valor hasheado
 * @example
 * const hashed = await hashValue("miContraseña");
 * console.log(hashed)
 */
export const hashValue = async (value: string) => await hash(value, 10);

/**
 * Compara un texto plano con un valor hasheado
 * @param value - Texto plano
 * @param hashedValue - Valor hasheado
 * @returns Resultado de la comparacion
 * @example
 * const isMatch = await compareValue('miContraseña', hashed)
 * console.log(isMatch) - true si coinciden, false si no coinciden
 */
export const compareValue = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => await compare(value, hashedValue);
