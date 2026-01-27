import type { RequestHandler } from 'express';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/category';
import status from 'http-status';

/**
 * Crea una categoria en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Categoria creada
 * @example
 * // Solicitud POST a /api/categories
 * // Body: { "name": "Aceite" }
 */
export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una categoria en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Categoria actualizado
 * @example
 * // Solicitud PATCH a /api/categories/1
 * // Body: { "name": "Kit Arrastre" }
 */
export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await update(Number(id), req.body);
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve todas las categorias de la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Caregorias encontradas
 * @example
 * // Solicitud GET a /api/categories
 */
export const getCategories: RequestHandler = async (_req, res, next) => {
  try {
    const categories = await findMany();
    res.json({
      success: true,
      message: 'Categories obtained successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve una categoria por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Categoria encontrada
 * @example
 * // Solicitud GET a /api/categories/1
 */
export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await findUnique(Number(id));
    res.json({
      success: true,
      message: 'Category obtained successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Inactiva una categoria de la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Nada
 * @example
 * // Solicitud DELETE a /api/categories/1
 */
export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
