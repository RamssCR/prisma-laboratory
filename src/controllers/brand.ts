import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/brand';
import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Crea una marca en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Marca creada
 * @example
 * // Solicitud POST a /api/brands
 * // Body: { "name": "Yamaha" }
 */
export const createBrand: RequestHandler = async (req, res, next) => {
  try {
    const brand = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una marca en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns marca actualizada
 * @example
 * // Solicitud PATCH a /api/brands/1
 * // Body: { "name": "Suzuki" }
 */
export const updateBrand: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await update(Number(id), req.body);
    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las marcas de la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Marcas activas encontradas
 * @example
 * // Solicitud GET a /api/brands
 */
export const getBrands: RequestHandler = async (req, res, next) => {
  try {
    const brands = await findMany();
    res.json({
      success: true,
      message: 'Brands retrieved successfully',
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una marca por su id
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Marca encontrada
 * @example
 * // Solicitud GET a /api/brands/1
 */
export const getBrandById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await findUnique(Number(id));
    res.json({
      success: true,
      message: 'Brand obtained successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una marca de la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Nada
 * @example
 * // Solicitud DELETE a /api/brands/1
 */
export const deleteBrand: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));
    res.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
