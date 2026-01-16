import type { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { logger } from '#utils/logger';
import { Prisma } from 'generated/prisma/client';

/**
 * Handles errors in an Express application.
 * If the error is an instance of Error, it logs the stack trace to the console
 * and sends a JSON response with the error status, code 500, and the error message.
 * @param error - The error captured in the application.
 * @param _req - The request object.
 * @param res - The response object.
 * @param _next - The next middleware function in the stack.
 * @returns Does not return anything but sends a response to the client.
 * @example
 * app.use(errorHandler);
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`Prisma Error Code: ${error}`);

    switch (error.code) {
      case 'P2002': {
        return res.status(status.CONFLICT).json({
          status: 'error',
          code: status.CONFLICT,
          message: `El valor del campo ya existe en el sistema.`,
        });
      }

      case 'P2025':
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          code: status.NOT_FOUND,
          message: 'El registro solicitado no fue encontrado.',
        });

      case 'P2003':
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          code: status.BAD_REQUEST,
          message:
            'No se puede realizar la operación debido a datos relacionados existentes.',
        });

      default:
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          code: status.BAD_REQUEST,
          message: `Error de base de datos: ${error.message}`,
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(error.message);
    return res.status(status.BAD_REQUEST).json({
      status: 'error',
      code: status.BAD_REQUEST,
      message: 'Error de validación en los datos enviados a la base de datos.',
    });
  }

  if (error instanceof Error) {
    logger.error(error?.stack);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: status.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }

  logger.error(error);
  return res.status(status.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    code: status.INTERNAL_SERVER_ERROR,
    message: 'An unknown error occurred',
  });
};
