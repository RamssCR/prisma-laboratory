import { create } from '#services/compatibility';
import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Crea la compatibilidad de un producto con varios vehiculos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Resultado de creacion
 * @example
 * // Solicitud POST a /api/compatibilities
 * // Body: {"productId": 6, "vehicleId": [1, 2], "notes": "Compatibilidad alta" }
}
 */
export const createCompatibility: RequestHandler = async (req, res, next) => {
  try {
    const compatibility = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Compatibility created successfully',
      data: compatibility,
    });
  } catch (error) {
    next(error);
  }
};
