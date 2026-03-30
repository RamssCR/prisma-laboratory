import { describe, expect, test } from 'vitest';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';

describe('Codificadores y decodificadores de token', () => {
  test('codifica un objeto correctamente', () => {
    const obj = { token: 'abc123', id: 1 };
    const encoded = tokenEncoder(obj);
    expect(typeof encoded).toBe('string');
    expect(encoded).not.toBe(JSON.stringify(obj));
  });

  test('decodifica una cadena correctamente', () => {
    const obj = { token: 'abc123', id: 1 };
    const encoded = tokenEncoder(obj);
    const decoded = tokenDecoder(encoded);
    expect(decoded).toEqual(obj);
  });

  test('retorna null al decodificar una cadena inválida', () => {
    const invalidEncoded = 'invalid_base64_string';
    const decoded = tokenDecoder(invalidEncoded);
    expect(decoded).toBeNull();
  });
});
