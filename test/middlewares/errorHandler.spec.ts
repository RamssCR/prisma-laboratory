import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { errorHandler } from '#middlewares/errorHandler';

describe('errorHandler middleware', () => {
  test('handles a generic JavaScript error', () => {
    const next = vi.fn(),
      req = createRequest(),
      res = createResponse();
    const error = new Error('Something went wrong');

    errorHandler(error, req, res, next);
    expect(res.statusCode).toBe(500);
  });

  test('does nothing if the error is not an instance of Error or RequestError', () => {
    const next = vi.fn(),
      req = createRequest(),
      res = createResponse();
    const error = { message: 'Unknown error' };
    errorHandler(error, req, res, next);
    expect(res.statusCode).toBe(500);
  });
});
