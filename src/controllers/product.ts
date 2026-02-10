import type { SearchQuery } from '#schemas/searchQuery';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/product';
import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Crea un producto en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Producto creado
 * @example
 * // Solicitud POST a /api/products
 */
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve todos los productos dependiendo del filtro
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Productos encontrados
 * @example
 * // Solicitud GET a /api/products || /api/products?search=yamaha
 */
export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await findMany(search as SearchQuery['search']);
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve un producto por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Producto encontrado
 * @example
 * // Solicitud GET a /api/products/1
 */
export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findUnique(Number(id));
    res.json({
      success: true,
      message: 'Product obtained successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un producto por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Producto actualizado
 * @example
 * // Solicitud PATCH a /api/products/1
 */
export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await update(Number(id), req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un producto por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Nada
 * @example
 * // Solicitud DELETE a /api/products/1
 */
export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
