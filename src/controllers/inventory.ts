import type { SearchQuery } from '#schemas/searchQuery';
import { createMovement, getProductStock } from '#services/inventory';
import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Crea un movimiento en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Movimiento creado
 * @example
 * // Solicitud POST a /api/inventory
 */
export const movement: RequestHandler = async (req, res, next) => {
  try {
    const data = await createMovement(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Movement created successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Consulta el stock de los productos en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Productos con stock
 * @example
 * // Solicitud GET a /api/inventory
 */
export const stock: RequestHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    const data = await getProductStock(search as SearchQuery['search']);
    res.json({
      success: true,
      message: 'Actual stock loaded',
      data,
    });
  } catch (error) {
    next(error);
  }
};
