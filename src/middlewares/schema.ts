import type { Request, RequestHandler } from 'express';
import { z } from 'zod';
import status from 'http-status';

type Target = 'headers' | 'body' | 'params' | 'query';
type Mode = 'full' | 'partial';
type ZodParams = {
  object: Record<string, unknown>;
  schema: z.ZodSchema;
  mode: Mode;
};
type SchemaValidator = {
  target: keyof Pick<Request, Target>;
  mode: Mode;
};

/**
 * Middleware para validar el cuerpo de respuesta contra el esquema zod.
 * Si la validacion falla, responde con un 400 y el mensaje de error.
 * Si la validacion, it calls the next middleware.
 * @param params - El objeto de parámetros.
 * @param params.object - El objeto a validar.
 * @param params.schema - El esquema zod contra el que validar.
 * @param params.mode - El tipo de validación a realizar ('full' o 'partial').
 * @returns - Una lista de mensajes de error si la validación falla, de lo contrario el objeto validado.
 */
const parseSchema = ({ object, schema, mode }: ZodParams) => {
  const parsed =
    mode === 'partial' && schema instanceof z.ZodObject
      ? schema.partial().safeParse(object)
      : schema.safeParse(object);
  return parsed.success
    ? parsed.data
    : parsed.error.issues.map(
        (issue) => `${issue.path.join('.')} - ${issue.message}`,
      );
};

/**
 * @param schema - El esquema zod para validar.
 * @param options - Opciones para la validación.
 * @returns - La función middleware.
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number().min(0),
 * })
 * const errors = parseSchema({ name: "John", age: -5 }, schema)
 * // errors will be: ["Number must be greater than or equal to 0"]
 */
export const validate =
  (
    schema: z.ZodSchema,
    { target = 'body', mode = 'full' }: Partial<SchemaValidator> = {},
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const result = parseSchema({ object: req[target], schema, mode });

      if (Array.isArray(result) && result.length > 0)
        return res.status(status.BAD_REQUEST).json({
          message: 'Error validating schema',
          success: false,
          details: result,
        });

      if (target === 'query') {
        Object.defineProperty(req, 'query', {
          get: () => result,
          enumerable: true,
          configurable: true,
        });
      } else {
        req[target] = result;
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
