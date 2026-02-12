import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/vehicle';
import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Crea un vehiculo en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Vehiculo creado
 * @example
 * // Solicitud POST a /api/vehicles
 */
export const createVehicle: RequestHandler = async (req, res, next) => {
  try {
    const vehicle = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve todos los vehiculos dependiendo del filtro
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Vehiculos encontrados
 * @example
 * // Solicitud GET a /api/vehicles
 */
export const getVehicles: RequestHandler = async (req, res, next) => {
  try {
    const vehicles = await findMany();
    res.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devuelve un vehiculo por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Vehiculo encontrado
 * @example
 * // Solicitud GET a /api/vehicles/1
 */
export const getVehicle: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await findUnique(Number(id));
    res.json({
      success: true,
      message: 'Vehicle obtained successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un vehiculo por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Vehiculo actualizado
 * @example
 * // Solicitud PATCH a /api/vehicles/1
 */
export const updateVehicle: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await update(Number(id), req.body);
    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un vehiculo por su id en la base de datos
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Funcion para manejor de errores
 * @returns Nada
 * @example
 * // Solicitud DELETE a /api/vehicles/1
 */
export const deleteVehicle: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));
    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
