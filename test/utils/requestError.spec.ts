import { describe, expect, test } from 'vitest';
import { RequestError } from '#utils/requestError';

describe('RequestError Class', () => {
  test('should create an instance with default values', () => {
    const error = new RequestError('Default error', {});
    expect(error).toBeInstanceOf(RequestError);
    expect(error.message).toBe('Default error');
    expect(error.status).toBe(500);
    expect(error.method).toBe('UNKNOWN');
    expect(error.cause).toEqual({});
  });

  test('should create an instance with custom values', () => {
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

  test('toJSON method should return correct JSON representation', () => {
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

  test('toString method should return correct string representation', () => {
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

  test('should capture stack trace', () => {
    const error = new RequestError('Stack trace test', {});
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: Stack trace test');
  });

  test('captureStackTrace should not throw if not available', () => {
    const originalCaptureStackTrace = Error.captureStackTrace;
    Error.captureStackTrace =
      undefined as unknown as typeof Error.captureStackTrace;

    const error = new RequestError('No captureStackTrace', {});
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestError: No captureStackTrace');
    Error.captureStackTrace = originalCaptureStackTrace;
  });
});
