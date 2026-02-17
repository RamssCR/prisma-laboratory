import { prisma } from '#config/db';
import type { VehicleSchema } from '#schemas/vehicle';

/**
 * Crea un vehiculo en la base de datos
 * @param data Datos de creacion
 * @returns Vehiculo creado
 * @example
 * await create({ model: "SZ15RR", year: 2019, ... })
 */
export const create = (data: VehicleSchema) =>
  !Array.isArray(data) && prisma.vehicle.create({ data });

/**
 * Crea varios vehiculos a la vez en la base de datos
 * @param data Datos de creacion
 * @returns Nada
 * @example
 * await createMany([{ model: "SZ15RR", year: 2019, ... },{ model: "Libero", year: 2019, ... }])
 */
export const createMany = async (data: VehicleSchema[]) => {
  if (Array.isArray(data)) {
    await prisma.vehicle.createMany({
      data,
      skipDuplicates: true,
    });
  }
};

/**
 * Busca todas los vehiculos activos en la base de datos
 * @returns Todas los vehiculos encontradas
 * @example
 * await findMany()
 * // returns - vehicles: [{...}, {...}]
 */
export const findMany = () =>
  prisma.vehicle.findMany({ where: { active: true } });

/**
 * Busca un vehiculo por el id dado
 * @param id Id vehiculo
 * @returns Vehiculo encontrada
 * @example
 * await findUnique(1)
 * // returns - vehicles : {...}
 */
export const findUnique = (id: number) =>
  prisma.vehicle.findUnique({ where: { id } });

/**
 * Actualiza un vehiculo por su id
 * @param id Id del vehiculo
 * @param data Datos a actualizar
 * @returns Vehiculo actualizado
 * @example
 * await update(1, { model: "R1" })
 */
export const update = (id: number, data: Partial<VehicleSchema>) =>
  !Array.isArray(data) &&
  prisma.vehicle.update({
    where: { id },
    data,
  });

/**
 * Inactiva un vehiculo de la base de datos por su id
 * @param id Id del vehiculo
 * @returns Nada
 * @example
 * await softDelete(1)
 */
export const softDelete = (id: number) =>
  prisma.vehicle.update({ where: { id }, data: { active: false } });
