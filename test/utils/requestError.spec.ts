import { describe, expect, test } from 'vitest';
import { RequestError } from '#utils/requestError';

describe('Clase RequestError', () => {
  test('debe crear una instancia con valores por defecto', () => {
    const error = new RequestError('Default error', {});
    expect(error).toBeInstanceOf(RequestError);
    expect(error.message).toBe('Default error');
    expect(error.status).toBe(500);
    expect(error.method).toBe('UNKNOWN');
    expect(error.cause).toEqual({});
  });

  test('debe crear una instancia con valores personalizados', () => {
    const error = new RequestError('Not Found', {
      status: 404,
      method: 'GET',
      cause: { resource: 'User' },
    });
    expect(error).toBeInstanceOf(RequestError);
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
    expect(error.method).toBe('GET');
    expect(error.cause).toEqual({ resource: 'User' });
  });

  test('el método toJSON debe retornar la representación JSON correcta', () => {
    const error = new RequestError('Not Found', {
      status: 404,
      method: 'GET',
      cause: { resource: 'User' },
    });
    const json = error.toJSON();
    expect(json).toEqual({
      name: 'RequestError',
      message: 'Not Found',
      status: 404,
      method: 'GET',
      cause: { resource: 'User' },
    });
  });

  test('el método toString debe retornar la representación en texto correcta', () => {
    const error = new RequestError('Not Found', {
      status: 404,
      method: 'GET',
      cause: { resource: 'User' },
    });
    const str = error.toString();
    expect(str).toBe(
      'RequestError [GET] (status: 404): Not Found - Details: {"resource":"User"}',
    );
  });

  test('debe capturar el seguimiento de pila', () => {
    const error = new RequestError('Stack trace test', {});
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: Stack trace test');
  });

  test('captureStackTrace no debe lanzar error si no está disponible', () => {
    const originalCaptureStackTrace = Error.captureStackTrace;
    Error.captureStackTrace =
      undefined as unknown as typeof Error.captureStackTrace;

    const error = new RequestError('No captureStackTrace', {});
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: No captureStackTrace');
    Error.captureStackTrace = originalCaptureStackTrace;
  });
});
