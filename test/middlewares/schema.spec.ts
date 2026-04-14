import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { validate } from '#middlewares/schema';
import { z } from 'zod';

describe('Middleware de validación de esquema', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number().min(18),
  });

  test('valida correctamente un cuerpo de solicitud válido', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
        age: 25,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('responde con error para un cuerpo de solicitud inválido', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
        age: 15,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(res.statusCode).toBe(400);
  });

  test('valida correctamente en modo parcial', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema, { mode: 'partial' });
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('valida correctamente los parámetros de consulta', () => {
    const req = createRequest({
      method: 'GET',
      url: '/user',
      query: {
        name: 'John Doe',
        age: '30',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema, { target: 'query' });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('Middleware: comportamiento de la propiedad query y descriptor/getter', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number().min(18),
  });

  test('define query como un accessor (getter), enumerable y configurable, retorna el valor parseado y resiste la asignación', () => {
    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/user',
        query: {
          name: 'John Doe',
          age: '30',
        },
      }),
      res = createResponse();

    const middleware = validate(schema, { target: 'query' });
    middleware(req, res, next);

    let assignError = null;
    try {
      req.query = { name: 'Hacker', age: '99' };
    } catch (err) {
      assignError = err;
    }
    expect(assignError).toBeInstanceOf(TypeError);
    expect(req.query).toEqual({ name: 'John Doe', age: 30 });
  });
});

describe('Middleware: manejo de errores', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number().min(18),
  });
  test('pasa los errores a next() cuando ocurre una excepción', () => {
    const next = vi.fn((error) => {
      expect(error).toBeInstanceOf(Error);
    });
    const req = createRequest({
        method: 'POST',
        url: '/user',
        body: {
          name: 'John Doe',
          age: 25,
        },
      }),
      res = createResponse();

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
